import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StatusLink } from "@/components/common/StatusLink";
import { StatusScreen } from "@/components/common/StatusScreen";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  robots: { index: false, follow: true },
};

/** 어떤 라우트에도 없는 주소. 루트 레이아웃에는 헤더/푸터가 없으므로 여기서 직접 감싼다. */
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col pt-[68px] lg:pt-0">
        <StatusScreen
          code="404"
          title="페이지를 찾을 수 없습니다"
          description={
            <>
              주소가 바뀌었거나 삭제된 페이지입니다.
              <br />
              아래 버튼으로 이동해 주세요.
            </>
          }
          actions={
            <>
              <StatusLink href="/" variant="accent">
                홈으로
              </StatusLink>
              <StatusLink href="/community/notice" variant="outline">
                공지사항 보기
              </StatusLink>
            </>
          }
        />
      </main>
      <Footer />
    </>
  );
}
