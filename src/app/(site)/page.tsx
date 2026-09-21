import Image from "next/image";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { Button } from "@/components/ui/Button";
import { EVENT_INFO } from "@/data/event";
import { HeroAssetDevPanel } from "@/components/dev/HeroAssetDevPanel";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { buildEventJsonLd } from "@/lib/jsonLd";

/**
 * 홈 히어로. 목업(temp/home.png) 기준 1920px 프레임 수치
 * - 섹션 높이 761px, 배경 primary-600 → primary-900 세로 그라디언트
 * - 타이틀 Gmarket Sans Bold 64px(행간 1.2, 자간 -3%) / 일시 SUIT ExtraBold 44px / 장소 16px
 * - CTA 170x42px, 캐러셀 화살표 54px 원형(컨테이너 좌우 끝, 하단에서 41px)
 * - 텍스트는 상단(pt 172px), 일러스트는 컨테이너 우측 끝 + 섹션 하단 기준
 * - 좌/우 장식(도로·건물 SVG)은 화면 양 끝에 전체 폭으로 깔린다.
 */
export default function HomePage() {
  return (
    <section className="relative flex grow flex-col overflow-hidden bg-hero-gradient text-white lg:h-[760px]">
      <JsonLd data={buildEventJsonLd()} />
      <HeroAssetDevPanel />

      <Container className="relative flex grow flex-col">

        <div className="relative z-10 pt-[100px] sm:pt-[120px] lg:pt-[clamp(153px,calc(153px_+_(100vw_-_1920px)*0.109375),223px)]">
          <Image
            src="/images/hero/logos/logo-with-brackets.svg"
            alt={EVENT_INFO.name}
            width={251}
            height={39}
            priority
            className="h-auto w-[200px] lg:w-[251px]"
          />

          <h1
            className="mt-4 font-heading font-bold tracking-[-0.03em] lg:mt-[16px]"
            style={{
              fontSize: "clamp(32px, calc(64px + (100vw - 1920px) * 0.025), 80px)",
              lineHeight: 1.2,
            }}
          >
            {EVENT_INFO.themeLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <div
            className="mt-4 font-extrabold lg:mt-[16px]"
            style={{
              fontSize: "clamp(24px, calc(44px + (100vw - 1920px) * 0.01875), 56px)",
              lineHeight: 1.04,
            }}
          >
            <p className="flex items-baseline gap-1 lg:items-end">
              <span>{EVENT_INFO.date}</span>
              <span className="text-[16px] leading-[1.5] lg:pb-[9px]">({EVENT_INFO.day})</span>
            </p>
            <p>{EVENT_INFO.time}</p>
          </div>

          <p className="mt-2 text-body font-extrabold lg:mt-[8px]">
            {EVENT_INFO.venue}
          </p>

          <Button variant="primaryStrong" href="/register" className="mt-8 lg:mt-[40px]">
            사전등록 바로가기
            <ArrowIcon />
          </Button>
        </div>

        {/* PC는 HeroAssetDevPanel이 오른쪽에 일러스트를 띄운다. 모바일/태블릿은 본문 아래, 섹션 바닥에 붙여 배치한다. */}
        <Image
          src="/images/hero/main-hero-asset.svg"
          alt=""
          width={766}
          height={512}
          aria-hidden="true"
          className="relative mx-auto mt-auto h-auto w-full max-w-[560px] pt-10 sm:pt-14 lg:hidden"
        />
      </Container>

      <div className="pointer-events-none absolute inset-x-0 bottom-[40px] hidden lg:block">
        <Container padded={false} className="flex justify-between">
          <CarouselButton direction="prev" />
          <CarouselButton direction="next" />
        </Container>
      </div>
    </section>
  );
}

/** 슬라이드가 1개뿐이라 현재는 비활성 상태로만 노출한다. */
function CarouselButton({ direction }: { direction: "prev" | "next" }) {
  return (
    <button
      type="button"
      disabled
      aria-label={direction === "prev" ? "이전 슬라이드" : "다음 슬라이드"}
      className="pointer-events-auto flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white/40 text-white shadow-[0px_2px_10px_0px_rgba(28,28,28,0.15)] disabled:opacity-100"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={direction === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
