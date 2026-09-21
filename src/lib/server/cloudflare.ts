import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * 런타임 환경 변수.
 * 시크릿은 대시보드/`wrangler secret`으로 주입되어 자동 생성 타입(cloudflare-env.d.ts)에 잡히지 않으므로
 * 여기서 직접 선언한다. 값이 없을 수 있으니 전부 선택 속성이다.
 */
type AppEnv = CloudflareEnv & {
  TURNSTILE_SECRET_KEY?: string;
  BOARD_AUTHOR_KEY?: string;
  GA4_CLIENT_EMAIL?: string;
  GA4_PRIVATE_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_STORAGE_BUCKET?: string;
  /** 같은 계정에 R2 버킷을 만들어 바인딩하면 채워진다. */
  FILES?: R2Bucket;
};

/** 요청 처리 중(동적 렌더링, Route Handler, Server Action)에서만 호출한다. */
export function getEnv(): AppEnv {
  return getCloudflareContext().env as AppEnv;
}

export function getDb(): D1Database {
  return getEnv().DB;
}
