import Image from "next/image";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { Button } from "@/components/ui/Button";
import { HeroIllustrations } from "@/components/home/HeroIllustrations";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { EVENT_INFO } from "@/data/event";
import { buildEventJsonLd, buildWebSiteJsonLd } from "@/lib/jsonLd";

export default function HomePage() {
  return (
    <section className="relative flex grow flex-col overflow-hidden bg-hero-gradient text-white lg:h-[660px]">
      <JsonLd data={buildWebSiteJsonLd()} />
      <JsonLd data={buildEventJsonLd()} />
      <HeroIllustrations />

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

        {/* PC 일러스트는 HeroIllustrations가 그린다. 모바일/태블릿은 본문 아래 섹션 바닥에 붙인다. */}
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
