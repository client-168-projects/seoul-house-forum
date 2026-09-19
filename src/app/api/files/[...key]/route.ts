import type { NextRequest } from "next/server";
import { getBucket } from "@/lib/server/cloudflare";
import { jsonError } from "@/lib/server/http";
import { isValidFileKey } from "@/lib/server/storage";

/**
 * R2 파일 서빙. 업로드 시 생성한 키 형식만 허용하고,
 * 첨부파일은 항상 다운로드(attachment)로 내려 브라우저가 HTML 등으로 해석하지 못하게 한다.
 */
export async function GET(_request: NextRequest, context: RouteContext<"/api/files/[...key]">) {
  const key = (await context.params).key.join("/");
  if (!isValidFileKey(key)) return jsonError("파일을 찾을 수 없습니다.", 404);

  const object = await getBucket().get(key);
  if (!object) return jsonError("파일을 찾을 수 없습니다.", 404);

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("ETag", object.httpEtag);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Content-Security-Policy", "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox");
  // 키가 UUID라 내용이 바뀌지 않으므로 길게 캐시한다.
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  if (key.startsWith("attachments/")) {
    const fileName = decodeURIComponent(object.customMetadata?.fileName ?? "file");
    headers.set("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`);
  } else {
    headers.set("Content-Disposition", "inline");
  }

  return new Response(object.body, { headers });
}
