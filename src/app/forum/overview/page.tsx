import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import Image from "next/image";
import { PosterViewer } from "@/components/forum/PosterViewer";
import { EVENT_INFO } from "@/data/event";
import { cn } from "@/utils/cn";

export const metadata: Metadata = {
  title: "행사 개요",
  description: "2026 서울주거포럼 행사 개요 안내",
};

interface OverviewRow {
  tag: string;
  value: ReactNode;
}

const ROWS: OverviewRow[] = [
  { tag: "행사", value: EVENT_INFO.name },
  { tag: "주제", value: `${EVENT_INFO.theme}${EVENT_INFO.themeNote}` },
  { tag: "일시", value: `${EVENT_INFO.dateLong} ${EVENT_INFO.timeRange}` },
  { tag: "장소", value: EVENT_INFO.venue },
  {
    tag: "주최",
    value: (
      <Image
        src="/images/hero/logos/seoul-city-logo.svg"
        alt={EVENT_INFO.host}
        width={185}
        height={48}
        className="h-[28px] w-auto"
      />
    ),
  },
];

/**
 * 목업(temp/event-info.png) 기준 1920px 프레임 수치
 * - 본문 블록 1104px 중앙 정렬 = 표 790px + 간격 40px + 포스터 274px(A4 비율)
 * - 표 행 높이 65px, 홀수 행 배경 #F5F5F5 + primary-800 배지 / 짝수 행 흰 배경 + primary-600 배지
 */
export default function ForumOverviewPage() {
  return (
    <>
      <Breadcrumb items={["2026 서울주거포럼", "행사 개요"]} />
      <Container className="pt-12 pb-24 lg:pt-[71px] lg:pb-[240px]">
        <div className="mx-auto grid w-full max-w-[1104px] gap-8 lg:grid-cols-[790px_274px] lg:gap-10">
          <dl>
            {ROWS.map((row, index) => {
              const odd = index % 2 === 0;
              return (
                <div
                  key={row.tag}
                  className={cn(
                    "flex items-center gap-4 px-2 py-3 lg:h-[65px] lg:gap-[28px] lg:py-0",
                    odd ? "bg-surface-muted" : "bg-white",
                  )}
                >
                  <dt>
                    <span
                      className={cn(
                        "inline-flex h-[31px] w-[58px] items-center justify-center rounded-full text-caption font-bold text-white",
                        odd ? "bg-primary-800" : "bg-primary-600",
                      )}
                    >
                      {row.tag}
                    </span>
                  </dt>
                  <dd className="text-h4 text-ink">
                    {row.value}
                  </dd>
                </div>
              );
            })}
          </dl>

          <PosterViewer alt={`${EVENT_INFO.name} 포스터`} />
        </div>
      </Container>
    </>
  );
}
