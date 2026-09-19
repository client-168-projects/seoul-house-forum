import "server-only";
import type { AnalyticsRangeKey } from "@/types/analytics";

export const RANGE_DAYS: Record<AnalyticsRangeKey, number> = { "7d": 7, "28d": 28, "90d": 90 };

export function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** GA4 당일 데이터는 집계가 끝나지 않아 어제까지를 기준으로 삼는다. offsetDays만큼 과거로 민다. */
export function rangeDates(key: AnalyticsRangeKey, offsetDays = 0) {
  const days = RANGE_DAYS[key];
  const end = new Date(Date.now() - (offsetDays + 1) * 86_400_000);
  const start = new Date(end.getTime() - (days - 1) * 86_400_000);
  return { startDate: isoDate(start), endDate: isoDate(end), days };
}

export function parseRangeKey(value: unknown): AnalyticsRangeKey {
  return value === "7d" || value === "90d" ? value : "28d";
}
