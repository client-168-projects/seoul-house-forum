import type { Metadata } from "next";
import { SITE_NAME } from "@/constants/nav";
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_URL,
  SITE_VERIFICATION,
} from "@/constants/site";
import { gmarketSans, suit } from "@/styles/fonts";
import "./globals.css";

/**
 * metadataBase가 있어야 각 페이지의 상대 canonical(`/program` 등)과 OG 이미지 경로가
 * 절대 URL로 출력된다. 관리자 영역의 noindex는 admin/layout.tsx와 proxy.ts에서 따로 처리한다.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | 전월세시장 현황 진단 및 안정화 방안 모색`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ko_KR",
    url: "/",
    title: `${SITE_NAME} | 전월세시장 현황 진단 및 안정화 방안 모색`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | 전월세시장 현황 진단 및 안정화 방안 모색`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  verification: {
    google: SITE_VERIFICATION.google || undefined,
    other: SITE_VERIFICATION.naver
      ? { "naver-site-verification": SITE_VERIFICATION.naver }
      : undefined,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${gmarketSans.variable} ${suit.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col">{children}</body>
    </html>
  );
}
