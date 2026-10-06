import { NextResponse, type NextRequest } from "next/server";
import { guardAdminApi } from "@/lib/server/auth/dal";
import { jsonError } from "@/lib/server/http";
import { StorageError } from "@/lib/server/storage/driver";
import { storeUpload, UPLOAD_LIMITS, UploadError, type UploadKind } from "@/lib/server/storage";

/** multipart/form-data: file, kind("attachments" | "editor" | "popup") */
export async function POST(request: NextRequest) {
  const guard = await guardAdminApi(request);
  if (guard.error) return guard.error;

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > UPLOAD_LIMITS.attachments + 64 * 1024) {
    return jsonError("파일 크기가 너무 큽니다.", 413);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("업로드 형식이 올바르지 않습니다.", 400);
  }

  const file = formData.get("file");
  const kind = formData.get("kind");
  if (!(file instanceof File)) return jsonError("업로드할 파일을 선택해 주세요.", 400);
  if (kind !== "attachments" && kind !== "editor" && kind !== "popup") return jsonError("업로드 종류가 올바르지 않습니다.", 400);

  try {
    return NextResponse.json(await storeUpload(file, kind as UploadKind), { status: 201 });
  } catch (error) {
    if (error instanceof UploadError) return jsonError(error.message, 422);
    // 저장소 설정 누락/장애는 운영자가 바로 알 수 있게 그대로 알린다.
    if (error instanceof StorageError) {
      console.error("[uploads]", error);
      return jsonError(error.message, 503);
    }
    throw error;
  }
}
