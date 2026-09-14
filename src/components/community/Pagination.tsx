import { cn } from "@/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

/** 목업 기준: 현재 페이지 32px 원형(primary-600), 번호 간격 32px, 우측 이동 화살표 2개 */
export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="페이지" className="flex items-center justify-center gap-[10px]">
      {pages.map((page) => {
        const current = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            aria-current={current ? "page" : undefined}
            className={cn(
              "flex h-[32px] w-[32px] items-center justify-center rounded-full text-body",
              current
                ? "bg-primary-600 font-bold text-white"
                : "text-ink-soft hover:text-primary-600",
            )}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="다음 페이지"
        className="flex h-[32px] w-[22px] items-center justify-center text-ink-muted hover:text-primary-600"
      >
        <ChevronIcon />
      </button>
      <button
        type="button"
        aria-label="마지막 페이지"
        className="flex h-[32px] w-[22px] items-center justify-center text-ink-muted hover:text-primary-600"
      >
        <ChevronIcon double />
      </button>
    </nav>
  );
}

function ChevronIcon({ double = false }: { double?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={double ? "M6 5l7 7-7 7M13 5l7 7-7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
