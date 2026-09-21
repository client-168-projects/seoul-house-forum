import "server-only";
import type { JSONContent } from "@tiptap/react";
import { getDb } from "@/lib/server/cloudflare";
import { toPaginated } from "@/lib/server/pagination";
import { LIKE_ESCAPE_CLAUSE, toLikePattern } from "@/lib/server/sql";
import { deleteUploads, fileUrl } from "@/lib/server/storage";
import type { NoticeAttachment, NoticeDetail, NoticeSummary, UploadedFile } from "@/types/notice";
import type { Paginated } from "@/types/pagination";

export type NoticeSearchField = "title" | "content";

interface NoticeRow {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  attachment_count: number;
}

interface NoticeDetailRow extends NoticeRow {
  content_json: string;
  content_text: string;
}

interface AttachmentRow {
  id: number;
  r2_key: string;
  file_name: string;
  content_type: string;
  size: number;
}

const SUMMARY_COLUMNS = `n.id, n.title, n.created_at, n.updated_at,
  (SELECT COUNT(*) FROM notice_attachments a WHERE a.notice_id = n.id) AS attachment_count`;

function toSummary(row: NoticeRow): NoticeSummary {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    attachmentCount: row.attachment_count,
  };
}

function toAttachment(row: AttachmentRow): NoticeAttachment {
  return {
    id: row.id,
    fileName: row.file_name,
    contentType: row.content_type,
    size: row.size,
    url: fileUrl(row.r2_key),
  };
}

export async function listNotices(options: {
  page: number;
  pageSize: number;
  query?: string;
  field?: NoticeSearchField;
}): Promise<Paginated<NoticeSummary>> {
  const { page, pageSize } = options;
  const query = options.query?.trim().slice(0, 50);
  const column = options.field === "content" ? "n.content_text" : "n.title";
  const where = query ? `WHERE ${column} LIKE ? ${LIKE_ESCAPE_CLAUSE}` : "";
  const params = query ? [toLikePattern(query)] : [];

  const db = getDb();
  const [countResult, rowsResult] = await db.batch<{ total: number } | NoticeRow>([
    db.prepare(`SELECT COUNT(*) AS total FROM notices n ${where}`).bind(...params),
    db
      .prepare(`SELECT ${SUMMARY_COLUMNS} FROM notices n ${where} ORDER BY n.created_at DESC, n.id DESC LIMIT ? OFFSET ?`)
      .bind(...params, pageSize, (page - 1) * pageSize),
  ]);

  const total = (countResult.results[0] as { total: number } | undefined)?.total ?? 0;
  return toPaginated((rowsResult.results as NoticeRow[]).map(toSummary), total, page, pageSize);
}

/** 사이트맵용 최소 조회. 최신순 상위 1000건만 포함한다. */
export async function listSitemapNotices(): Promise<{ id: number; updatedAt: string }[]> {
  const rows = await getDb()
    .prepare("SELECT id, updated_at FROM notices ORDER BY created_at DESC LIMIT 1000")
    .all<{ id: number; updated_at: string }>();
  return rows.results.map((row) => ({ id: row.id, updatedAt: row.updated_at }));
}

export async function getNotice(id: number): Promise<NoticeDetail | null> {
  const db = getDb();
  const [noticeResult, attachmentResult] = await db.batch<NoticeDetailRow | AttachmentRow>([
    db.prepare(`SELECT ${SUMMARY_COLUMNS}, n.content_json, n.content_text FROM notices n WHERE n.id = ?`).bind(id),
    db
      .prepare("SELECT id, r2_key, file_name, content_type, size FROM notice_attachments WHERE notice_id = ? ORDER BY id")
      .bind(id),
  ]);

  const row = noticeResult.results[0] as NoticeDetailRow | undefined;
  if (!row) return null;

  return {
    ...toSummary(row),
    content: JSON.parse(row.content_json) as JSONContent,
    contentText: row.content_text,
    attachments: (attachmentResult.results as AttachmentRow[]).map(toAttachment),
  };
}

