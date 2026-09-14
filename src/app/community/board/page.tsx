import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { BoardToolbar } from "@/components/community/BoardToolbar";
import { NoticeTable } from "@/components/community/NoticeTable";
import { BOARD_POSTS } from "@/data/notices";

export const metadata: Metadata = {
  title: "자유게시판",
  description: "2026 서울주거포럼 자유게시판",
};

export default function BoardPage() {
  return (
    <>
      <Breadcrumb items={["소통의 장", "자유게시판"]} />
      <Container className="pt-12 pb-24 lg:pt-[80px] lg:pb-[240px]">
        <BoardToolbar total={BOARD_POSTS.length} page={1} />
        <div className="mt-8 lg:mt-[40px]">
          <NoticeTable notices={BOARD_POSTS} />
        </div>
      </Container>
    </>
  );
}
