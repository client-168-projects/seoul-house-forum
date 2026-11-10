import Link from "next/link";
import type { NoticeSummary } from "@/types/notice";
import { formatDate } from "@/utils/date";

interface NoticeTableProps {
  notices: NoticeSummary[];
  emptyMessage?: string;
}

export function NoticeTable({ notices, emptyMessage = "등록된 게시글이 없습니다." }: NoticeTableProps) {
  if (notices.length === 0) {
    return (
      <p className="border-t-2 border-[#707070] py-24 text-center text-body-lg text-ink-muted">{emptyMessage}</p>
    );
  }

  return (
    <div className="border-t-2 border-[#707070]">
      <ul>
        {notices.map((notice) => (
          <li
            key={notice.id}
            className="group grid grid-cols-[48px_1fr] items-center gap-x-4 border-b border-line py-6 transition-colors hover:bg-primary-50 lg:h-[110px] lg:grid-cols-[108px_1fr_auto] lg:gap-x-0 lg:py-0"
          >
            <span className="text-body-lg text-ink-muted">{String(notice.id).padStart(2, "0")}</span>
            <Link
              href={`/community/notice/${notice.id}`}
              className="flex items-center gap-2 text-body-lg font-bold text-ink group-hover:text-primary-700 group-hover:underline group-hover:underline-offset-[6px]"
            >
              {notice.title}
              {notice.attachmentCount > 0 && (
                <span className="shrink-0 text-primary-400" title="첨부파일 있음">
                  <PaperclipIcon />
                  <span className="sr-only">첨부파일 있음</span>
                </span>
              )}
            </Link>
            <span className="col-start-2 text-body-lg text-ink-muted lg:col-start-3 lg:font-bold lg:text-ink">
              {formatDate(notice.createdAt)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PaperclipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 11.5l-8.6 8.6a5.5 5.5 0 01-7.8-7.8l8.6-8.6a3.7 3.7 0 015.2 5.2l-8.6 8.6a1.8 1.8 0 01-2.6-2.6l7.9-7.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
