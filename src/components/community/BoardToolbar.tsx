interface BoardToolbarProps {
  total: number;
  page: number;
}

/**
 * 목업(temp/소통의장.png) 기준 1920px 프레임 수치
 * - 컨트롤 높이 56px, 알약형 / 셀렉트 197px, 입력 303px, 검색 버튼 97px
 */
export function BoardToolbar({ total, page }: BoardToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-body text-ink-muted">
        Total {total}건 {page}페이지
      </p>

      <form role="search" className="flex flex-wrap items-center gap-2 sm:flex-nowrap lg:gap-0">
        <label className="sr-only" htmlFor="board-search-field">
          검색 조건
        </label>
        <div className="relative">
          <select
            id="board-search-field"
            defaultValue="title"
            className="h-[48px] w-full appearance-none rounded-full border border-line-soft bg-white pr-12 pl-6 text-body text-ink-soft sm:w-[197px] lg:h-[56px]"
          >
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
          <ChevronDownIcon />
        </div>

        <label className="sr-only" htmlFor="board-search-keyword">
          검색어
        </label>
        <input
          id="board-search-keyword"
          type="search"
          placeholder="검색어를 입력해 주세요"
          className="h-[48px] w-full rounded-full border border-line-soft px-6 text-body text-ink placeholder:text-ink-muted sm:w-[303px] lg:ml-[34px] lg:h-[56px]"
        />

        <button
          type="submit"
          className="h-[48px] shrink-0 rounded-full bg-primary-600 px-8 text-body font-bold text-white hover:bg-primary-700 lg:ml-[16px] lg:h-[56px] lg:w-[97px] lg:px-0"
        >
          검색
        </button>
      </form>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-6 -translate-y-1/2 text-ink-soft"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
