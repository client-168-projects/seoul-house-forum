import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    /**
     * Cloudflare Workers(OpenNext)에는 Vercel의 이미지 최적화 서버가 없다.
     * 이미지는 배포 전에 적정 해상도/포맷(WebP)으로 미리 변환해 public/에 넣고,
     * 런타임 최적화는 끈 상태로 원본을 그대로 서빙한다.
     */
    unoptimized: true,
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
