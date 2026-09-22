import Image from "next/image";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { Button } from "@/components/ui/Button";
import { EVENT_INFO } from "@/data/event";
import { HeroAssetDevPanel } from "@/components/dev/HeroAssetDevPanel";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { buildEventJsonLd, buildWebSiteJsonLd } from "@/lib/jsonLd";

/**
 * 홈 히어로. 목업(temp/home.png) 기준 1920px 프레임 수치
 * - 섹션 높이 660px, 배경 primary-600 → primary-900 세로 그라디언트
 * - 타이틀 Gmarket Sans Bold 56px(행간 1.2, 자간 -3%) / 일시 SUIT ExtraBold 38px / 장소 16px
 * - CTA 170x42px
 * - 텍스트는 상단(pt 120px), 일러스트는 컨테이너 우측 끝 + 섹션 하단 기준
 * - 좌/우 장식(도로·건물 SVG)은 화면 양 끝에 전체 폭으로 깔린다.
 */
export default function HomePage() {
  return (
    <section className="relative flex grow flex-col overflow-hidden bg-hero-gradient text-white lg:h-[660px]">
      <JsonLd data={buildWebSiteJsonLd()} />
      <JsonLd data={buildEventJsonLd()} />
      <HeroAssetDevPanel />

      <Container className="relative flex grow flex-col">

        <div className="relative z-10 pt-[100px] sm:pt-[120px] lg:pt-[clamp(120px,calc(120px_+_(100vw_-_1920px)*0.078125),170px)]">
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
              fontSize: "clamp(32px, calc(56px + (100vw - 1920px) * 0.01875), 68px)",
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
              fontSize: "clamp(24px, calc(38px + (100vw - 1920px) * 0.0125), 46px)",
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

          <Button variant="primaryStrong" href="/register" className="mt-8 lg:mt-[32px]">
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
    </section>
  );
}
