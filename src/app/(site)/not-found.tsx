import type { Metadata } from "next";
import { StatusLink } from "@/components/common/StatusLink";
import { StatusScreen } from "@/components/common/StatusScreen";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  robots: { index: false, follow: true },
};

/** 공개 페이지에서 notFound()를 호출했을 때(없는 공지 번호 등). 헤더/푸터는 (site) 레이아웃이 감싼다. */
export default function SiteNotFound() {
  return (
    <StatusScreen
      code="404"
      title="요청하신 글을 찾을 수 없습니다"
      description={
        <>
          삭제되었거나 주소가 잘못된 글입니다.
          <br />
          목록에서 다시 확인해 주세요.
        </>
      }
      actions={
        <>
          <StatusLink href="/community/notice" variant="accent">
            공지사항 목록
          </StatusLink>
          <StatusLink href="/" variant="outline">
            홈으로
          </StatusLink>
        </>
      }
    />
  );
}
