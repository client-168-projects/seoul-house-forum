import type { ReactNode } from "react";
import { PageHero } from "@/components/common/PageHero";
import { SubNavPills } from "@/components/common/SubNavPills";
import { COMMUNITY_TABS } from "@/constants/nav";

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageHero title="소통의 장">
        <SubNavPills items={COMMUNITY_TABS} />
      </PageHero>
      {children}
    </>
  );
}
