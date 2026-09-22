import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { EVENT_INFO } from "@/data/event";
import { INTRO_CONTENT } from "@/data/intro";

export const metadata: Metadata = buildPageMetadata({
  title: "2026 서울주거포럼 소개",
  description:
    "2026 서울주거포럼은 서울특별시가 시민의 안정된 삶의 터전을 위해 마련한 시민 참여형 주거정책 소통의 장입니다. 주제는 전월세시장 현황 진단 및 안정화 방안 모색입니다.",
  path: "/forum/intro",
  keywords: ["서울주거포럼 소개", "서울 주거정책 포럼", "시민 참여형 주거정책", "전월세시장 안정화"],
});

export default function ForumIntroPage() {
  return (
    <>
      <Breadcrumb items={["2026 서울주거포럼", "소개"]} />
      <Container className="pt-14 pb-24 text-center lg:pt-[72px] lg:pb-[242px]">
        <h2 className="text-section-title text-ink">
          {INTRO_CONTENT.heading}
        </h2>
        <div className="mx-auto mt-5 max-w-205 break-keep lg:mt-[30px]">
          <p className="text-h4 font-extrabold text-ink">{EVENT_INFO.theme}</p>
          <p className="mt-2 text-body-lg font-semibold text-ink-soft">
            {EVENT_INFO.themeSubtitle}
          </p>
        </div>
        <p className="mt-5 text-subtitle text-primary-800 lg:mt-[30px]">
          {INTRO_CONTENT.subheading}
        </p>
        <div className="mx-auto mt-8 max-w-205 space-y-6 text-body-lg font-bold break-keep text-ink lg:mt-[43px]">
          {INTRO_CONTENT.paragraphs.map((lines, paragraphIndex) => (
            <p key={paragraphIndex}>
              {lines.map((line, lineIndex) => (
                <span key={lineIndex} className="sm:block">
                  {line}{" "}
                </span>
              ))}
            </p>
          ))}
        </div>
      </Container>
    </>
  );
}
