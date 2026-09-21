import "server-only";
import {
  BOARD_CONSENT_VERSION,
  BOARD_COOLDOWN_SECONDS,
  BOARD_DUPLICATE_WINDOW_HOURS,
  BOARD_HOURLY_LIMIT,
  BOARD_PERSONAL_DATA_RETENTION_DAYS,
} from "@/constants/board";
import { decryptAuthorName, encryptAuthorName, maskAuthorName } from "@/lib/server/authorName";
import type { OpinionInput } from "@/lib/server/boardModeration";
import { getDb } from "@/lib/server/cloudflare";
import { sha256Hex } from "@/lib/server/crypto";
import { toPaginated } from "@/lib/server/pagination";
import { LIKE_ESCAPE_CLAUSE, toLikePattern } from "@/lib/server/sql";
import type { AdminBoardPost, BoardPostStatus, OpinionPost } from "@/types/board";
import type { Paginated } from "@/types/pagination";

interface BoardRow {
  id: number;
  content: string;
  district: string;
  /** 공개용 마스킹 이름(예: 김ㅇㅇ) */
  author: string;
  author_encrypted: string | null;
  created_at: string;
  status: BoardPostStatus;
  ip: string | null;
  user_agent: string | null;
  reviewed_at: string | null;
  review_note: string | null;
}

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60 * 1000).toISOString();

function toPublic(row: BoardRow): OpinionPost {
  return { id: row.id, content: row.content, district: row.district, author: row.author, createdAt: row.created_at };
}

async function toAdmin(row: BoardRow): Promise<AdminBoardPost> {
  return {
    ...toPublic(row),
    authorFullName: await decryptAuthorName(row.author_encrypted),
    status: row.status,
    ip: row.ip,
    userAgent: row.user_agent,
    reviewedAt: row.reviewed_at,
    reviewNote: row.review_note,
  };
}

export async function listApprovedPosts(page: number, pageSize: number): Promise<Paginated<OpinionPost>> {
  const db = getDb();
  const [count, rows] = await db.batch<{ total: number } | BoardRow>([
    db.prepare("SELECT COUNT(*) AS total FROM board_posts WHERE status = 'approved'"),
    db
      .prepare(
        "SELECT id, content, district, author, created_at FROM board_posts WHERE status = 'approved' ORDER BY reviewed_at DESC, id DESC LIMIT ? OFFSET ?",
      )
      .bind(pageSize, (page - 1) * pageSize),
  ]);
  const total = (count.results[0] as { total: number } | undefined)?.total ?? 0;
  return toPaginated((rows.results as BoardRow[]).map(toPublic), total, page, pageSize);
}

export interface AdminBoardFilter {
  status?: BoardPostStatus;
  query?: string;
}

