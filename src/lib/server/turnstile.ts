import "server-only";
import { TURNSTILE_ACTION } from "@/constants/board";
import { getEnv } from "@/lib/server/cloudflare";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface SiteverifyResponse {
  success: boolean;
  action?: string;
  "error-codes"?: string[];
}

/** Turnstile 토큰은 1회용이며 5분간 유효하다. 반드시 서버에서 검증해야 효력이 있다. */
export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = getEnv().TURNSTILE_SECRET_KEY;
  if (!secret || !token || token.length > 2048) return false;

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip !== "unknown") body.append("remoteip", ip);
  body.append("idempotency_key", crypto.randomUUID());

  try {
    const response = await fetch(SITEVERIFY_URL, { method: "POST", body });
    if (!response.ok) return false;
    const result = (await response.json()) as SiteverifyResponse;
    // 테스트 키는 action을 돌려주지 않으므로 action이 있을 때만 대조한다.
    return result.success && (!result.action || result.action === TURNSTILE_ACTION);
  } catch {
    return false;
  }
}
