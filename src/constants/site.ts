/**
 * sitemap/robots/JSON-LD/canonical에 쓰이는 절대 주소.
 * 커스텀 도메인이 정식 주소이며, workers.dev 주소로도 접근되므로 canonical을 반드시 이 값으로 고정한다.
 * 도메인이 또 바뀌면 빌드 환경의 NEXT_PUBLIC_SITE_URL로 덮어쓴다(빌드 시점에 값이 박힌다).
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://2026seoulhousingforum.com";

export const SITE_DESCRIPTION =
  "전월세시장 현황을 진단하고 안정화 방안을 모색하는 서울특별시 시민 참여형 주거정책 포럼. 2026년 10월 7일(수) 한국프레스센터 20층 국제회의장.";

/** 검색 결과 노출을 노리는 핵심 검색어. 페이지별 metadata에서 필요하면 덧붙인다. */
export const SITE_KEYWORDS = [
  "2026 서울주거포럼",
  "서울주거포럼",
  "서울 주거정책",
  "전월세 시장",
  "전월세 시장 안정화",
  "전세 월세 전환",
  "장기전세주택",
  "기업형 민간임대",
  "주거정책 포럼",
  "서울특별시",
  "한국프레스센터",
];

/** 공유 카드용 대표 이미지. 카카오톡·페이스북·X 모두 지원하는 1200x630 PNG로 둔다. */
export const OG_IMAGE = {
  url: "/images/og/og-default.png",
  width: 1200,
  height: 630,
  alt: "2026 서울주거포럼 - 전월세시장 현황 진단 및 안정화 방안 모색",
} as const;

/**
 * 검색엔진 사이트 소유 확인 코드. HTML에 그대로 노출되는 공개 값이라 저장소에 두어도 무방하다.
 * - 구글: Search Console > 속성 추가 > HTML 태그의 content 값
 * - 네이버: 서치어드바이저 > 사이트 등록 > 사이트 소유확인 > HTML 태그의 content 값
 * 값이 비어 있으면 메타태그를 아예 출력하지 않는다.
 */
export const SITE_VERIFICATION = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "ieKZL_Qn6ouqIYVGR6d8S6lTk-NwvAMIYqsCwl2ixNk",
  naver: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ?? "b62343e36d4058677e21f8956f337cc3e3dbf4df",
} as const;

export const PUBLIC_ROUTES = [
  "/",
  "/forum/intro",
  "/forum/overview",
  "/forum/location",
  "/program",
  "/program/speakers",
  "/register",
  "/community/notice",
  "/community/board",
] as const;

/**
 * GA4 웹 스트림 측정 ID. 페이지 소스에 그대로 노출되는 공개 값이다.
 * 공개 페이지((site) 레이아웃)에만 태그를 넣어 관리자 접속은 집계되지 않게 한다.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-8V2RJZJLPW";
