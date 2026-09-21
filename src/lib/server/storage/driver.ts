import "server-only";

export interface StorageObject {
  body: ReadableStream<Uint8Array> | ArrayBuffer;
  etag?: string;
}

/**
 * 파일 본체 저장소. 메타데이터(원본 파일명 등)는 D1 uploads 테이블이 담당하므로
 * 드라이버는 넣기/읽기/지우기 세 가지만 제공하면 된다.
 */
export interface StorageDriver {
  readonly name: "r2" | "supabase";
  put(key: string, bytes: Uint8Array, contentType: string): Promise<void>;
  get(key: string): Promise<StorageObject | null>;
  delete(keys: string[]): Promise<void>;
}

export class StorageError extends Error {}
