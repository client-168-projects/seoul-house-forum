import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSearchForm } from "@/components/admin/AdminSearchForm";
import { DeleteNoticeButton } from "@/components/admin/DeleteNoticeButton";
import { Pagination } from "@/components/community/Pagination";
import { verifyAdmin } from "@/lib/server/auth/dal";
import { parsePage } from "@/lib/server/pagination";
import { listNotices } from "@/lib/server/repositories/notices";
import { cleanupOrphanUploads } from "@/lib/server/storage";
import { formatDateTime } from "@/utils/date";
import { withPageParam } from "@/utils/pagination";

export const metadata: Metadata = { title: "공지사항 관리" };

const PAGE_SIZE = 15;

export default async function AdminNoticesPage({ searchParams }: PageProps<"/admin/notices">) {
  await verifyAdmin();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 50) : "";
  const result = await listNotices({ page: parsePage(params.page), pageSize: PAGE_SIZE, query });

  // 저장하지 않고 나간 업로드 정리. 실패해도 목록 조회에는 영향을 주지 않는다.
  try {
    await cleanupOrphanUploads();
  } catch (error) {
    console.error("[cleanup]", error);
  }

  return (
    <div className="mx-auto max-w-[1280px]">
      <AdminPageHeader
        eyebrow="NOTICE"
        title="공지사항 관리"
        description="작성한 공지는 저장 즉시 공개 공지사항 게시판에 노출됩니다."
        actions={
          <Link
            href="/admin/notices/new"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary-600 px-5 text-body font-bold text-white hover:bg-primary-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            새 공지 작성
          </Link>
        }
      />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-caption font-bold text-ink-soft">
          총 <span className="text-primary-600">{result.total.toLocaleString()}</span>건
        </p>
        <AdminSearchForm action="/admin/notices" placeholder="제목 검색" defaultValue={query} />
      </div>

      <section className="mt-4 overflow-hidden rounded-[20px] bg-white ring-1 ring-primary-100">
        {result.items.length === 0 ? (
          <p className="px-5 py-20 text-center text-body text-ink-muted">
            {query ? `'${query}'에 대한 검색 결과가 없습니다.` : "아직 작성한 공지가 없습니다."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-caption">
              <thead className="bg-admin-canvas/60 text-[12px] font-bold text-ink-muted">
                <tr>
                  <th scope="col" className="w-20 py-3 pl-5">번호</th>
                  <th scope="col" className="py-3">제목</th>
                  <th scope="col" className="w-20 py-3 text-center">첨부</th>
                  <th scope="col" className="w-40 py-3">등록일</th>
                  <th scope="col" className="w-40 py-3">최근 수정</th>
                  <th scope="col" className="w-[168px] py-3 pr-5 text-right">관리</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((notice) => (
                  <tr key={notice.id} className="border-t border-primary-50 hover:bg-primary-50/50">
                    <td className="py-4 pl-5 text-ink-muted tabular-nums">{notice.id}</td>
                    <td className="py-4 pr-6">
                      <Link
                        href={`/admin/notices/${notice.id}/edit`}
                        className="text-body font-bold text-ink hover:text-primary-600 hover:underline hover:underline-offset-4"
                      >
                        {notice.title}
                      </Link>
                    </td>
                    <td className="py-4 text-center text-ink-soft tabular-nums">
                      {notice.attachmentCount > 0 ? notice.attachmentCount : "-"}
                    </td>
                    <td className="py-4 text-ink-soft tabular-nums">{formatDateTime(notice.createdAt)}</td>
                    <td className="py-4 text-ink-soft tabular-nums">{formatDateTime(notice.updatedAt)}</td>
                    <td className="py-4 pr-5">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/community/notice/${notice.id}`}
                          target="_blank"
                          className="flex h-9 items-center rounded-[10px] px-3 text-caption font-bold text-ink-soft hover:bg-primary-50"
                        >
                          보기
                        </Link>
                        <Link
                          href={`/admin/notices/${notice.id}/edit`}
                          className="flex h-9 items-center rounded-[10px] bg-primary-50 px-3 text-caption font-bold text-primary-700 hover:bg-primary-100"
                        >
                          수정
                        </Link>
                        <DeleteNoticeButton id={notice.id} title={notice.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mt-8">
        <Pagination
          currentPage={result.page}
          totalPages={result.totalPages}
          hrefForPage={(page) => withPageParam("/admin/notices", { q: query }, page)}
        />
      </div>
    </div>
  );
}
