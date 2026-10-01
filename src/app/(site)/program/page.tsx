import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { AgendaTable } from "@/components/program/AgendaTable";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Button } from "@/components/ui/Button";
import { AGENDA_ROWS } from "@/data/program";
import { EVENT_INFO } from "@/data/event";

export const metadata: Metadata = buildPageMetadata({
  title: "프로그램",
  description:
    "2026 서울주거포럼 프로그램. 기조발제 매매시장 규제강화와 전월세시장의 불안, 주제발표 3건, 패널토론과 시민 질의응답으로 진행됩니다.",
  path: "/program",
  keywords: ["서울주거포럼 프로그램", "매매시장 규제강화와 전월세시장의 불안","기업형 민간임대 국내외 사례 및 활성화 방안", "장기전세주택 성과", "패널토론"],
});

export default function ProgramPage() {
  return (
    <>
      <Breadcrumb items={["프로그램", "프로그램"]} />
      <Container className="pt-12 pb-24 lg:pt-[77px] lg:pb-[240px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h2 className="text-section-title text-ink">
            {EVENT_INFO.dateLabel}
          </h2>
          <Button variant="primaryStrong" href="#" title="자료집 파일 준비 중입니다">
            2026 서울주거포럼 자료집 다운로드
            <ArrowIcon direction="down" />
          </Button>
        </div>

        <AgendaTable rows={AGENDA_ROWS} />
      </Container>
    </>
  );
}
