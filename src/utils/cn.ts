type ClassValue = string | number | null | undefined | false;

/** clsx 없이 조건부 클래스명을 합치는 최소 유틸리티 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
