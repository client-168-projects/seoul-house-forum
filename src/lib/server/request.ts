import "server-only";

/** Cloudflare가 붙여 주는 cf-connecting-ip가 신뢰 가능한 원본 IP다. */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function getUserAgent(headers: Headers): string {
  return (headers.get("user-agent") ?? "").slice(0, 300);
}

/**
 * 쿠키 인증을 쓰는 상태 변경 요청(POST/PATCH/DELETE)의 CSRF 방어.
 * SameSite=Strict 쿠키와 함께 Origin 헤더가 현재 호스트와 같을 때만 허용한다.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
