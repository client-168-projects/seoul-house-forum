import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { SpeakerGrid } from "@/components/program/SpeakerGrid";
import { SPEAKER_SECTIONS } from "@/data/program";

export const metadata: Metadata = buildPageMetadata({
  title: "연사 소개",
  description:
    "2026 서울주거포럼 연사 소개. 기조발제 이창무 서울특별시 총괄건축가, 주제발표 이상영·조강태·김준형, 사회 김인만, 토론 정재훈 등.",
  path: "/program/speakers",
  keywords: ["서울주거포럼 연사", "이창무 총괄건축가", "이상영 명지대학교", "김준형 명지대학교", "조강태 MGRV"],
});

export default function SpeakersPage() {
  return (
    <>
      <Breadcrumb items={["프로그램", "연사 소개"]} />
      <Container className="pt-12 pb-24 lg:pt-[72px] lg:pb-[240px]">
        <SpeakerGrid sections={SPEAKER_SECTIONS} />
      </Container>
    </>
  );
}
