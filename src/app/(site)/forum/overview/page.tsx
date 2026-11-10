import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { PosterViewer } from "@/components/forum/PosterViewer";
import { EVENT_INFO } from "@/data/event";
import { cn } from "@/utils/cn";

export const metadata: Metadata = buildPageMetadata({
  title: "행사 개요",
  description:
    "2026 서울주거포럼 행사 개요. 2026년 10월 7일(수) 13:00~16:00, 한국프레스센터 20층 국제회의장. 주최·주관 서울특별시, 한국도시부동산학회, 한국부동산분석학회, 서울연구원.",
  path: "/forum/overview",
  keywords: ["서울주거포럼 행사 개요", "서울주거포럼 일정", "한국프레스센터 국제회의장", "주거정책 포럼 개요"],
});

interface OverviewRow {
  tag: string;
  value: ReactNode;
}

const ROWS: OverviewRow[] = [
  { tag: "행사", value: EVENT_INFO.name },
  {
    tag: "주제",
    value: (
      <>
        <span className="block font-extrabold">{EVENT_INFO.theme}</span>
        <span className="mt-1 block text-body-lg font-semibold text-ink-soft">
          {EVENT_INFO.themeSubtitle}
        </span>
      </>
    ),
  },
  { tag: "일시", value: `${EVENT_INFO.dateLong} ${EVENT_INFO.timeRange}` },
  { tag: "장소", value: EVENT_INFO.venue },
  {
    tag: "주최·주관",
    value: `${EVENT_INFO.host}/${EVENT_INFO.organizers.map((organizer) => organizer.name).join(", ")}`,
  },
];

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
                    "flex items-center gap-4 px-2 py-3 lg:min-h-[65px] lg:gap-[28px] lg:py-[14px]",
                    odd ? "bg-surface-muted" : "bg-white",
                  )}
                >
                  <dt className="shrink-0 lg:w-[90px]">
                    <span
                      className={cn(
                        "inline-flex h-[31px] min-w-[58px] items-center justify-center rounded-full px-3 text-caption font-bold whitespace-nowrap text-white",
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
