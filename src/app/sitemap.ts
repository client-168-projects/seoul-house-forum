import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, SITE_URL } from "@/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
