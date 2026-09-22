import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { CommunityHero } from "@/components/community/CommunityHero";
import { OpinionBoard } from "@/components/community/OpinionBoard";
import { OpinionForm } from "@/components/community/OpinionForm";
import { BOARD_PUBLIC_PAGE_SIZE } from "@/constants/board";
import { getEnv } from "@/lib/server/cloudflare";
import { listApprovedPosts } from "@/lib/server/repositories/boardPosts";

const DESCRIPTION =
  "서울의 전월세 시장이 안정화되기 위해 무엇이 필요한지 의견을 남기고 함께 나눠요.";

export const metadata: Metadata = buildPageMetadata({
  title: "자유게시판",
  description: DESCRIPTION,
  path: "/community/board",
  keywords: ["서울주거포럼 자유게시판", "전월세 시민의견", "서울 주거 의견", "주거정책 시민 참여"],
});

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const initial = await listApprovedPosts(1, BOARD_PUBLIC_PAGE_SIZE);
  const turnstileSiteKey = getEnv().TURNSTILE_SITE_KEY;

  return (
    <div className="relative overflow-hidden bg-primary-600 text-white lg:min-h-[2180px]">
      <BoardBackdrop />
      <CommunityHero variant="overlay" />

      <section className="relative pt-8 pb-24 lg:pt-[36px] lg:pb-[240px]">
        <Container className="relative">
          <div className="grid gap-8 lg:grid-cols-[1fr_600px] lg:items-start lg:gap-12">
            <div className="text-center lg:text-left">
              <h2 className="font-heading text-section-title leading-[1.3] break-keep">
                서울의 전월세 시장이
                <br />
                안정화되기 위해
                <br />
                무엇이 필요할까요?
              </h2>
              <p className="mt-4 text-body-lg text-white/85 lg:mt-5">
                여러분의 소중한 의견을 남겨주세요.
                <br />
                남겨주신 의견은 운영자 검수 후 공유됩니다.
              </p>
            </div>
            <OpinionForm turnstileSiteKey={turnstileSiteKey} />
          </div>

          <h2 className="sr-only">시민 의견 목록</h2>
          <OpinionBoard initial={initial} />
        </Container>
      </section>
    </div>
  );
}

/**
 * 히어로와 본문에 걸쳐 깔리는 장식(피그마 자유게시판 좌/우/우하단). SVG에 투명도 0.2가 들어 있다.
 * PC 위치는 1920px 목업 기준 페이지 상단에서의 거리, 모바일은 작게 줄여 가장자리에 붙인다.
 */
function BoardBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <Image
        src="/images/board/notes-right.svg"
        alt=""
        width={638}
        height={409}
        loading="eager"
        className="absolute top-[72px] right-0 h-auto w-[48%] max-w-[360px] sm:top-[88px] lg:top-[216px] lg:w-[638px] lg:max-w-none"
      />
      <Image
        src="/images/board/notes-left.svg"
        alt=""
        width={743}
        height={364}
        loading="eager"
        className="absolute top-[190px] left-0 h-auto w-[60%] max-w-[420px] sm:top-[230px] lg:top-[704px] lg:w-[743px] lg:max-w-none"
      />
      <Image
        src="/images/board/notes-bottom-right.svg"
        alt=""
        width={952}
        height={838}
        className="absolute right-0 bottom-0 h-auto w-[90%] max-w-[560px] lg:w-[952px] lg:max-w-none"
      />
    </div>
  );
}
