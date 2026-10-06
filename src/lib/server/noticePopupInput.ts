import "server-only";
import { getUploadMeta, isValidFileKey } from "@/lib/server/storage";
import type { NoticePopupInput, PopupSize } from "@/types/noticePopup";
import { validateNoticePopupInput } from "@/utils/noticePopup";

export type ParsedNoticePopup = { ok: true; value: NoticePopupInput } | { ok: false; message: string };

const asString = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export async function parseNoticePopupInput(body: Record<string, unknown>): Promise<ParsedNoticePopup> {
  const input: NoticePopupInput = {
    imageKey: asString(body.imageKey),
    imageWidth: Number(body.imageWidth),
    imageHeight: Number(body.imageHeight),
    targetUrl: asString(body.targetUrl),
    hideDurationDays: Number(body.hideDurationDays),
    startDate: asString(body.startDate),
    endDate: asString(body.endDate),
    isHidden: body.isHidden === true,
    size: asString(body.size) as PopupSize,
  };

  const message = validateNoticePopupInput(input);
  if (message) return { ok: false, message };

  // 클라이언트가 보낸 키를 그대로 믿지 않고, 실제로 팝업용으로 업로드된 파일인지 확인한다.
  const meta = isValidFileKey(input.imageKey, "popup") ? await getUploadMeta(input.imageKey) : null;
  if (!meta) return { ok: false, message: "팝업 이미지를 찾을 수 없습니다. 이미지를 다시 업로드해 주세요." };

  return { ok: true, value: input };
}
