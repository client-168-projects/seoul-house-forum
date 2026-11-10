import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { RouteBadge, RouteSteps } from "@/components/forum/RouteBadge";
import { EVENT_INFO } from "@/data/event";
import { BUS_STOPS, CAR_ROUTES, MAP_EMBED_URL, SUBWAY_ROUTES } from "@/data/location";

export const metadata: Metadata = buildPageMetadata({
  title: "오시는 길",
  description:
    "2026 서울주거포럼 행사장 오시는 길. 한국프레스센터 20층 국제회의장(서울특별시 중구 세종대로 124) 지하철·버스·자가용 경로 안내.",
  path: "/forum/location",
  keywords: ["한국프레스센터 오시는 길", "프레스센터 국제회의장 위치", "시청역 프레스센터", "서울주거포럼 장소"],
});

export default function ForumLocationPage() {
  return (
    <>
      <Breadcrumb items={["2026 서울주거포럼", "오시는 길"]} />
      <Container className="pt-12 pb-24 lg:pt-[82px] lg:pb-[240px]">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 bg-primary-950 px-5 py-4 lg:h-[65px] lg:px-[20px] lg:py-0">
          <p className="text-h4 text-white">{EVENT_INFO.venue}</p>
          <p className="text-body-lg text-white">{EVENT_INFO.address}</p>
        </div>

        <div className="mt-6 aspect-[4/3] w-full overflow-hidden sm:aspect-[1200/561] lg:mt-[30px]">
          <iframe
            src={MAP_EMBED_URL}
            title={`${EVENT_INFO.venue} 위치 지도`}
            className="h-full w-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

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
                    <RouteBadge tone={stop.tone} className="self-start lg:min-w-[150px] lg:justify-center">
                      {stop.stop}
                    </RouteBadge>
                    <dl className="space-y-[10px]">
                      {stop.groups.map((group) => (
                        <div key={group.type}>
                          <dt className="text-body font-extrabold text-ink">
                            {group.type}
                          </dt>
                          <dd className="text-body font-semibold text-ink">
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
      <h2 className="text-body-lg font-extrabold text-primary-800">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}
