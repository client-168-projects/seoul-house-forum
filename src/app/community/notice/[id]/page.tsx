import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/Button";
import { NOTICES, findNotice, getNoticeNeighbors, type Notice } from "@/data/notices";

interface NoticeDetailProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return NOTICES.map((notice) => ({ id: String(notice.id) }));
}

export async function generateMetadata({ params }: NoticeDetailProps): Promise<Metadata> {
  const { id } = await params;
  const notice = findNotice(Number(id));
  if (!notice) return { title: "공지사항" };

  return {
    title: notice.title,
    description: notice.content.split("\n\n")[0],
  };
}

/**
 * 공지사항 상세. 목록 표의 2px #707070 상단선을 그대로 이어받아
 * 제목 - 본문 - 이전/다음 - 목록 버튼 순으로 쌓는다.
 */
export default async function NoticeDetailPage({ params }: NoticeDetailProps) {
  const { id } = await params;
  const notice = findNotice(Number(id));
  if (!notice) notFound();

  const { previous, next } = getNoticeNeighbors(notice.id);

  return (
    <>
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
                <dd>{notice.date}</dd>
              </div>
              <div className="flex items-center gap-[8px]">
                <dt className="font-bold text-ink-soft">번호</dt>
                <dd>{String(notice.id).padStart(2, "0")}</dd>
              </div>
            </dl>
          </header>

          <div className="space-y-[24px] border-t border-line-soft py-10 text-body-lg leading-[1.8] text-ink-soft lg:py-[56px]">
            {notice.content.split("\n\n").map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 12)}-${index}`}>{paragraph}</p>
            ))}
          </div>
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

function NeighborRow({ label, notice }: { label: string; notice?: Notice }) {
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
      {notice && <span className="ml-auto hidden shrink-0 text-caption text-ink-muted sm:block">{notice.date}</span>}
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
