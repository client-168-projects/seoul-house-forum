import "server-only";
import { base64ToBytes, bytesToBase64, timingSafeEqual } from "@/lib/server/crypto";

/**
 * Workers의 WebCrypto PBKDF2는 반복 횟수 상한이 100,000이다.
 * scripts/create-admin.mjs 와 같은 파라미터를 써야 한다.
 */
export const PASSWORD_ITERATIONS = 100_000;

async function derive(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    keyMaterial,
    256,
  );
  return bytesToBase64(new Uint8Array(bits));
}

export async function verifyPassword(
  password: string,
  stored: { hash: string; salt: string; iterations: number },
): Promise<boolean> {
  const candidate = await derive(password, base64ToBytes(stored.salt), stored.iterations);
  return timingSafeEqual(candidate, stored.hash);
}

/**
 * 존재하지 않는 계정으로 로그인할 때도 같은 시간만큼 연산해
 * 응답 시간으로 계정 존재 여부를 추측하지 못하게 한다.
 */
export async function burnPasswordCheck(password: string): Promise<void> {
  await derive(password, new Uint8Array(16), PASSWORD_ITERATIONS);
}
