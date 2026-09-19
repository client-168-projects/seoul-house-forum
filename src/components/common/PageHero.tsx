import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/common/Container";
import { cn } from "@/utils/cn";

interface PageHeroProps {
  title: string;
  children?: ReactNode;
  /**
   * overlay: 배경색과 좌우 장식을 그리지 않는다.
   * 자유게시판처럼 히어로와 본문이 한 배경을 공유하고 장식을 페이지가 직접 배치할 때 쓴다.
   */
  variant?: "default" | "overlay";
}

/** 모바일/태블릿은 좌우 장식을 작고 옅게 깔아 제목 가독성을 해치지 않게 한다(M02 시안). */
export function PageHero({
  title,
  children,
  variant = "default",
}: PageHeroProps) {
  const isOverlay = variant === "overlay";

  return (
    <section
      className={cn(
        "relative overflow-hidden pt-[130px] pb-[50px] text-center text-white sm:pt-[160px] sm:pb-[60px] lg:h-[431px] lg:pt-[213px] lg:pb-[85px]",
        !isOverlay && "bg-primary-600",
      )}
    >
      {!isOverlay && (
        <>
          <Image
            src="/images/hero/page-hero-left.svg"
            alt=""
            width={727}
            height={247}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-8px] left-0 h-auto w-[46%] max-w-[360px] opacity-35 lg:bottom-[-20px] lg:w-[727px] lg:max-w-none lg:opacity-100"
          />
          <Image
            src="/images/hero/page-hero-right.svg"
            alt=""
            width={623}
            height={310}
            aria-hidden="true"
            className="pointer-events-none absolute top-[76px] right-0 h-auto w-[42%] max-w-[320px] opacity-35 sm:top-[88px] lg:top-auto lg:bottom-[26px] lg:w-[623px] lg:max-w-none lg:opacity-100"
          />
        </>
      )}

      <Container className="relative z-10 flex flex-col items-center">
        <h1 className="font-heading text-page-title">{title}</h1>
        {children && <div className="mt-6 lg:mt-[22px]">{children}</div>}
      </Container>
    </section>
  );
}
