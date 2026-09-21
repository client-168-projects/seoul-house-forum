import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/common/PageHero";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/Button";
import { EVENT_INFO } from "@/data/event";

export const metadata: Metadata = {
  title: "참가 등록",
  description: "2026 서울주거포럼 사전 참가 등록 안내",
};

const INTRO_LINES = [
  `${EVENT_INFO.name}에 여러분을 초대합니다.`,
  "각 분야 전문가와 현장의 목소리를 한자리에 모아 서울시 주거정책의 발전을 도모하는 자리입니다.",
  "관심 있는 분이라면 누구나 참여하실 수 있습니다.",
  "지금 사전등록하고 함께해 주세요.",
];

/**
 * 목업(temp/참가등록.png) 기준 1920px 프레임 수치
 * 타이포는 피그마 기준
 * - 제목 H1(44/800) / 부제 H3(30/800, Purple/Deep) / 본문 H4(22/800)
 * - 카드 제목 H2(26/800) / 일시·장소 Body1(20/800) / 버튼 H4(22/800, 흰색)
 * - 문의 정보 Body2_bold(16/800), 괄호 줄 Body2_medium(16/600)
 * - 등록 카드 603x535, bg primary-50, 버튼 343x62 알약형
 */
export default function RegisterPage() {
  return (
    <>
      <PageHero title="참가 등록" />
      <Breadcrumb items={["참가 등록", "사전 등록"]} />
      <Container className="pt-14 pb-24 text-center lg:pt-[72px] lg:pb-[240px]">
        <h2 className="text-section-title text-ink">
          {EVENT_INFO.name} 참가 등록
        </h2>
        <p className="mt-5 text-subtitle text-primary-800 lg:mt-[30px]">
          함께 논의하고, 함께 답을 찾습니다
        </p>
        <div className="mt-8 text-body-lg leading-[1.7] text-ink max-lg:font-semibold lg:mt-[45px] lg:text-h4">
          {INTRO_LINES.map((line, index) => (
            <p key={`${line}-${index}`}>{line}</p>
          ))}
        </div>

        <div className="mx-auto mt-14 flex w-full max-w-[603px] flex-col items-center bg-primary-50 px-6 py-10 lg:mt-[80px] lg:h-[535px] lg:px-0 lg:py-[45px]">
          <Image
            src="/images/icons/register-icon.svg"
            alt=""
            width={168}
            height={168}
            className="h-[120px] w-[120px] lg:h-[168px] lg:w-[168px]"
          />
          <p className="mt-8 text-card-title text-ink lg:mt-[48px]">
            {EVENT_INFO.name}
          </p>
          <div className="mt-4 text-body-lg font-extrabold text-ink lg:mt-[27px]">
            <p>{EVENT_INFO.dateLabel}</p>
            <p>{EVENT_INFO.time}</p>
            <p>{EVENT_INFO.venue}</p>
          </div>
          <Button
            variant="pill"
            href={EVENT_INFO.registrationFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 w-full max-w-[343px] text-h4 lg:mt-[41px]"
          >
            사전 참가 등록하기
          </Button>
        </div>

        <div className="mt-7 text-ink lg:mt-[29px]">
          <p className="text-body font-extrabold">문의 정보</p>
          <p className="text-body font-semibold">
            (전화 {EVENT_INFO.inquiryPhone} / 메일 {EVENT_INFO.inquiryEmail})
          </p>
        </div>
      </Container>
    </>
  );
}
