import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { BoardToolbar } from "@/components/community/BoardToolbar";
import { NoticeTable } from "@/components/community/NoticeTable";
import { Pagination } from "@/components/community/Pagination";
import { parsePage } from "@/lib/server/pagination";
import { listNotices } from "@/lib/server/repositories/notices";
import { withPageParam } from "@/utils/pagination";

export const metadata: Metadata = {
  title: "공지사항",
  description: "2026 서울주거포럼 공지사항",
  alternates: { canonical: "/community/notice" },
  openGraph: { title: "공지사항 | 2026 서울주거포럼", description: "2026 서울주거포럼 공지사항" },
};

/** D1을 요청마다 조회하므로 정적 생성하지 않는다. */
export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

export default async function NoticePage({ searchParams }: PageProps<"/community/notice">) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 50) : "";
  const field = params.field === "content" ? "content" : "title";
  const result = await listNotices({ page: parsePage(params.page), pageSize: PAGE_SIZE, query, field });

  return (
    <>
      <Breadcrumb items={["소통의 장", "공지사항"]} />
      <Container className="pt-12 pb-24 lg:pt-[80px] lg:pb-[240px]">
        <BoardToolbar total={result.total} page={result.page} action="/community/notice" query={query} field={field} />
        <div className="mt-8 lg:mt-[40px]">
          <NoticeTable
            notices={result.items}
            emptyMessage={query ? `'${query}'에 대한 검색 결과가 없습니다.` : "등록된 공지사항이 없습니다."}
          />
        </div>
        <div className="mt-8 lg:mt-[40px]">
          <Pagination
            currentPage={result.page}
            totalPages={result.totalPages}
            hrefForPage={(page) => withPageParam("/community/notice", { q: query, field: query ? field : undefined }, page)}
          />
        </div>
      </Container>
    </>
  );
}
