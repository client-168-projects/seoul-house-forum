import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/site";

/**
 * 네이버 서치어드바이저는 robots.txt의 sitemap 선언을 함께 읽으므로 절대 주소로 둔다.
 * 관리자/API는 색인 대상이 아니다(admin/layout.tsx의 noindex, proxy.ts의 X-Robots-Tag와 삼중 차단).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
