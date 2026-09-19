import type { ReactNode } from "react";
import { PageHero } from "@/components/common/PageHero";
import { SubNavPills } from "@/components/common/SubNavPills";
import { PROGRAM_TABS } from "@/constants/nav";

export default function ProgramLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageHero title="프로그램">
        <SubNavPills items={PROGRAM_TABS} />
      </PageHero>
      {children}
    </>
  );
}
