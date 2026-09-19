/**
 * 관리자 계정 생성/비밀번호 재설정.
 * 비밀번호는 저장소에 남지 않도록 환경 변수로만 받고, PBKDF2 해시만 D1에 기록한다.
 *
 *   ADMIN_USERNAME=... ADMIN_PASSWORD=... node scripts/create-admin.mjs --local
 *   ADMIN_USERNAME=... ADMIN_PASSWORD=... node scripts/create-admin.mjs --remote
 *
 * 해시 형식은 src/lib/server/auth/password.ts 와 반드시 동일해야 한다.
 */
import { execFileSync } from "node:child_process";
import { randomUUID, webcrypto } from "node:crypto";
import { rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ITERATIONS = 100_000;
const target = process.argv.includes("--remote") ? "--remote" : "--local";
const username = process.env.ADMIN_USERNAME?.trim();
const password = process.env.ADMIN_PASSWORD;

if (!username || !password) {
  console.error("ADMIN_USERNAME, ADMIN_PASSWORD 환경 변수를 지정해 주세요.");
  process.exit(1);
}
if (!/^[a-zA-Z0-9_.-]{4,40}$/.test(username)) {
  console.error("아이디는 영문/숫자/_.- 조합 4~40자여야 합니다.");
  process.exit(1);
}
if (password.length < 12) {
  console.error("비밀번호는 12자 이상이어야 합니다.");
  process.exit(1);
}

const toBase64 = (bytes) => Buffer.from(bytes).toString("base64");

const salt = webcrypto.getRandomValues(new Uint8Array(16));
const keyMaterial = await webcrypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(password),
  "PBKDF2",
  false,
  ["deriveBits"],
);
const bits = await webcrypto.subtle.deriveBits(
  { name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS },
  keyMaterial,
  256,
);

const escapeSql = (value) => value.replaceAll("'", "''");
const sql = `INSERT INTO admins (username, password_hash, password_salt, password_iterations)
VALUES ('${escapeSql(username)}', '${toBase64(new Uint8Array(bits))}', '${toBase64(salt)}', ${ITERATIONS})
ON CONFLICT(username) DO UPDATE SET
  password_hash = excluded.password_hash,
  password_salt = excluded.password_salt,
  password_iterations = excluded.password_iterations;
DELETE FROM admin_sessions WHERE admin_id = (SELECT id FROM admins WHERE username = '${escapeSql(username)}');`;

// Windows 셸 인자 분리 문제를 피하고 해시가 명령줄 기록에 남지 않도록 임시 SQL 파일로 실행한 뒤 바로 지운다.
const sqlFile = join(tmpdir(), `shf-admin-${randomUUID()}.sql`);
writeFileSync(sqlFile, sql, "utf8");
try {
  execFileSync("pnpm", ["exec", "wrangler", "d1", "execute", "DB", target, "--yes", `--file=${sqlFile}`], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
} finally {
  rmSync(sqlFile, { force: true });
}
console.log(`관리자 계정 '${username}' 저장 완료 (${target.slice(2)})`);
