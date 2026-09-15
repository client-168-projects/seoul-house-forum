import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { INTRO_CONTENT } from "@/data/intro";

export const metadata: Metadata = {
  title: "2026 서울주거포럼 소개",
  description: "2026 서울주거포럼을 소개합니다.",
};

export default function ForumIntroPage() {
  return (
    <>
      <Breadcrumb items={["2026 서울주거포럼", "소개"]} />
      <Container className="pt-14 pb-24 text-center lg:pt-[72px] lg:pb-[242px]">
        <h2 className="text-section-title text-ink">
          {INTRO_CONTENT.heading}
        </h2>
        <p className="mt-5 text-subtitle text-primary-800 lg:mt-[30px]">
          {INTRO_CONTENT.subheading}
        </p>
        <div className="mt-8 text-body-lg font-bold text-ink lg:mt-[43px]">
          {INTRO_CONTENT.lines.map((line, index) => (
            <p key={`${line}-${index}`}>{line}</p>
          ))}
        </div>
      </Container>
    </>
  );
}
