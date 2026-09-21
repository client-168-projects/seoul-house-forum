import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/** 요청 처리 중(동적 렌더링, Route Handler, Server Action)에서만 호출한다. */
export function getEnv(): CloudflareEnv {
  return getCloudflareContext().env;
}

export function getDb(): D1Database {
  return getEnv().DB;
}
