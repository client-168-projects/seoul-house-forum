import { adminFetch } from "@/lib/client/adminApi";
import type { UploadedFile } from "@/types/notice";

export function uploadFile(file: File, kind: "attachments" | "editor"): Promise<UploadedFile> {
  const body = new FormData();
  body.append("file", file);
  body.append("kind", kind);
  return adminFetch<UploadedFile>("/api/admin/uploads", { method: "POST", body });
}