/** 목록이 최신순이므로 이전글 = 더 먼저 올라온 글, 다음글 = 더 나중에 올라온 글 */
export async function getNoticeNeighbors(notice: NoticeSummary) {
  const db = getDb();
  const [previous, next] = await db.batch<NoticeRow>([
    db
      .prepare(
        `SELECT ${SUMMARY_COLUMNS} FROM notices n WHERE (n.created_at, n.id) < (?, ?) ORDER BY n.created_at DESC, n.id DESC LIMIT 1`,
      )
      .bind(notice.createdAt, notice.id),
    db
      .prepare(
        `SELECT ${SUMMARY_COLUMNS} FROM notices n WHERE (n.created_at, n.id) > (?, ?) ORDER BY n.created_at ASC, n.id ASC LIMIT 1`,
      )
      .bind(notice.createdAt, notice.id),
  ]);
  const toOptional = (rows: NoticeRow[]) => (rows[0] ? toSummary(rows[0]) : undefined);
  return { previous: toOptional(previous.results), next: toOptional(next.results) };
}

interface SaveNoticeData {
  title: string;
  content: JSONContent;
  contentText: string;
  attachments: UploadedFile[];
}

function attachmentInserts(db: D1Database, noticeId: number, attachments: UploadedFile[]) {
  return attachments.map((file) =>
    db
      .prepare(
        "INSERT INTO notice_attachments (notice_id, r2_key, file_name, content_type, size) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(noticeId, file.key, file.fileName, file.contentType, file.size),
  );
}

export async function createNotice(data: SaveNoticeData, authorId: number): Promise<number> {
  const db = getDb();
  const inserted = await db
    .prepare("INSERT INTO notices (title, content_json, content_text, author_id) VALUES (?, ?, ?, ?) RETURNING id")
    .bind(data.title, JSON.stringify(data.content), data.contentText, authorId)
    .first<{ id: number }>();
  if (!inserted) throw new Error("공지 저장에 실패했습니다.");

  if (data.attachments.length > 0) await db.batch(attachmentInserts(db, inserted.id, data.attachments));
  return inserted.id;
}

/** 첨부 목록은 요청에 담긴 것이 최종 상태다. 빠진 파일은 DB와 R2에서 함께 지운다. */
export async function updateNotice(id: number, data: SaveNoticeData): Promise<boolean> {
  const db = getDb();
  const existing = await db
    .prepare("SELECT r2_key FROM notice_attachments WHERE notice_id = ?")
    .bind(id)
    .all<{ r2_key: string }>();

  const keepKeys = new Set(data.attachments.map((file) => file.key));
  const existingKeys = new Set(existing.results.map((row) => row.r2_key));
  const removedKeys = [...existingKeys].filter((key) => !keepKeys.has(key));
  const newFiles = data.attachments.filter((file) => !existingKeys.has(file.key));

  const [updateResult] = await db.batch([
    db
      .prepare("UPDATE notices SET title = ?, content_json = ?, content_text = ?, updated_at = ? WHERE id = ?")
      .bind(data.title, JSON.stringify(data.content), data.contentText, new Date().toISOString(), id),
    ...removedKeys.map((key) => db.prepare("DELETE FROM notice_attachments WHERE r2_key = ?").bind(key)),
    ...attachmentInserts(db, id, newFiles),
  ]);
  if (updateResult.meta.changes === 0) return false;

  if (removedKeys.length > 0) await deleteUploads(removedKeys);
  return true;
}

export async function deleteNotice(id: number): Promise<boolean> {
  const db = getDb();
  const attachments = await db
    .prepare("SELECT r2_key FROM notice_attachments WHERE notice_id = ?")
    .bind(id)
    .all<{ r2_key: string }>();
  const result = await db.prepare("DELETE FROM notices WHERE id = ?").bind(id).run();
  if (result.meta.changes === 0) return false;

  const keys = attachments.results.map((row) => row.r2_key);
  if (keys.length > 0) await deleteUploads(keys);
  return true;
}
