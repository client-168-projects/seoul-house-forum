import type { Metadata } from "next";
import { SITE_NAME } from "@/constants/nav";
import { OG_IMAGE } from "@/constants/site";

interface PageMetadataInput {
  title: string;
  description: string;
  /** 사이트 루트 기준 경로. metadataBase와 합쳐져 canonical 절대 주소가 된다. */
  path: string;
  /** 페이지 고유 검색어. 루트 레이아웃의 공통 검색어는 페이지에서 덮어써지므로 여기에 다시 담는다. */
  keywords?: string[];
}

/**
 * 공개 페이지 공통 메타데이터.
 * Next.js는 openGraph 같은 객체 필드를 얕게 덮어쓰기 때문에, 페이지에서 openGraph를 선언하면
 * 루트의 siteName·locale·images가 사라진다. 그래서 공통 값을 여기서 매번 다시 채운다.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
}: PageMetadataInput): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "ko_KR",
      url: path,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
