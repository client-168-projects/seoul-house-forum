export type AnalyticsRangeKey = "7d" | "28d" | "90d";

export interface AnalyticsTotals {
  activeUsers: number;
  newUsers: number;
  sessions: number;
  pageViews: number;
  /** 세션당 평균 참여 시간(초) */
  engagementSeconds: number;
}

export interface DailyPoint {
  /** YYYY-MM-DD */
  date: string;
  activeUsers: number;
  sessions: number;
  pageViews: number;
}

export interface NamedMetric {
  name: string;
  sessions: number;
  users: number;
}

export interface PageMetric {
  path: string;
  title: string;
  views: number;
  users: number;
}

export interface AnalyticsReport {
  isSample: boolean;
  range: { key: AnalyticsRangeKey; startDate: string; endDate: string; days: number };
  totals: AnalyticsTotals;
  previousTotals: AnalyticsTotals;
  daily: DailyPoint[];
  channels: NamedMetric[];
  pages: PageMetric[];
  devices: NamedMetric[];
  cities: NamedMetric[];
  /** [요일 0=일 ~ 6=토][시 0~23] 활성 사용자 */
  heatmap: number[][];
}
