interface AdminSearchFormProps {
  action: string;
  placeholder: string;
  defaultValue?: string;
  /** 검색 시 유지할 다른 쿼리(상태 탭 등) */
  hiddenFields?: Record<string, string | undefined>;
}

/** GET 폼이라 검색 조건이 URL에 남고, 새로고침/뒤로가기에도 유지된다. */
export function AdminSearchForm({ action, placeholder, defaultValue, hiddenFields = {} }: AdminSearchFormProps) {
  return (
    <form role="search" action={action} method="get" className="relative w-full sm:w-[320px]">
      {Object.entries(hiddenFields).map(([name, value]) =>
        value ? <input key={name} type="hidden" name={name} value={value} /> : null,
      )}
      <label htmlFor={`${action}-search`} className="sr-only">
        검색어
      </label>
      <input
        id={`${action}-search`}
        name="q"
        type="search"
        maxLength={50}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-primary-100 bg-white pr-12 pl-5 text-body text-ink placeholder:text-ink-muted focus:border-primary-400 focus:outline-2 focus:outline-primary-100"
      />
      <button
        type="submit"
        aria-label="검색"
        className="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2.2" />
          <path d="M16 16l4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}
