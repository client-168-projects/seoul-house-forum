import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSearchForm } from "@/components/admin/AdminSearchForm";
import { BoardReviewTable } from "@/components/admin/BoardReviewTable";
import { Pagination } from "@/components/community/Pagination";
import { BOARD_ADMIN_PAGE_SIZE, BOARD_PERSONAL_DATA_RETENTION_DAYS } from "@/constants/board";
import { verifyAdmin } from "@/lib/server/auth/dal";
import { parsePage } from "@/lib/server/pagination";
import { listPostsForAdmin, purgeExpiredPersonalData } from "@/lib/server/repositories/boardPosts";
import type { BoardPostStatus } from "@/types/board";
import { BOARD_STATUS_LABELS, parseBoardStatus } from "@/utils/boardStatus";
import { cn } from "@/utils/cn";
import { withPageParam } from "@/utils/pagination";

export const metadata: Metadata = { title: "자유게시판 검수" };

const TABS: { status?: BoardPostStatus; label: string }[] = [
  { status: "pending", label: BOARD_STATUS_LABELS.pending },
  { status: "approved", label: BOARD_STATUS_LABELS.approved },
  { status: "rejected", label: BOARD_STATUS_LABELS.rejected },
  { label: "전체" },
];

export default async function AdminBoardPage({ searchParams }: PageProps<"/admin/board">) {
  await verifyAdmin();
  const params = await searchParams;
  const status = params.status === "all" ? undefined : (parseBoardStatus(params.status) ?? "pending");
  const statusParam = status ?? "all";
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 50) : "";

  await purgeExpiredPersonalData();
  const result = await listPostsForAdmin({ status, query }, parsePage(params.page), BOARD_ADMIN_PAGE_SIZE);
  const allCount = result.counts.pending + result.counts.approved + result.counts.rejected;

  return (
    <div className="mx-auto max-w-[1280px]">
      <AdminPageHeader
        eyebrow="COMMUNITY"
        title="자유게시판 검수"
        description={`승인한 의견만 공개 게시판에 노출됩니다. IP·브라우저 정보는 작성 ${BOARD_PERSONAL_DATA_RETENTION_DAYS}일 후 자동 파기됩니다.`}
      />

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="검수 상태" className="flex w-full gap-1 overflow-x-auto rounded-full bg-white p-1 ring-1 ring-primary-100 sm:w-auto">
          {TABS.map((tab) => {
            const value = tab.status ?? "all";
            const active = value === statusParam;
            const count = tab.status ? result.counts[tab.status] : allCount;
            return (
              <Link
                key={value}
                href={withPageParam("/admin/board", { status: value, q: query }, 1)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-caption font-bold transition-colors",
                  active ? "bg-primary-950 text-white" : "text-ink-soft hover:bg-primary-50",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[11px] tabular-nums",
                    active ? "bg-accent text-accent-ink" : "bg-primary-50 text-primary-600",
                  )}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </nav>
        <AdminSearchForm
          action="/admin/board"
          placeholder="내용, 작성자, IP 검색"
          defaultValue={query}
          hiddenFields={{ status: statusParam }}
        />
      </div>

      <BoardReviewTable key={`${statusParam}-${query}-${result.page}`} posts={result.items} total={result.total} />

      <div className="mt-8">
        <Pagination
          currentPage={result.page}
          totalPages={result.totalPages}
          hrefForPage={(page) => withPageParam("/admin/board", { status: statusParam, q: query }, page)}
        />
      </div>
    </div>
  );
}
