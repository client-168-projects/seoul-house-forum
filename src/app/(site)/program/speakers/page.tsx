import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { SpeakerGrid } from "@/components/program/SpeakerGrid";
import { SPEAKERS } from "@/data/program";

export const metadata: Metadata = {
  title: "연사 소개",
  description: "2026 서울주거포럼 연사 소개",
};

export default function SpeakersPage() {
  return (
    <>
      <Breadcrumb items={["프로그램", "연사 소개"]} />
      <Container className="pt-12 pb-24 lg:pt-[72px] lg:pb-[240px]">
        <SpeakerGrid speakers={SPEAKERS} />
      </Container>
    </>
  );
}
