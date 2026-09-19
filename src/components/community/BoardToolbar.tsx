interface BoardToolbarProps {
  total: number;
  page: number;
  /** 검색 폼 제출 경로. GET 쿼리(field, q)로 제출되어 JS 없이도 동작한다. */
  action: string;
  query?: string;
  field?: "title" | "content";
}

/**
 * 목업(temp/소통의장.png) 기준 1920px 프레임 수치
 * - 컨트롤 높이 56px, 알약형 / 셀렉트 197px, 입력 303px, 검색 버튼 97px
 */
export function BoardToolbar({ total, page, action, query, field = "title" }: BoardToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <p className="text-body-lg text-ink-muted">
        Total {total}건 {page}페이지
      </p>

      <form role="search" action={action} method="get" className="grid grid-cols-[92px_minmax(0,1fr)_auto] items-center gap-2 sm:flex sm:flex-nowrap lg:gap-0">
        <label className="sr-only" htmlFor="board-search-field">
          검색 조건
        </label>
        <div className="relative">
          <select
            id="board-search-field"
            name="field"
            defaultValue={field}
            className="h-[48px] w-full appearance-none rounded-full border border-line-soft bg-white pr-9 pl-4 text-body-lg text-ink-soft sm:w-[160px] sm:pr-12 sm:pl-6 lg:h-[56px] lg:w-[197px]"
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
          name="q"
          type="search"
          maxLength={50}
          defaultValue={query}
          placeholder="검색어를 입력해 주세요"
          className="h-[48px] w-full min-w-0 rounded-full border border-line-soft px-4 text-body-lg text-ink placeholder:text-ink-muted sm:flex-1 sm:px-6 md:w-[260px] md:flex-none lg:ml-[34px] lg:h-[56px] lg:w-[303px]"
        />

        <button
          type="submit"
          className="h-[48px] shrink-0 rounded-full bg-primary-600 px-5 text-body-lg sm:px-8 font-bold text-white hover:bg-primary-700 lg:ml-[16px] lg:h-[56px] lg:w-[97px] lg:px-0"
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
      className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-ink-soft sm:right-6"
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
