import "server-only";
import { NextResponse } from "next/server";

export function jsonError(message: string, status: number, init?: { headers?: HeadersInit; extra?: object }) {
  return NextResponse.json({ message, ...init?.extra }, { status, headers: init?.headers });
}

/** 본문 크기를 제한해 JSON을 읽는다. 형식이 잘못되면 null. */
export async function readJson<T = Record<string, unknown>>(request: Request, maxBytes = 256 * 1024): Promise<T | null> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > maxBytes) return null;
  try {
    const text = await request.text();
    if (text.length > maxBytes) return null;
    const parsed: unknown = JSON.parse(text);
    return parsed && typeof parsed === "object" ? (parsed as T) : null;
  } catch {
    return null;
  }
}

export function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function parseIdList(value: unknown, max = 100): number[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > max) return null;
  const ids = value.map(Number);
  return ids.every((id) => Number.isInteger(id) && id > 0) ? [...new Set(ids)] : null;
}
