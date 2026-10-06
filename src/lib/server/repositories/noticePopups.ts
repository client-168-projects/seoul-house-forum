import "server-only";
import { getDb } from "@/lib/server/cloudflare";
import { deleteUploads, fileUrl } from "@/lib/server/storage";
import type { NoticePopup, NoticePopupInput, PopupSize, PublicNoticePopup } from "@/types/noticePopup";

interface NoticePopupRow {
  id: number;
  image_key: string;
  image_width: number;
  image_height: number;
  target_url: string | null;
  hide_duration_days: number;
  start_date: string;
  end_date: string;
  priority: number;
  is_hidden: number;
  size: PopupSize;
  created_at: string;
  updated_at: string;
}

const SELECT_POPUPS = `SELECT id, image_key, image_width, image_height, target_url, hide_duration_days,
  start_date, end_date, priority, is_hidden, size, created_at, updated_at FROM notice_popups`;

const ORDER_BY = "ORDER BY priority DESC, created_at ASC, id ASC";

const NOW = "strftime('%Y-%m-%dT%H:%M:%fZ', 'now')";

const toPopup = (row: NoticePopupRow): NoticePopup => ({
  id: row.id,
  imageKey: row.image_key,
  imageUrl: fileUrl(row.image_key),
  imageWidth: row.image_width,
  imageHeight: row.image_height,
  targetUrl: row.target_url,
  hideDurationDays: row.hide_duration_days,
  startDate: row.start_date,
  endDate: row.end_date,
  priority: row.priority,
  isHidden: row.is_hidden === 1,
  size: row.size,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toPublicPopup = (row: NoticePopupRow): PublicNoticePopup => ({
  id: row.id,
  imageUrl: fileUrl(row.image_key),
  imageWidth: row.image_width,
  imageHeight: row.image_height,
  targetUrl: row.target_url,
  hideDurationDays: row.hide_duration_days,
  size: row.size,
});

/** 팝업 이미지 삭제 실패는 고아 업로드 정리에서 다시 처리되므로 저장 자체를 실패시키지 않는다. */
async function removeImage(key: string): Promise<void> {
  try {
    await deleteUploads([key]);
  } catch (error) {
    console.error("[notice-popups] 이미지 삭제 실패", error);
  }
}

export async function listNoticePopups(): Promise<NoticePopup[]> {
  const rows = await getDb().prepare(`${SELECT_POPUPS} ${ORDER_BY}`).all<NoticePopupRow>();
  return rows.results.map(toPopup);
}

/**
 * 숨김이 아니고 오늘(KST)이 게시 기간 안에 있는 팝업.
 * date('now')는 UTC라 +9시간 고정 오프셋으로 한국 날짜를 맞춘다(한국은 DST 없음).
 */
export async function listActiveNoticePopups(): Promise<PublicNoticePopup[]> {
  const rows = await getDb()
    .prepare(
      `${SELECT_POPUPS}
       WHERE is_hidden = 0 AND date('now', '+9 hours') BETWEEN start_date AND end_date
       ${ORDER_BY}`,
    )
    .all<NoticePopupRow>();
  return rows.results.map(toPublicPopup);
}

/** 새 팝업은 기존 최고 우선순위보다 10 높게 넣어 목록 맨 위(가장 먼저 노출)에 둔다. */
export async function createNoticePopup(input: NoticePopupInput): Promise<number> {
  const row = await getDb()
    .prepare(
      `INSERT INTO notice_popups
         (image_key, image_width, image_height, target_url, hide_duration_days, start_date, end_date, is_hidden, size, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT COALESCE(MAX(priority), 90) + 10 FROM notice_popups))
       RETURNING id`,
    )
    .bind(
      input.imageKey,
      input.imageWidth,
      input.imageHeight,
      input.targetUrl || null,
      input.hideDurationDays,
      input.startDate,
      input.endDate,
      input.isHidden ? 1 : 0,
      input.size,
    )
    .first<{ id: number }>();
  if (!row) throw new Error("팝업을 저장하지 못했습니다.");
  return row.id;
}

export async function updateNoticePopup(id: number, input: NoticePopupInput): Promise<boolean> {
  const db = getDb();
  const existing = await db
    .prepare("SELECT image_key FROM notice_popups WHERE id = ?")
    .bind(id)
    .first<{ image_key: string }>();
  if (!existing) return false;

  await db
    .prepare(
      `UPDATE notice_popups
       SET image_key = ?, image_width = ?, image_height = ?, target_url = ?, hide_duration_days = ?,
           start_date = ?, end_date = ?, is_hidden = ?, size = ?, updated_at = ${NOW}
       WHERE id = ?`,
    )
    .bind(
      input.imageKey,
      input.imageWidth,
      input.imageHeight,
      input.targetUrl || null,
      input.hideDurationDays,
      input.startDate,
      input.endDate,
      input.isHidden ? 1 : 0,
      input.size,
      id,
    )
    .run();

  if (existing.image_key !== input.imageKey) await removeImage(existing.image_key);
  return true;
}

export async function deleteNoticePopup(id: number): Promise<boolean> {
  const deleted = await getDb()
    .prepare("DELETE FROM notice_popups WHERE id = ? RETURNING image_key")
    .bind(id)
    .first<{ image_key: string }>();
  if (!deleted) return false;

  await removeImage(deleted.image_key);
  return true;
}

/**
 * 한 칸 위/아래로 옮긴다. 우선순위 값이 겹쳐 있어도 확실히 바뀌도록,
 * 새 순서대로 우선순위를 10 간격으로 다시 매기고 달라진 행만 일괄 갱신한다.
 */
export async function moveNoticePopup(id: number, direction: "up" | "down"): Promise<boolean> {
  const db = getDb();
  const rows = await db.prepare(`SELECT id, priority FROM notice_popups ${ORDER_BY}`).all<{ id: number; priority: number }>();
  const order = rows.results;
  const index = order.findIndex((row) => row.id === id);
  if (index === -1) return false;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= order.length) return true;
  [order[index], order[swapIndex]] = [order[swapIndex], order[index]];

  const statements = order.flatMap((row, position) => {
    const priority = (order.length - position) * 10 + 90;
    return row.priority === priority
      ? []
      : [db.prepare(`UPDATE notice_popups SET priority = ?, updated_at = ${NOW} WHERE id = ?`).bind(priority, row.id)];
  });
  if (statements.length > 0) await db.batch(statements);
  return true;
}
