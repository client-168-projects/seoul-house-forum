import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { NoticeEditorForm } from "@/components/admin/NoticeEditorForm";
import { verifyAdmin } from "@/lib/server/auth/dal";
import { parseId } from "@/lib/server/http";
import { getNotice } from "@/lib/server/repositories/notices";
import { formatDateTime } from "@/utils/date";

export const metadata: Metadata = { title: "공지 수정" };

export default async function EditNoticePage({ params }: PageProps<"/admin/notices/[id]/edit">) {
  await verifyAdmin();
  const id = parseId((await params).id);
  const notice = id ? await getNotice(id) : null;
  if (!notice) notFound();

  return (
    <div className="mx-auto max-w-[1080px]">
      <AdminPageHeader
        eyebrow={`NOTICE #${notice.id}`}
        title="공지 수정"
        description={`등록 ${formatDateTime(notice.createdAt)} · 최근 수정 ${formatDateTime(notice.updatedAt)}`}
      />
      <NoticeEditorForm
        notice={{
          id: notice.id,
          title: notice.title,
          content: notice.content,
          attachments: notice.attachments.map((file) => ({
            key: file.url.replace("/api/files/", ""),
            url: file.url,
            fileName: file.fileName,
            contentType: file.contentType,
            size: file.size,
          })),
        }}
      />
    </div>
  );
}
