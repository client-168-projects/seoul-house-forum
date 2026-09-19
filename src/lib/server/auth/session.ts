import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TTL_HOURS } from "@/constants/auth";
import { getDb } from "@/lib/server/cloudflare";
import { randomToken, sha256Hex } from "@/lib/server/crypto";

export interface AdminSession {
  adminId: number;
  username: string;
  lastLoginAt: string | null;
  expiresAt: string;
}

export async function createSession(adminId: number, meta: { ip: string; userAgent: string }) {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_HOURS * 60 * 60 * 1000);

  await getDb()
    .prepare(
      "INSERT INTO admin_sessions (id, admin_id, expires_at, ip, user_agent) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(await sha256Hex(token), adminId, expiresAt.toISOString(), meta.ip, meta.userAgent)
    .run();

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
}

/**
 * 한 요청 안에서 레이아웃/페이지/액션이 여러 번 호출해도 DB 조회는 한 번만 일어나도록 cache로 감싼다.
 */
export const getSession = cache(async (): Promise<AdminSession | null> => {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = await getDb()
    .prepare(
      `SELECT s.admin_id AS adminId, s.expires_at AS expiresAt, a.username, a.last_login_at AS lastLoginAt
       FROM admin_sessions s JOIN admins a ON a.id = s.admin_id
       WHERE s.id = ? AND s.expires_at > ?`,
    )
    .bind(await sha256Hex(token), new Date().toISOString())
    .first<AdminSession>();

  return row ?? null;
});

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) {
    await getDb().prepare("DELETE FROM admin_sessions WHERE id = ?").bind(await sha256Hex(token)).run();
  }
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
