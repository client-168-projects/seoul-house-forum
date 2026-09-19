import { CommunityHero } from "@/components/community/CommunityHero";

/** 자유게시판은 히어로와 본문이 배경을 공유해 페이지에서 직접 히어로를 그리므로, 기본 히어로는 공지사항에만 둔다. */
export default function NoticeLayout({ children }: LayoutProps<"/community/notice">) {
  return (
    <>
      <CommunityHero />
      {children}
    </>
  );
}
