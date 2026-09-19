import "server-only";
import { normalizeText } from "@/utils/text";
import { resolveAttachments, UploadError } from "@/lib/server/storage";
import { richTextToPlainText, sanitizeRichText } from "@/lib/richText/sanitize";
import type { JSONContent } from "@tiptap/react";
import type { UploadedFile } from "@/types/notice";

export const NOTICE_TITLE_MAX_LENGTH = 150;

export type ParsedNotice =
  | { ok: true; value: { title: string; content: JSONContent; contentText: string; attachments: UploadedFile[] } }
  | { ok: false; message: string };

function hasImage(node: JSONContent): boolean {
  return node.type === "image" || (node.content ?? []).some(hasImage);
}

export async function parseNoticeInput(body: Record<string, unknown>): Promise<ParsedNotice> {
  const title = normalizeText(body.title);
  if (!title) return { ok: false, message: "제목을 입력해 주세요." };
  if (title.length > NOTICE_TITLE_MAX_LENGTH) {
    return { ok: false, message: `제목은 ${NOTICE_TITLE_MAX_LENGTH}자 이내로 입력해 주세요.` };
  }

  const content = sanitizeRichText(body.content);
  if (!content) return { ok: false, message: "본문 형식이 올바르지 않습니다." };
  const contentText = richTextToPlainText(content);
  if (!contentText && !hasImage(content)) return { ok: false, message: "본문을 입력해 주세요." };

  try {
    const attachments = await resolveAttachments(body.attachments);
    return { ok: true, value: { title, content, contentText, attachments } };
  } catch (error) {
    if (error instanceof UploadError) return { ok: false, message: error.message };
    throw error;
  }
}
