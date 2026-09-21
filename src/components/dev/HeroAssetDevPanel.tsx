"use client";

import Image from "next/image";

/*
 * 고정 기준값 (변경 금지)
 *
 * 1920px:
 *   Left:   w-[793px]  left-[-34px]  bottom-[-177px]
 *   Right:  w-[656px]  right-[-15px] top-[110px]
 *   Center: h-[518px]  right-[410px] top-[245px]
 *
 * 2560px:
 *   Left:   w-[1024px] left-[-8px]   bottom-[-246px]
 *   Right:  w-[1024px] right-[-1px]  top-[124px]
 *   Center: h-[640px]  right-[600px] top-[400px]
 */

// 1920px 기준값
const V1920 = {
  left: { width: 793, x: -34, y: -177 },
  right: { width: 656, x: -15, y: 110 },
  center: { height: 518, right: 410, top: 245 },
};

// 2560px 기준값
const V2560 = {
  left: { width: 1024, x: -8, y: -246 },
  right: { width: 1024, x: -1, y: 124 },
  center: { height: 640, right: 600, top: 400 },
};

// 선형 보간 CSS 생성: 1920px에서 v1, 2560px에서 v2
// calc(v1 + (v2 - v1) * (100vw - 1920px) / 640)
function lerp(v1: number, v2: number): string {
  if (v1 === v2) return `${v1}px`;

  const diff = v2 - v1;
  const slope = diff / 640; // 2560 - 1920 = 640

  // 1920px 미만: v1 고정, 1920-2560: 보간, 2560 초과: v2 고정
  const min = Math.min(v1, v2);
  const max = Math.max(v1, v2);

  return `clamp(${min}px, calc(${v1}px + (100vw - 1920px) * ${slope.toFixed(6)}), ${max}px)`;
}

export function HeroAssetDevPanel() {
  return (
    <>
      {/* Left Asset - 반응형 보간 */}
      <Image
        src="/images/hero/main-hero-left.svg"
        alt=""
        width={911}
        height={406}
        aria-hidden="true"
        className="pointer-events-none absolute hidden h-auto opacity-15 grayscale brightness-200 lg:block"
        style={{
          width: lerp(V1920.left.width, V2560.left.width),
          left: lerp(V1920.left.x, V2560.left.x),
          bottom: lerp(V1920.left.y, V2560.left.y),
        }}
      />

      {/* Right Asset - 반응형 보간 */}
      <Image
        src="/images/hero/main-hero-right.svg"
        alt=""
        width={705}
        height={310}
        aria-hidden="true"
        className="pointer-events-none absolute hidden h-auto opacity-15 grayscale brightness-200 lg:block"
        style={{
          width: lerp(V1920.right.width, V2560.right.width),
          right: lerp(V1920.right.x, V2560.right.x),
          top: lerp(V1920.right.y, V2560.right.y),
        }}
      />

      {/* Center Illustration - 반응형 보간 */}
      <Image
        src="/images/hero/main-hero-asset.svg"
        alt=""
        width={945}
        height={615}
        priority
        className="pointer-events-none absolute hidden w-auto opacity-80 lg:block"
        style={{
          height: lerp(V1920.center.height, V2560.center.height),
          right: lerp(V1920.center.right, V2560.center.right),
          top: lerp(V1920.center.top, V2560.center.top),
        }}
      />
    </>
  );
}
