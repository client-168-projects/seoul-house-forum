import Image from "next/image";
import { EVENT_INFO } from "@/data/event";
import { Container } from "@/components/common/Container";

const INFO_ROWS = [
  { label: "장소", value: `${EVENT_INFO.venue} · ${EVENT_INFO.address}` },
  { label: "문의", value: EVENT_INFO.inquiryPhone },
  { label: "연락처 / 이메일", value: EVENT_INFO.inquiryEmail },
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

        <dl className="space-y-4 text-caption lg:justify-self-center">
          <div className="flex items-start gap-[14px]">
            <dt className="w-7 shrink-0 pt-1 text-ink-soft">주최</dt>
            <dd>
              <Image
                src="/images/hero/logos/seoul-city-logo.svg"
                alt={EVENT_INFO.host}
                width={185}
                height={48}
                className="h-auto w-[185px]"
              />
            </dd>
          </div>
          <div className="flex items-start gap-[14px]">
            <dt className="w-7 shrink-0 pt-1 text-ink-soft">주관</dt>
            <dd className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {EVENT_INFO.organizers.map((organizer) => (
                <Image
                  key={organizer.name}
                  src={organizer.logo.src}
                  alt={organizer.name}
                  width={organizer.logo.width}
                  height={organizer.logo.height}
                  className="w-auto"
                  style={{ height: organizer.logo.displayHeight }}
                />
              ))}
            </dd>
          </div>
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
