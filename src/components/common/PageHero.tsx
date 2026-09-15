import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/common/Container";

interface PageHeroProps {
  title: string;
  children?: ReactNode;
}

export function PageHero({ title, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-primary-600 pt-[130px] pb-[50px] text-center text-white sm:pt-[160px] sm:pb-[60px] lg:h-[431px] lg:pt-[213px] lg:pb-[85px]">
      <Image
        src="/images/hero/page-hero-left.svg"
        alt=""
        width={727}
        height={247}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-20px] left-0 hidden h-auto w-[727px] lg:block"
      />
      <Image
        src="/images/hero/page-hero-right.svg"
        alt=""
        width={623}
        height={310}
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-[26px] hidden h-auto w-[623px] lg:block"
      />

      <Container className="relative z-10 flex flex-col items-center">
        <h1 className="font-heading text-page-title">
          {title}
        </h1>
        {children && <div className="mt-6 lg:mt-[22px]">{children}</div>}
      </Container>
    </section>
  );
}
