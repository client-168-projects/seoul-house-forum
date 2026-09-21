import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, SITE_URL } from "@/constants/site";
import { listSitemapNotices } from "@/lib/server/repositories/notices";

/** 공지 목록을 D1에서 읽으므로 요청 시점에 생성한다. */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "/community/board" ? ("daily" as const) : ("weekly" as const),
    priority: route === "/" ? 1 : 0.7,
  }));

  // 공지 조회가 실패해도 사이트맵 자체는 내려가야 한다.
  let notices: { id: number; updatedAt: string }[] = [];
  try {
    notices = await listSitemapNotices();
  } catch (error) {
    console.error("[sitemap]", error);
  }

  return [
    ...staticRoutes,
    ...notices.map((notice) => ({
      url: `${SITE_URL}/community/notice/${notice.id}`,
      lastModified: new Date(notice.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
