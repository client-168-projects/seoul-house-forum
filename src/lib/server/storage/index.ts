import "server-only";
import { getEnv, getDb } from "@/lib/server/cloudflare";
import { claimPeriodicTask } from "@/lib/server/repositories/meta";
import { LIKE_ESCAPE_CLAUSE, toLikePattern } from "@/lib/server/sql";
import { StorageError, type StorageDriver, type StorageObject } from "@/lib/server/storage/driver";
import { createR2Driver } from "@/lib/server/storage/r2";
import { createSupabaseDriver } from "@/lib/server/storage/supabase";
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

export class UploadError extends Error {}

export function isValidFileKey(key: string, kind?: UploadKind): boolean {
  return KEY_PATTERN.test(key) && (!kind || key.startsWith(`${kind}/`));
}

export function fileUrl(key: string): string {
  return `/api/files/${key}`;
}

/**
 * 저장소 선택: Supabase 설정이 있으면 Supabase, 없으면 같은 계정의 R2 바인딩.
 * 두 경우 모두 파일 메타데이터는 D1 uploads 테이블에서 읽는다.
 */
function getDriver(): StorageDriver {
  const env = getEnv();
  const url = env.SUPABASE_URL?.trim();
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket = env.SUPABASE_STORAGE_BUCKET?.trim();

  if (url && serviceRoleKey && bucket) return createSupabaseDriver({ url, serviceRoleKey, bucket });

  // R2 바인딩은 현재 wrangler 설정에 없다. 같은 계정에 버킷을 만들어 FILES 바인딩을 추가하면 이 경로를 탄다.
  const r2 = (env as { FILES?: R2Bucket }).FILES;
  if (r2) return createR2Driver(r2);

  throw new StorageError(
    "파일 저장소가 설정되지 않았습니다. SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_STORAGE_BUCKET을 확인해 주세요.",
  );
}

export interface UploadMeta {
  key: string;
  kind: UploadKind;
  fileName: string;
  contentType: string;
  size: number;
}

interface UploadRow {
  key: string;
  kind: UploadKind;
  file_name: string;
  content_type: string;
  size: number;
}

const toMeta = (row: UploadRow): UploadMeta => ({
  key: row.key,
  kind: row.kind,
  fileName: row.file_name,
  contentType: row.content_type,
  size: row.size,
});

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
  await getDriver().put(key, bytes, contentType);
  await getDb()
    .prepare("INSERT INTO uploads (key, kind, file_name, content_type, size) VALUES (?, ?, ?, ?, ?)")
    .bind(key, kind, fileName, contentType, file.size)
    .run();

  return { key, url: fileUrl(key), fileName, contentType, size: file.size };
}

export async function getUploadMeta(key: string): Promise<UploadMeta | null> {
  const row = await getDb()
    .prepare("SELECT key, kind, file_name, content_type, size FROM uploads WHERE key = ?")
    .bind(key)
    .first<UploadRow>();
  return row ? toMeta(row) : null;
}

export function readUpload(key: string): Promise<StorageObject | null> {
  return getDriver().get(key);
}

export async function deleteUploads(keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  await getDriver().delete(keys);
  const placeholders = keys.map(() => "?").join(",");
  await getDb().prepare(`DELETE FROM uploads WHERE key IN (${placeholders})`).bind(...keys).run();
}

/**
 * 공지 저장 시 클라이언트가 보낸 첨부 메타데이터를 그대로 믿지 않고 업로드 기록으로 다시 채운다.
 * 존재하지 않거나 첨부 영역이 아닌 키는 거부한다.
 */
export async function resolveAttachments(input: unknown): Promise<UploadedFile[]> {
  if (!Array.isArray(input)) return [];
  if (input.length > 10) throw new UploadError("첨부파일은 최대 10개까지 등록할 수 있습니다.");

  const keys = input.map((item) => (typeof item?.key === "string" ? item.key : ""));
  if (keys.some((key) => !isValidFileKey(key, "attachments"))) throw new UploadError("잘못된 첨부파일입니다.");
  if (keys.length === 0) return [];

  const placeholders = keys.map(() => "?").join(",");
  const rows = await getDb()
    .prepare(`SELECT key, kind, file_name, content_type, size FROM uploads WHERE key IN (${placeholders})`)
    .bind(...keys)
    .all<UploadRow>();

  const byKey = new Map(rows.results.map((row) => [row.key, toMeta(row)]));
  return keys.map((key) => {
    const meta = byKey.get(key);
    if (!meta) throw new UploadError("첨부파일을 찾을 수 없습니다. 다시 업로드해 주세요.");
    return { key, url: fileUrl(key), fileName: meta.fileName, contentType: meta.contentType, size: meta.size };
  });
}

/** 업로드 후 이 시간이 지나도 어떤 공지에서도 참조하지 않는 파일을 정리 대상으로 본다. */
const ORPHAN_MIN_AGE_MS = 24 * 60 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
const MAX_CANDIDATES = 100;

/**
 * 공지를 저장하지 않고 나간 경우 남는 파일을 정리한다.
 * 공지 목록을 열 때 호출되며, claimPeriodicTask 덕분에 실제 실행은 1시간에 한 번이다.
 */
export async function cleanupOrphanUploads(): Promise<number> {
  if (!(await claimPeriodicTask("cleanup-orphan-uploads", CLEANUP_INTERVAL_MS))) return 0;

  const db = getDb();
  const candidates = await db
    .prepare("SELECT key, kind FROM uploads WHERE created_at < ? ORDER BY created_at LIMIT ?")
    .bind(new Date(Date.now() - ORPHAN_MIN_AGE_MS).toISOString(), MAX_CANDIDATES)
    .all<{ key: string; kind: UploadKind }>();
  if (candidates.results.length === 0) return 0;

  const attachmentKeys = candidates.results.filter((row) => row.kind === "attachments").map((row) => row.key);
  const orphans: string[] = [];

  if (attachmentKeys.length > 0) {
    const placeholders = attachmentKeys.map(() => "?").join(",");
    const used = await db
      .prepare(`SELECT r2_key FROM notice_attachments WHERE r2_key IN (${placeholders})`)
      .bind(...attachmentKeys)
      .all<{ r2_key: string }>();
    const usedKeys = new Set(used.results.map((row) => row.r2_key));
    orphans.push(...attachmentKeys.filter((key) => !usedKeys.has(key)));
  }

  // 에디터 이미지는 본문 JSON 안에 URL로만 남아 있어 키 단위로 조회한다.
  for (const row of candidates.results.filter((candidate) => candidate.kind === "editor")) {
    const referenced = await db
      .prepare(`SELECT 1 FROM notices WHERE content_json LIKE ? ${LIKE_ESCAPE_CLAUSE} LIMIT 1`)
      .bind(toLikePattern(fileUrl(row.key)))
      .first();
    if (!referenced) orphans.push(row.key);
  }

  await deleteUploads(orphans);
  return orphans.length;
}
