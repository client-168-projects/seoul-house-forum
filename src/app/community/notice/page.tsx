import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { BoardToolbar } from "@/components/community/BoardToolbar";
import { NoticeTable } from "@/components/community/NoticeTable";
import { Pagination } from "@/components/community/Pagination";
import { NOTICES } from "@/data/notices";

export const metadata: Metadata = {
  title: "공지사항",
  description: "2026 서울주거포럼 공지사항",
};

export default function NoticePage() {
  return (
    <>
      <Breadcrumb items={["소통의 장", "공지사항"]} />
      <Container className="pt-12 pb-24 lg:pt-[80px] lg:pb-[240px]">
        <BoardToolbar total={NOTICES.length} page={1} />
        <div className="mt-8 lg:mt-[40px]">
          <NoticeTable notices={NOTICES} />
        </div>
        <div className="mt-8 lg:mt-[40px]">
          <Pagination currentPage={1} totalPages={5} />
        </div>
      </Container>
    </>
  );
}