export async function listPostsForAdmin(
  filter: AdminBoardFilter,
  page: number,
  pageSize: number,
): Promise<Paginated<AdminBoardPost> & { counts: Record<BoardPostStatus, number> }> {
  const conditions: string[] = [];
  const params: string[] = [];
  if (filter.status) {
    conditions.push("status = ?");
    params.push(filter.status);
  }
  const query = filter.query?.trim().slice(0, 50);
  if (query) {
    conditions.push(`(content LIKE ? ${LIKE_ESCAPE_CLAUSE} OR author LIKE ? ${LIKE_ESCAPE_CLAUSE} OR ip LIKE ? ${LIKE_ESCAPE_CLAUSE})`);
    const like = toLikePattern(query);
    params.push(like, like, like);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const db = getDb();
  const [count, rows, statusCounts] = await db.batch<unknown>([
    db.prepare(`SELECT COUNT(*) AS total FROM board_posts ${where}`).bind(...params),
    db
      .prepare(`SELECT * FROM board_posts ${where} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`)
      .bind(...params, pageSize, (page - 1) * pageSize),
    db.prepare("SELECT status, COUNT(*) AS total FROM board_posts GROUP BY status"),
  ]);

  const counts: Record<BoardPostStatus, number> = { pending: 0, approved: 0, rejected: 0 };
  for (const row of statusCounts.results as { status: BoardPostStatus; total: number }[]) counts[row.status] = row.total;

  const total = (count.results[0] as { total: number } | undefined)?.total ?? 0;
  const items = await Promise.all((rows.results as BoardRow[]).map(toAdmin));
  return { ...toPaginated(items, total, page, pageSize), counts };
}

export async function updatePostStatus(
  ids: number[],
  status: BoardPostStatus,
  adminId: number,
  note?: string | null,
): Promise<number> {
  if (ids.length === 0) return 0;
  const placeholders = ids.map(() => "?").join(",");
  const result = await getDb()
    .prepare(
      `UPDATE board_posts SET status = ?, reviewed_at = ?, reviewed_by = ?, review_note = ? WHERE id IN (${placeholders})`,
    )
    .bind(status, new Date().toISOString(), adminId, note?.trim() ? note.trim().slice(0, 200) : null, ...ids)
    .run();
  return result.meta.changes;
}

export async function deletePosts(ids: number[]): Promise<number> {
  if (ids.length === 0) return 0;
  const placeholders = ids.map(() => "?").join(",");
  const result = await getDb().prepare(`DELETE FROM board_posts WHERE id IN (${placeholders})`).bind(...ids).run();
  return result.meta.changes;
}

/** 안내문에 고지한 보유 기간이 지난 IP/User-Agent를 파기한다. 등록/관리 요청 때마다 가볍게 실행된다. */
export async function purgeExpiredPersonalData(): Promise<void> {
  await getDb()
    .prepare("UPDATE board_posts SET ip = NULL, user_agent = NULL WHERE ip IS NOT NULL AND created_at < ?")
    .bind(minutesAgo(BOARD_PERSONAL_DATA_RETENTION_DAYS * 24 * 60))
    .run();
}

export type SubmissionLimit =
  | { allowed: true; contentHash: string }
  | { allowed: false; reason: "cooldown" | "hourly" | "duplicate"; retryAfterSeconds: number };

export async function checkSubmissionLimit(ip: string, content: string): Promise<SubmissionLimit> {
  const contentHash = await sha256Hex(content.replace(/\s+/g, "").toLowerCase());
  const db = getDb();
  const [latest, hourly, duplicate] = await db.batch<unknown>([
    db.prepare("SELECT created_at FROM board_posts WHERE ip = ? ORDER BY created_at DESC LIMIT 1").bind(ip),
    db.prepare("SELECT COUNT(*) AS total FROM board_posts WHERE ip = ? AND created_at > ?").bind(ip, minutesAgo(60)),
    db
      .prepare("SELECT 1 FROM board_posts WHERE content_hash = ? AND ip = ? AND created_at > ? LIMIT 1")
      .bind(contentHash, ip, minutesAgo(BOARD_DUPLICATE_WINDOW_HOURS * 60)),
  ]);

  const latestAt = (latest.results[0] as { created_at: string } | undefined)?.created_at;
  if (latestAt) {
    const elapsedSeconds = (Date.now() - new Date(latestAt).getTime()) / 1000;
    if (elapsedSeconds < BOARD_COOLDOWN_SECONDS) {
      return { allowed: false, reason: "cooldown", retryAfterSeconds: Math.ceil(BOARD_COOLDOWN_SECONDS - elapsedSeconds) };
    }
  }
  if (((hourly.results[0] as { total: number } | undefined)?.total ?? 0) >= BOARD_HOURLY_LIMIT) {
    return { allowed: false, reason: "hourly", retryAfterSeconds: 60 * 60 };
  }
  if (duplicate.results.length > 0) {
    return { allowed: false, reason: "duplicate", retryAfterSeconds: BOARD_COOLDOWN_SECONDS };
  }
  return { allowed: true, contentHash };
}

export async function createPendingPost(
  input: OpinionInput,
  meta: { ip: string; userAgent: string; contentHash: string },
): Promise<number> {
  const now = new Date().toISOString();
  const row = await getDb()
    .prepare(
      `INSERT INTO board_posts (content, district, author, author_encrypted, ip, user_agent, content_hash, consent_version, consented_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    )
    .bind(
      input.content,
      input.district,
      maskAuthorName(input.author),
      await encryptAuthorName(input.author),
      meta.ip,
      meta.userAgent,
      meta.contentHash,
      BOARD_CONSENT_VERSION,
      now,
      now,
    )
    .first<{ id: number }>();
  if (!row) throw new Error("의견 저장에 실패했습니다.");
  return row.id;
}
