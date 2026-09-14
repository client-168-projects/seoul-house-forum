import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/Button";
import { AGENDA_GROUPS } from "@/data/program";
import { EVENT_INFO } from "@/data/event";
import { cn } from "@/utils/cn";

export const metadata: Metadata = {
  title: "프로그램",
  description: "2026 서울주거포럼 프로그램 순서 안내",
};

/**
 * 목업(temp/프로그램.png) 기준 1920px 프레임 수치
 * - 날짜 41px, 자료집 버튼 42px 높이(컨테이너 우측 끝 정렬)
 * - 표 컬럼: 시간 144px / 구분 196px / 내용 나머지
 * - 그룹 구분선 1px #8c8c8c, 그룹 내 세션 구분선 1px #e5e5e5(구분 컬럼부터 시작)
 */
export default function ProgramPage() {
  return (
    <>
      <Breadcrumb items={["프로그램", "프로그램"]} />
      <Container className="pt-12 pb-24 lg:pt-[77px] lg:pb-[240px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h2 className="font-heading text-section-title text-ink">
            {EVENT_INFO.dateLabel}
          </h2>
          <Button variant="accent" href="#" title="자료집 파일 준비 중입니다">
            2026 서울주거포럼 자료집 다운로드
            <DownloadIcon />
          </Button>
        </div>

        <ol className="mt-10 lg:mt-[38px]">
          {AGENDA_GROUPS.map((group) => (
            <li
              key={`${group.start}${group.entries[0].label}`}
              className="grid grid-cols-1 border-t border-line py-2 lg:grid-cols-[144px_1fr] lg:py-4"
            >
              <p className="pt-5 text-caption text-ink-muted lg:py-[26px]">
                <span className="block">{group.start}</span>
                <span className="block">{group.end}</span>
              </p>

              <div>
                {group.entries.map((entry, index) => (
                  <div
                    key={entry.label}
                    className={cn(
                      "grid grid-cols-1 gap-y-2 pt-5 lg:grid-cols-[196px_1fr] lg:gap-y-0 lg:pt-[26px]",
                      entry.title ? "pb-8 lg:pb-[51px]" : "pb-5 lg:pb-[26px]",
                      index > 0 && "border-t border-line-soft",
                    )}
                  >
                    <p className="text-body font-bold text-primary-800">
                      {entry.label}
                    </p>

                    <div>
                      {entry.title && (
                        <p className="font-heading text-subtitle text-primary-800">
                          {entry.title}
                        </p>
                      )}

                      {entry.presenters && (
                        <ul className={cn("space-y-4 lg:space-y-[32px]", entry.title && "mt-3 lg:mt-[18px]")}>
                          {entry.presenters.map((presenter) => (
                            <li
                              key={`${presenter.name}-${presenter.affiliation ?? ""}`}
                              className="text-body"
                            >
                              <span className="font-bold text-ink">{presenter.name}</span>
                              {presenter.affiliation && (
                                <span className="ml-[10px] text-ink-soft">
                                  {presenter.affiliation}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}

                      {entry.note && (
                        <p className="text-body text-ink-soft">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </>
  );
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4v13m0 0l-5-5m5 5l5-5M5 20h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
