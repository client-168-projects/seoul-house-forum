import type { ReactNode } from "react";
import { Container } from "@/components/common/Container";

interface PageHeroProps {
  title: string;
  children?: ReactNode;
}

/**
 * 서브 페이지 공통 히어로.
 * 목업 기준: primary-600 단색 배경, 전체 높이 431px,
 * 타이틀 62px(ink top 217px), 탭 알약 높이 40px, 하단 여백 85px.
 */
export function PageHero({ title, children }: PageHeroProps) {
  return (
    <section className="bg-primary-600 pt-[130px] pb-[50px] text-center text-white sm:pt-[160px] sm:pb-[60px] lg:h-[431px] lg:pt-[213px] lg:pb-[85px]">
      <Container className="flex flex-col items-center">
        <h1 className="font-heading text-page-title">
          {title}
        </h1>
        {children && <div className="mt-6 lg:mt-[22px]">{children}</div>}
      </Container>
    </section>
  );
}
