import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** 모든 응답에 붙는 기본 보안 헤더. 관리자 영역의 no-store/noindex는 proxy.ts에서 추가한다. */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    /**
     * Cloudflare Workers(OpenNext)에는 Vercel의 이미지 최적화 서버가 없다.
     * 이미지는 배포 전에 적정 해상도/포맷(WebP)으로 미리 변환해 public/에 넣고,
     * 런타임 최적화는 끈 상태로 원본을 그대로 서빙한다.
     */
    unoptimized: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
