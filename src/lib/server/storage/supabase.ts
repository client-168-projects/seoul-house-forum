import "server-only";
import { StorageError, type StorageDriver } from "@/lib/server/storage/driver";

export interface SupabaseStorageConfig {
  url: string;
  serviceRoleKey: string;
  bucket: string;
}

/**
 * Supabase Storage REST API.
 * service_role 키는 버킷 정책을 무시하므로 반드시 서버에서만 사용한다(Worker 시크릿).
 * 파일은 항상 /api/files 라우트를 거쳐 나가므로 버킷은 비공개로 두면 된다.
 */
export function createSupabaseDriver(config: SupabaseStorageConfig): StorageDriver {
  const base = `${config.url.replace(/\/+$/, "")}/storage/v1/object`;
  const authHeaders = {
    authorization: `Bearer ${config.serviceRoleKey}`,
    apikey: config.serviceRoleKey,
  };

  return {
    name: "supabase",

    async put(key, bytes, contentType) {
      const response = await fetch(`${base}/${config.bucket}/${key}`, {
        method: "POST",
        headers: { ...authHeaders, "content-type": contentType, "x-upsert": "true", "cache-control": "31536000" },
        body: bytes as BodyInit,
      });
      if (!response.ok) {
        throw new StorageError(`Supabase 업로드 실패 (${response.status}) ${await response.text().catch(() => "")}`);
      }
    },

    async get(key) {
      const response = await fetch(`${base}/${config.bucket}/${key}`, { headers: authHeaders });
      if (response.status === 404 || response.status === 400) return null;
      if (!response.ok || !response.body) throw new StorageError(`Supabase 조회 실패 (${response.status})`);
      return { body: response.body, etag: response.headers.get("etag") ?? undefined };
    },

    async delete(keys) {
      if (keys.length === 0) return;
      const response = await fetch(`${base}/${config.bucket}`, {
        method: "DELETE",
        headers: { ...authHeaders, "content-type": "application/json" },
        body: JSON.stringify({ prefixes: keys }),
      });
      // 이미 없는 파일을 지우려 한 경우(404)는 성공으로 본다.
      if (!response.ok && response.status !== 404) {
        throw new StorageError(`Supabase 삭제 실패 (${response.status})`);
      }
    },
  };
}
