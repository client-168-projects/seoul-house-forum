import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { NoticePopupsManager } from "@/components/admin/NoticePopupsManager";
import { verifyAdmin } from "@/lib/server/auth/dal";
import { listNoticePopups } from "@/lib/server/repositories/noticePopups";
import { cleanupOrphanUploads } from "@/lib/server/storage";

export const metadata: Metadata = { title: "팝업 관리" };

export default async function AdminNoticePopupsPage() {
  await verifyAdmin();
  const popups = await listNoticePopups();

  // 저장하지 않고 나간 팝업 이미지 정리. 실패해도 목록 조회에는 영향을 주지 않는다.
  try {
    await cleanupOrphanUploads();
  } catch (error) {
    console.error("[cleanup]", error);
  }

  return (
    <div className="mx-auto max-w-[1280px]">
      <AdminPageHeader
        eyebrow="POPUP"
        title="팝업 관리"
        description="게시 기간 안에 있고 숨김이 아닌 팝업이 사이트 오른쪽 아래에 노출됩니다. 목록 위쪽 팝업이 가장 오른쪽에 표시됩니다."
      />
      <NoticePopupsManager popups={popups} />
    </div>
  );
}
