import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { EVENT_INFO } from "@/data/event";
import { Container } from "@/components/common/Container";

const INFO_ROWS = [
  { label: "장소", value: `${EVENT_INFO.venue} · ${EVENT_INFO.address}` },
  { label: "문의", value: EVENT_INFO.inquiryOffice },
  { label: "T.", value: `${EVENT_INFO.inquiryPhone}(${EVENT_INFO.inquiryHours})` },
  { label: "E-mail.", value: EVENT_INFO.inquiryEmail },
];

/**
 * 목업 기준 수치 (1920px 프레임)
 * - 배경 #ededed, 상단 여백 60px, 브라켓 로고 251x39, 정보 15px·행 간격 29px
 * - 하단 구분선은 화면 전체 폭(full bleed) 1px primary-600
 */
export function Footer() {
  return (
    <footer className="bg-footer-bg text-ink">
      <Container className="grid gap-10 pt-10 pb-9 lg:grid-cols-2 lg:pt-[60px] lg:pb-[37px]">
        <div>
          <Image
            src="/images/hero/logos/logo-with-brackets-dark.svg"
            alt={EVENT_INFO.name}
            width={251}
            height={39}
            className="h-auto w-[200px] lg:w-[251px]"
          />
          <dl className="mt-[21px] text-caption">
            {INFO_ROWS.map((row) => (
              <div key={row.label} className="flex gap-[10px] py-[4.5px]">
                <dt className="shrink-0 font-bold">{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <dl className="flex items-start gap-[14px] text-caption lg:justify-self-center">
          {/* 모바일은 40px 로고 링크의 세로 중앙에 라벨을 맞춘다. */}
          <dt className="shrink-0 whitespace-nowrap pt-[11px] text-ink-soft lg:pt-1">주최·주관</dt>
          <dd className="space-y-4">
            <div className="flex">
              <LogoLink href={EVENT_INFO.hostUrl} name={EVENT_INFO.host}>
                <Image
                  src="/images/hero/logos/seoul-city-logo.svg"
                  alt={EVENT_INFO.host}
                  width={185}
                  height={48}
                  className="h-auto w-[132px] lg:w-[185px]"
                />
              </LogoLink>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 lg:gap-x-6 lg:gap-y-3">
              {EVENT_INFO.organizers.map((organizer) => (
                <LogoLink key={organizer.name} href={organizer.url} name={organizer.name}>
                  {/* 모바일은 PC 표시 높이의 70%로 줄인다. */}
                  <Image
                    src={organizer.logo.src}
                    alt={organizer.name}
                    width={organizer.logo.width}
                    height={organizer.logo.height}
                    className="h-[calc(var(--logo-height)*0.7)] w-auto lg:h-(--logo-height)"
                    style={{ "--logo-height": `${organizer.logo.displayHeight}px` } as CSSProperties}
                  />
                </LogoLink>
              ))}
            </div>
          </dd>
        </dl>
      </Container>

      <div className="h-px w-full bg-footer-line" />

      <Container className="py-[30px]">
        <p className="text-caption text-ink-muted">
          &copy; {EVENT_INFO.name}. ALL RIGHT RESERVED
        </p>
      </Container>
    </footer>
  );
}

/** 주최/주관 기관 로고. 외부 사이트라 새 창으로 열고, 터치 영역은 최소 40px 높이를 확보한다. */
function LogoLink({ href, name, children }: { href: string; name: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} 홈페이지 (새 창)`}
      className="inline-flex min-h-10 items-center rounded-[6px] transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
    >
      {children}
    </a>
  );
}
