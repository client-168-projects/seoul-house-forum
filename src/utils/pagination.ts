/** 현재 페이지를 가운데에 두고 최대 size개의 페이지 번호를 돌려준다. */
export function getPageWindow(currentPage: number, totalPages: number, size = 5): number[] {
  const half = Math.floor(size / 2);
  const start = Math.max(1, Math.min(currentPage - half, totalPages - size + 1));
  const end = Math.min(totalPages, start + size - 1);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

/** 기존 쿼리를 유지한 채 page만 바꾼 URL. page=1이면 파라미터를 생략한다. */
export function withPageParam(pathname: string, params: Record<string, string | undefined>, page: number): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `${pathname}?${query}` : pathname;
}
