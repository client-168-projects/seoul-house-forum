/** 배포 도메인이 정해지면 NEXT_PUBLIC_SITE_URL 환경 변수로 덮어쓴다. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
