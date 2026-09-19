import "server-only";
import { getBucket } from "@/lib/server/cloudflare";
import type { UploadedFile } from "@/types/notice";
import { INVISIBLE_CHAR_PATTERN } from "@/utils/text";

export type UploadKind = "attachments" | "editor";

const MB = 1024 * 1024;

/** 에디터 이미지는 실제 바이트 시그니처로 형식을 판별한다. SVG는 스크립트를 담을 수 있어 받지 않는다. */
const IMAGE_SIGNATURES: { type: string; ext: string; matches: (bytes: Uint8Array) => boolean }[] = [
  { type: "image/jpeg", ext: ".jpg", matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: "image/png", ext: ".png", matches: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { type: "image/gif", ext: ".gif", matches: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 },
  {
    type: "image/webp",
    ext: ".webp",
    matches: (b) => b[0] === 0x52 && b[1] === 0x49 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  },
];

const ATTACHMENT_EXTENSIONS = new Set([
  "pdf", "hwp", "hwpx", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "zip", "jpg", "jpeg", "png", "gif", "webp",
]);

export const UPLOAD_LIMITS: Record<UploadKind, number> = {
  attachments: 20 * MB,
  editor: 5 * MB,
};

const KEY_PATTERN = /^(attachments|editor)\/[0-9a-f-]{36}(\.[a-z0-9]{1,5})?$/;

export function isValidFileKey(key: string, kind?: UploadKind): boolean {
  return KEY_PATTERN.test(key) && (!kind || key.startsWith(`${kind}/`));
}

export function fileUrl(key: string): string {
  return `/api/files/${key}`;
}

export class UploadError extends Error {}

function sanitizeFileName(name: string): string {
  const cleaned = name.replace(INVISIBLE_CHAR_PATTERN, "_").replace(/[\\/:*?"<>|]/g, "_").trim();
  return (cleaned || "file").slice(0, 150);
}

export async function storeUpload(file: File, kind: UploadKind): Promise<UploadedFile> {
  if (file.size === 0) throw new UploadError("빈 파일은 업로드할 수 없습니다.");
  if (file.size > UPLOAD_LIMITS[kind]) {
    throw new UploadError(`파일 크기는 ${UPLOAD_LIMITS[kind] / MB}MB 이하여야 합니다.`);
  }

  const fileName = sanitizeFileName(file.name);
  const bytes = new Uint8Array(await file.arrayBuffer());
  let contentType: string;
  let extension: string;

  if (kind === "editor") {
    const signature = IMAGE_SIGNATURES.find((candidate) => candidate.matches(bytes));
    if (!signature) throw new UploadError("JPG, PNG, GIF, WEBP 이미지만 삽입할 수 있습니다.");
    contentType = signature.type;
    extension = signature.ext;
  } else {
    const rawExtension = fileName.split(".").pop()?.toLowerCase() ?? "";
    if (!ATTACHMENT_EXTENSIONS.has(rawExtension)) {
      throw new UploadError("허용되지 않는 파일 형식입니다. (PDF, HWP, 오피스 문서, 이미지, ZIP 등)");
    }
    contentType = file.type && file.type.length < 100 ? file.type : "application/octet-stream";
    extension = `.${rawExtension}`;
  }

  const key = `${kind}/${crypto.randomUUID()}${extension}`;
  await getBucket().put(key, bytes, {
    httpMetadata: { contentType },
    customMetadata: { fileName: encodeURIComponent(fileName) },
  });

  return { key, url: fileUrl(key), fileName, contentType, size: file.size };
}

/**
 * 공지 저장 시 클라이언트가 보낸 첨부 메타데이터를 그대로 믿지 않고 R2 원본으로 다시 채운다.
 * 존재하지 않거나 첨부 영역이 아닌 키는 거부한다.
 */
export async function resolveAttachments(input: unknown): Promise<UploadedFile[]> {
  if (!Array.isArray(input)) return [];
  if (input.length > 10) throw new UploadError("첨부파일은 최대 10개까지 등록할 수 있습니다.");

  const bucket = getBucket();
  return Promise.all(
    input.map(async (item) => {
      const key = typeof item?.key === "string" ? item.key : "";
      if (!isValidFileKey(key, "attachments")) throw new UploadError("잘못된 첨부파일입니다.");
      const object = await bucket.head(key);
      if (!object) throw new UploadError("첨부파일을 찾을 수 없습니다. 다시 업로드해 주세요.");
      return {
        key,
        url: fileUrl(key),
        fileName: decodeURIComponent(object.customMetadata?.fileName ?? "file"),
        contentType: object.httpMetadata?.contentType ?? "application/octet-stream",
        size: object.size,
      };
    }),
  );
}
