import { PageHero } from "@/components/common/PageHero";
import { SubNavPills } from "@/components/common/SubNavPills";
import { COMMUNITY_TABS } from "@/constants/nav";

export function CommunityHero({ variant }: { variant?: "default" | "overlay" }) {
  return (
    <PageHero title="소통의 장" variant={variant}>
      <SubNavPills items={COMMUNITY_TABS} />
    </PageHero>
  );
}
