"use server";

import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/constants/auth";
import { verifyAdmin } from "@/lib/server/auth/dal";
import { hashPassword, verifyPassword } from "@/lib/server/auth/password";
import { getDb } from "@/lib/server/cloudflare";
import { sha256Hex } from "@/lib/server/crypto";

export interface PasswordFormState {
  status?: "success" | "error";
  message?: string;
}

const MIN_LENGTH = 12;

interface AdminPasswordRow {
  password_hash: string;
  password_salt: string;
  password_iterations: number;
}

/** 비밀번호 변경 후에는 지금 쓰는 세션만 남기고 다른 기기의 세션을 모두 끊는다. */
export async function changePassword(
  _previous: PasswordFormState,
  formData: FormData,
): Promise<PasswordFormState> {
  const session = await verifyAdmin();
  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!current || !next || !confirm) return { status: "error", message: "모든 항목을 입력해 주세요." };
  if (next !== confirm) return { status: "error", message: "새 비밀번호와 확인 값이 다릅니다." };
  if (next.length < MIN_LENGTH || next.length > 200) {
    return { status: "error", message: `새 비밀번호는 ${MIN_LENGTH}자 이상이어야 합니다.` };
  }
  if (!/[a-zA-Z]/.test(next) || !/[0-9]/.test(next) || !/[^a-zA-Z0-9]/.test(next)) {
    return { status: "error", message: "새 비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다." };
  }
  if (next === current) return { status: "error", message: "지금 쓰는 비밀번호와 다른 값을 입력해 주세요." };

  const db = getDb();
  const row = await db
    .prepare("SELECT password_hash, password_salt, password_iterations FROM admins WHERE id = ?")
    .bind(session.adminId)
    .first<AdminPasswordRow>();
  if (!row) return { status: "error", message: "계정을 찾을 수 없습니다. 다시 로그인해 주세요." };

  const valid = await verifyPassword(current, {
    hash: row.password_hash,
    salt: row.password_salt,
    iterations: row.password_iterations,
  });
  if (!valid) return { status: "error", message: "현재 비밀번호가 올바르지 않습니다." };

  const hashed = await hashPassword(next);
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const keepSessionId = token ? await sha256Hex(token) : "";

  await db.batch([
    db
      .prepare("UPDATE admins SET password_hash = ?, password_salt = ?, password_iterations = ? WHERE id = ?")
      .bind(hashed.hash, hashed.salt, hashed.iterations, session.adminId),
    db.prepare("DELETE FROM admin_sessions WHERE admin_id = ? AND id != ?").bind(session.adminId, keepSessionId),
  ]);

  return { status: "success", message: "비밀번호를 변경했습니다. 다른 기기의 로그인은 모두 해제되었습니다." };
}
