/**
 * sitemap/robots/JSON-LD에 쓰이는 절대 주소.
 * 커스텀 도메인이 붙으면 빌드 환경의 NEXT_PUBLIC_SITE_URL로 덮어쓴다(빌드 시점에 값이 박힌다).
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://seoul-house-forum.168-592.workers.dev";

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
