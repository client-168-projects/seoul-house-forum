"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LOGIN_LOCK_MINUTES, LOGIN_MAX_FAILURES } from "@/constants/auth";
import { burnPasswordCheck, verifyPassword } from "@/lib/server/auth/password";
import { createSession, destroySession } from "@/lib/server/auth/session";
import { getDb } from "@/lib/server/cloudflare";
import { getClientIp, getUserAgent } from "@/lib/server/request";

export interface LoginState {
  message?: string;
  username?: string;
}

interface AdminRow {
  id: number;
  password_hash: string;
  password_salt: string;
  password_iterations: number;
}

const GENERIC_FAILURE = "아이디 또는 비밀번호가 올바르지 않습니다.";

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = safeNextPath(formData.get("next"));

  if (!username || !password || username.length > 40 || password.length > 200) {
    return { message: "아이디와 비밀번호를 입력해 주세요.", username };
  }

  const requestHeaders = await headers();
  const ip = getClientIp(requestHeaders);
  const db = getDb();
  const since = new Date(Date.now() - LOGIN_LOCK_MINUTES * 60 * 1000).toISOString();

  const failures = await db
    .prepare("SELECT COUNT(*) AS count FROM login_attempts WHERE ip = ? AND attempted_at > ?")
    .bind(ip, since)
    .first<{ count: number }>();
  if ((failures?.count ?? 0) >= LOGIN_MAX_FAILURES) {
    return {
      message: `로그인 실패가 반복되어 ${LOGIN_LOCK_MINUTES}분간 로그인이 제한됩니다. 잠시 후 다시 시도해 주세요.`,
      username,
    };
  }

  const admin = await db
    .prepare("SELECT id, password_hash, password_salt, password_iterations FROM admins WHERE username = ?")
    .bind(username)
    .first<AdminRow>();

  const valid = admin
    ? await verifyPassword(password, {
        hash: admin.password_hash,
        salt: admin.password_salt,
        iterations: admin.password_iterations,
      })
    : (await burnPasswordCheck(password), false);

  if (!admin || !valid) {
    await db.prepare("INSERT INTO login_attempts (ip, username) VALUES (?, ?)").bind(ip, username).run();
    return { message: GENERIC_FAILURE, username };
  }

  const now = new Date().toISOString();
  await db.batch([
    db.prepare("DELETE FROM login_attempts WHERE ip = ?").bind(ip),
    db.prepare("DELETE FROM admin_sessions WHERE admin_id = ? AND expires_at <= ?").bind(admin.id, now),
    db.prepare("UPDATE admins SET last_login_at = ? WHERE id = ?").bind(now, admin.id),
  ]);
  await createSession(admin.id, { ip, userAgent: getUserAgent(requestHeaders) });

  redirect(nextPath);
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/** 오픈 리다이렉트 방지: 관리자 영역 내부 경로만 허용 */
function safeNextPath(value: FormDataEntryValue | null): string {
  const path = typeof value === "string" ? value : "";
  if (path.startsWith("/admin") && !path.startsWith("//") && !path.startsWith("/admin/login")) {
    return path;
  }
  return "/admin";
}
