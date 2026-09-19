import { AdminShell } from "@/components/admin/AdminShell";
import { verifyAdmin } from "@/lib/server/auth/dal";
import { getDb } from "@/lib/server/cloudflare";

/** 로그인 이후 모든 관리자 화면. 레이아웃에서 세션을 확인하지만, 각 페이지와 API도 개별로 다시 확인한다. */
export default async function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  const session = await verifyAdmin();
  const pending = await getDb()
    .prepare("SELECT COUNT(*) AS total FROM board_posts WHERE status = 'pending'")
    .first<{ total: number }>();

  return (
    <AdminShell username={session.username} lastLoginAt={session.lastLoginAt} pendingCount={pending?.total ?? 0}>
      {children}
    </AdminShell>
  );
}
