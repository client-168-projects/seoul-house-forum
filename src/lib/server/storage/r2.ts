import "server-only";
import type { StorageDriver } from "@/lib/server/storage/driver";

/** Cloudflare R2 바인딩. Worker와 같은 계정의 버킷에만 붙일 수 있다. */
export function createR2Driver(bucket: R2Bucket): StorageDriver {
  return {
    name: "r2",
    async put(key, bytes, contentType) {
      await bucket.put(key, bytes, { httpMetadata: { contentType } });
    },
    async get(key) {
      const object = await bucket.get(key);
      return object ? { body: object.body, etag: object.httpEtag } : null;
    },
    async delete(keys) {
      await bucket.delete(keys);
    },
  };
}
