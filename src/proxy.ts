import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_LOGIN_PATH, ADMIN_SESSION_COOKIE } from "@/constants/auth";

/**
 * 낙관적 인증 검사. 세션 쿠키가 아예 없는 요청만 빠르게 걸러내고,
 * 쿠키의 유효성(만료/위조)은 페이지와 API의 DAL(verifyAdmin, guardAdminApi)이 DB로 확인한다.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSessionCookie = request.cookies.has(ADMIN_SESSION_COOKIE);

  if (pathname === ADMIN_LOGIN_PATH || hasSessionCookie) {
    return withNoIndex(NextResponse.next(), pathname);
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return withNoIndex(NextResponse.redirect(loginUrl), pathname);
}

function withNoIndex(response: NextResponse, pathname: string) {
  if (!pathname.startsWith("/api/")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
