import type { Metadata } from "next";

/** 관리자 영역은 색인 대상이 아니다. robots.ts의 disallow와 proxy의 X-Robots-Tag로도 이중 차단한다. */
export const metadata: Metadata = {
  title: { default: "관리자", template: "%s | 서울주거포럼 관리자" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-dvh bg-admin-canvas text-ink">{children}</div>;
}
