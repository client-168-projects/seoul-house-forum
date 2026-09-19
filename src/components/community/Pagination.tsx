import Link from "next/link";
import { cn } from "@/utils/cn";
import { getPageWindow } from "@/utils/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** 페이지 번호를 받아 이동할 URL을 만든다. 검색 조건 등 다른 쿼리를 유지하는 데 쓴다. */
  hrefForPage: (page: number) => string;
}

/** 목업 기준: 현재 페이지 32px 원형(primary-600), 번호 간격 10px, 양옆 이동 화살표 */
export function Pagination({ currentPage, totalPages, hrefForPage }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = getPageWindow(currentPage, totalPages);

  return (
    <nav aria-label="페이지" className="flex items-center justify-center gap-[10px]">
      <ArrowLink label="첫 페이지" href={hrefForPage(1)} disabled={currentPage === 1} icon="first" />
      <ArrowLink label="이전 페이지" href={hrefForPage(currentPage - 1)} disabled={currentPage === 1} icon="prev" />

      {pages.map((page) => {
        const current = page === currentPage;
        return (
          <Link
            key={page}
            href={hrefForPage(page)}
            aria-current={current ? "page" : undefined}
            className={cn(
              "flex h-[32px] w-[32px] items-center justify-center rounded-full text-body",
              current ? "bg-primary-600 font-bold text-white" : "text-ink-soft hover:text-primary-600",
            )}
          >
            {page}
          </Link>
        );
      })}

      <ArrowLink label="다음 페이지" href={hrefForPage(currentPage + 1)} disabled={currentPage === totalPages} icon="next" />
      <ArrowLink label="마지막 페이지" href={hrefForPage(totalPages)} disabled={currentPage === totalPages} icon="last" />
    </nav>
  );
}

const ARROW_PATHS = {
  first: "M18 5l-7 7 7 7M11 5l-7 7 7 7",
  prev: "M15 5l-7 7 7 7",
  next: "M9 5l7 7-7 7",
  last: "M6 5l7 7-7 7M13 5l7 7-7 7",
} as const;

function ArrowLink({
  label,
  href,
  disabled,
  icon,
}: {
  label: string;
  href: string;
  disabled: boolean;
  icon: keyof typeof ARROW_PATHS;
}) {
  const svg = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={ARROW_PATHS[icon]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const className = "flex h-[32px] w-[22px] items-center justify-center";

  if (disabled) {
    return (
      <span aria-hidden="true" className={cn(className, "text-line-soft")}>
        {svg}
      </span>
    );
  }
  return (
    <Link href={href} aria-label={label} className={cn(className, "text-ink-muted hover:text-primary-600")}>
      {svg}
    </Link>
  );
}
