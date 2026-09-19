import "server-only";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { ADMIN_LOGIN_PATH } from "@/constants/auth";
import { getSession, type AdminSession } from "@/lib/server/auth/session";
import { isSameOrigin } from "@/lib/server/request";

/**
 * Data Access Layer. proxy.ts는 쿠키 존재만 보는 낙관적 검사이므로,
 * 실제 권한 판정은 관리자 데이터에 접근하는 모든 페이지/액션/API가 여기서 다시 한다.
 */
export async function verifyAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) redirect(ADMIN_LOGIN_PATH);
  return session;
}

type ApiGuardResult = { session: AdminSession; error?: never } | { session?: never; error: NextResponse };

export async function guardAdminApi(request: Request): Promise<ApiGuardResult> {
  const isMutation = !["GET", "HEAD"].includes(request.method);
  if (isMutation && !isSameOrigin(request)) {
    return { error: NextResponse.json({ message: "허용되지 않은 요청 출처입니다." }, { status: 403 }) };
  }

  const session = await getSession();
  if (!session) {
    return { error: NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 }) };
  }
  return { session };
}
