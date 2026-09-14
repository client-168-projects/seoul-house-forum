import type { ReactNode } from "react";
import { PageHero } from "@/components/common/PageHero";
import { SubNavPills } from "@/components/common/SubNavPills";
import { FORUM_TABS } from "@/constants/nav";
import { EVENT_INFO } from "@/data/event";

export default function ForumLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageHero title={EVENT_INFO.name}>
        <SubNavPills items={FORUM_TABS} />
      </PageHero>
      {children}
    </>
  );
}
