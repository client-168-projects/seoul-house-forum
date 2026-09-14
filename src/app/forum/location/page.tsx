import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { AssetPlaceholder } from "@/components/common/AssetPlaceholder";
import { RouteBadge, RouteSteps } from "@/components/forum/RouteBadge";
import { EVENT_INFO } from "@/data/event";
import { BUS_STOPS, CAR_ROUTES, SUBWAY_ROUTES } from "@/data/location";

export const metadata: Metadata = {
  title: "오시는 길",
  description: "2026 서울주거포럼 행사장 오시는 길 안내",
};

/**
 * 목업(temp/오시는길.png) 기준 1920px 프레임 수치
 * - 주소 바 높이 66px(bg primary-50), 지도 1200x561px
 * - 교통 섹션: 제목 컬럼 163px + 내용 컬럼, 섹션 사이 1px #eee 구분선
 */
export default function ForumLocationPage() {
  return (
    <>
      <Breadcrumb items={["2026 서울주거포럼", "오시는 길"]} />
      <Container className="pt-12 pb-24 lg:pt-[82px] lg:pb-[240px]">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 bg-primary-50 px-5 py-4 lg:h-[66px] lg:px-[20px] lg:py-0">
          <p className="text-body font-bold text-ink">{EVENT_INFO.venue}</p>
          <p className="text-body text-ink">{EVENT_INFO.address}</p>
        </div>

        <AssetPlaceholder
          assetId="static-map"
          aspectClassName="aspect-[1200/561] w-full"
          className="mt-6 lg:mt-[30px]"
        />

        <div className="mt-14 border-t border-line-faint lg:mt-[75px]">
          <TransitSection title="지하철">
            <ul className="space-y-[19px]">
              {SUBWAY_ROUTES.map((route) => (
                <li key={route.label} className="flex flex-wrap items-center gap-x-[14px] gap-y-2">
                  <RouteBadge>{route.label}</RouteBadge>
                  <RouteSteps steps={route.steps} />
                </li>
              ))}
            </ul>
          </TransitSection>

          <TransitSection title="버스">
            <ul>
              {BUS_STOPS.map((stop, index) => (
                <li
                  key={stop.stop}
                  className={
                    index > 0 ? "mt-[24px] border-t border-line-faint pt-[24px]" : undefined
                  }
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:gap-[16px]">
                    <RouteBadge tone={stop.tone} className="self-start lg:w-[150px] lg:justify-center">
                      {stop.stop}
                    </RouteBadge>
                    <dl className="space-y-[10px]">
                      {stop.groups.map((group) => (
                        <div key={group.type}>
                          <dt className="text-body font-bold text-ink">
                            {group.type}
                          </dt>
                          <dd className="text-body text-ink">
                            <span className="mr-2" aria-hidden="true">
                              &bull;
                            </span>
                            {group.routes.join(", ")}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </li>
              ))}
            </ul>
          </TransitSection>

          <TransitSection title="자가용">
            <ul className="space-y-[19px]">
              {CAR_ROUTES.map((route) => (
                <li key={route.label} className="flex flex-wrap items-center gap-x-[14px] gap-y-2">
                  <RouteBadge className="lg:w-[110px] lg:justify-center">{route.label}</RouteBadge>
                  <RouteSteps steps={route.steps} />
                </li>
              ))}
            </ul>
          </TransitSection>
        </div>
      </Container>
    </>
  );
}

function TransitSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-b border-line-faint py-10 lg:grid-cols-[163px_1fr] lg:gap-0 lg:py-[40px]">
      <h2 className="font-heading text-subtitle text-primary-800">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}
