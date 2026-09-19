import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { NoticeEditorForm } from "@/components/admin/NoticeEditorForm";
import { verifyAdmin } from "@/lib/server/auth/dal";

export const metadata: Metadata = { title: "새 공지 작성" };

export default async function NewNoticePage() {
  await verifyAdmin();

  return (
    <div className="mx-auto max-w-[1080px]">
      <AdminPageHeader eyebrow="NOTICE" title="새 공지 작성" />
      <NoticeEditorForm />
    </div>
  );
}
