import Image from "next/image";

const DESIGN_WIDTH_MIN = 1920;
const DESIGN_WIDTH_MAX = 2560;

const AT_1920 = {
  left: { width: 793, x: -34, y: -177 },
  right: { width: 656, x: -15, y: 110 },
  center: { height: 520, right: 410, bottom: 0 },
};

const AT_2560 = {
  left: { width: 1024, x: -8, y: -246 },
  right: { width: 1024, x: -1, y: 124 },
  center: { height: 640, right: 600, bottom: 0 },
};

/** 1920px에서 from, 2560px에서 to가 되도록 선형 보간하고, 범위 밖에서는 양 끝값으로 고정한다. */
function fluidPx(from: number, to: number): string {
  if (from === to) return `${from}px`;

  const slope = (to - from) / (DESIGN_WIDTH_MAX - DESIGN_WIDTH_MIN);
  const min = Math.min(from, to);
  const max = Math.max(from, to);

  return `clamp(${min}px, calc(${from}px + (100vw - ${DESIGN_WIDTH_MIN}px) * ${slope.toFixed(6)}), ${max}px)`;
}

/** 홈 히어로의 PC 전용 배경 장식과 우측 일러스트. 모바일/태블릿 일러스트는 페이지 본문에서 따로 그린다. */
export function HeroIllustrations() {
  return (
    <>
      <Image
        src="/images/hero/main-hero-left.svg"
        alt=""
        width={911}
        height={406}
        aria-hidden="true"
        className="pointer-events-none absolute hidden h-auto opacity-15 grayscale brightness-200 lg:block"
        style={{
          width: fluidPx(AT_1920.left.width, AT_2560.left.width),
          left: fluidPx(AT_1920.left.x, AT_2560.left.x),
          bottom: fluidPx(AT_1920.left.y, AT_2560.left.y),
        }}
      />
      <Image
        src="/images/hero/main-hero-right.svg"
        alt=""
        width={705}
        height={310}
        aria-hidden="true"
        className="pointer-events-none absolute hidden h-auto opacity-15 grayscale brightness-200 lg:block"
        style={{
          width: fluidPx(AT_1920.right.width, AT_2560.right.width),
          right: fluidPx(AT_1920.right.x, AT_2560.right.x),
          top: fluidPx(AT_1920.right.y, AT_2560.right.y),
        }}
      />
      <Image
        src="/images/hero/main-hero-asset.svg"
        alt=""
        width={945}
        height={615}
        priority
        aria-hidden="true"
        className="pointer-events-none absolute hidden w-auto opacity-80 lg:block"
        style={{
          height: fluidPx(AT_1920.center.height, AT_2560.center.height),
          right: fluidPx(AT_1920.center.right, AT_2560.center.right),
          bottom: fluidPx(AT_1920.center.bottom, AT_2560.center.bottom),
        }}
      />
    </>
  );
}
