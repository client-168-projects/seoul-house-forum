import "server-only";

/** LIKE 검색어의 와일드카드(%, _)와 이스케이프 문자를 문자 그대로 취급하게 만든다. */
export function toLikePattern(query: string): string {
  return `%${query.replace(/[\\%_]/g, (match) => `\\${match}`)}%`;
}

export const LIKE_ESCAPE_CLAUSE = "ESCAPE '\\'";
