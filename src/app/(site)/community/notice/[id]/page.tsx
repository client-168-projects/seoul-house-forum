import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { AttachmentList } from "@/components/community/AttachmentList";
import { Button } from "@/components/ui/Button";
import { SITE_NAME } from "@/constants/nav";
import { OG_IMAGE } from "@/constants/site";
import { buildBreadcrumbJsonLd, buildNoticeJsonLd } from "@/lib/jsonLd";
import { parseId } from "@/lib/server/http";
import { getNotice, getNoticeNeighbors } from "@/lib/server/repositories/notices";
import { renderRichText } from "@/lib/server/richTextHtml";
import type { NoticeSummary } from "@/types/notice";
import { formatDate } from "@/utils/date";

export const dynamic = "force-dynamic";

/** generateMetadata와 페이지가 같은 요청에서 공지를 두 번 조회하지 않도록 한다. */
const loadNotice = cache(async (rawId: string) => {
  const id = parseId(rawId);
  return id ? getNotice(id) : null;
});

export async function generateMetadata({ params }: PageProps<"/community/notice/[id]">): Promise<Metadata> {
  const notice = await loadNotice((await params).id);
  if (!notice) return { title: "공지사항" };

  const description = notice.contentText.slice(0, 120);
  return {
    title: notice.title,
    description,
    alternates: { canonical: `/community/notice/${notice.id}` },
    openGraph: {
      title: notice.title,
      description,
      type: "article",
      siteName: SITE_NAME,
      locale: "ko_KR",
      url: `/community/notice/${notice.id}`,
      publishedTime: notice.createdAt,
      modifiedTime: notice.updatedAt,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: notice.title, description, images: [OG_IMAGE.url] },
  };
}

export default async function NoticeDetailPage({ params }: PageProps<"/community/notice/[id]">) {
  const notice = await loadNotice((await params).id);
  if (!notice) notFound();

  const { previous, next } = await getNoticeNeighbors(notice);

  return (
    <>
      <JsonLd data={buildNoticeJsonLd(notice)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "소통의 장", path: "/community/notice" },
          { name: "공지사항", path: "/community/notice" },
          { name: notice.title, path: `/community/notice/${notice.id}` },
        ])}
      />
      <Breadcrumb items={["소통의 장", "공지사항"]} />
      <Container className="pt-12 pb-24 lg:pt-[80px] lg:pb-[240px]">
        <article>
          <header className="border-t-2 border-[#707070] pt-8 pb-7 lg:pt-[40px] lg:pb-[32px]">
            <p className="flex items-center gap-[10px] text-caption font-extrabold text-primary-600">
              <span aria-hidden="true" className="inline-block h-[14px] w-[4px] rounded-full bg-accent" />
              공지사항
            </p>

            <h2 className="mt-[14px] text-subtitle text-ink">{notice.title}</h2>

            <dl className="mt-[20px] flex flex-wrap items-center gap-x-[28px] gap-y-2 text-caption text-ink-muted">
              <div className="flex items-center gap-[8px]">
                <dt className="font-bold text-ink-soft">등록일</dt>
                <dd>
                  <time dateTime={notice.createdAt}>{formatDate(notice.createdAt)}</time>
                </dd>
              </div>
              <div className="flex items-center gap-[8px]">
                <dt className="font-bold text-ink-soft">번호</dt>
                <dd>{String(notice.id).padStart(2, "0")}</dd>
              </div>
            </dl>
          </header>

          <div
            className="rich-text border-t border-line-soft py-10 text-body-lg text-ink-soft lg:py-[56px]"
            dangerouslySetInnerHTML={{ __html: renderRichText(notice.content) }}
          />

          {notice.attachments.length > 0 && <AttachmentList attachments={notice.attachments} />}
        </article>

        <nav aria-label="이전 다음 글" className="border-t border-line">
          <NeighborRow label="이전글" notice={previous} />
          <NeighborRow label="다음글" notice={next} />
        </nav>

        <div className="mt-10 flex justify-center lg:mt-[48px]">
          <Button variant="pill" href="/community/notice" className="w-[200px]">
            목록으로
          </Button>
        </div>
      </Container>
    </>
  );
}

function NeighborRow({ label, notice }: { label: string; notice?: NoticeSummary }) {
  const isPrevious = label === "이전글";

  const content = (
    <>
      <span className="flex w-[72px] shrink-0 items-center gap-[6px] text-caption font-bold text-ink-soft">
        <ChevronIcon up={!isPrevious} />
        {label}
      </span>
      <span className="truncate text-body text-ink-muted group-hover:text-primary-600">
        {notice ? notice.title : `${label}이 없습니다`}
      </span>
      {notice && (
        <span className="ml-auto hidden shrink-0 text-caption text-ink-muted sm:block">{formatDate(notice.createdAt)}</span>
      )}
    </>
  );

  const rowClass =
    "flex items-center gap-[16px] border-b border-line-soft px-2 py-4 lg:h-[64px] lg:px-[10px] lg:py-0";

  if (!notice) {
    return <div className={rowClass}>{content}</div>;
  }

  return (
    <Link href={`/community/notice/${notice.id}`} className={`group ${rowClass} hover:bg-primary-50`}>
      {content}
    </Link>
  );
}

function ChevronIcon({ up }: { up: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={up ? "rotate-180" : undefined}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
