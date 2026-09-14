import type { Notice } from "@/data/notices";

interface NoticeTableProps {
  notices: Notice[];
}

/**
 * 목업 기준: 상단 2px #707070 테두리, 행 높이 110px(1px #8c8c8c 구분선),
 * 번호 컬럼 108px / 제목 / 날짜 우측 정렬.
 */
export function NoticeTable({ notices }: NoticeTableProps) {
  if (notices.length === 0) {
    return (
      <p className="border-t-2 border-[#707070] py-24 text-center text-body text-ink-muted">
        등록된 게시글이 없습니다.
      </p>
    );
  }

  return (
    <div className="border-t-2 border-[#707070]">
      <ul>
        {notices.map((notice) => (
          <li
            key={notice.id}
            className="grid grid-cols-[48px_1fr] items-center gap-x-4 border-b border-line py-6 lg:h-[110px] lg:grid-cols-[108px_1fr_auto] lg:gap-x-0 lg:py-0"
          >
            <span className="text-caption text-ink-muted">
              {String(notice.id).padStart(2, "0")}
            </span>
            <span className="text-body font-bold text-ink">
              {notice.title}
            </span>
            <span className="col-start-2 text-body text-ink-muted lg:col-start-3 lg:font-bold lg:text-ink">
              {notice.date}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
