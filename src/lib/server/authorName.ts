import "server-only";
import { getEnv } from "@/lib/server/cloudflare";
import { base64ToBytes, bytesToBase64 } from "@/lib/server/crypto";

/**
 * 자유게시판 작성자 이름 보호.
 * - 공개 화면(목록, 확대 모달, 공개 API)에는 maskAuthorName 결과만 쓴다.
 * - 원문은 AES-256-GCM으로 암호화해 저장하고, 관리자 화면에서만 복호화한다.
 */
const VERSION = "v1";
const MASK_CHAR = "ㅇ";

/** 김철수 -> 김ㅇㅇ, 이수 -> 이ㅇ, 박 -> 박 */
export function maskAuthorName(name: string): string {
  const characters = Array.from(name);
  if (characters.length <= 1) return name;
  return characters[0] + MASK_CHAR.repeat(characters.length - 1);
}

let cachedKey: { raw: string; key: CryptoKey } | null = null;

async function getKey(): Promise<CryptoKey> {
  const raw = getEnv().BOARD_AUTHOR_KEY;
  if (!raw) throw new Error("BOARD_AUTHOR_KEY가 설정되지 않아 작성자 이름을 저장할 수 없습니다.");
  if (cachedKey?.raw === raw) return cachedKey.key;

  const bytes = base64ToBytes(raw);
  if (bytes.length !== 32) throw new Error("BOARD_AUTHOR_KEY는 base64로 인코딩한 32바이트여야 합니다.");
  const key = await crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["encrypt", "decrypt"]);
  cachedKey = { raw, key };
  return key;
}

/** 형식: v1:<iv base64>:<암호문 base64> */
export async function encryptAuthorName(name: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await getKey(), new TextEncoder().encode(name));
  return `${VERSION}:${bytesToBase64(iv)}:${bytesToBase64(new Uint8Array(cipher))}`;
}

/** 복호화에 실패하면(키 교체, 손상) null을 돌려 관리자 화면이 마스킹 값으로 대신 표시하게 한다. */
export async function decryptAuthorName(value: string | null): Promise<string | null> {
  if (!value) return null;
  const [version, iv, cipher] = value.split(":");
  if (version !== VERSION || !iv || !cipher) return null;
  try {
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64ToBytes(iv) }, await getKey(), base64ToBytes(cipher));
    return new TextDecoder().decode(plain);
  } catch {
    return null;
  }
}
