import "server-only";
import { isoDate, rangeDates } from "@/lib/server/analytics/range";
import type { AnalyticsRangeKey, AnalyticsReport, AnalyticsTotals, DailyPoint } from "@/types/analytics";

/** GA4 자격 증명을 넣기 전 화면 확인용 데이터. 매번 같은 값이 나오도록 시드 기반으로 만든다. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1_103_515_245 + 12_345) % 2_147_483_648;
    return state / 2_147_483_648;
  };
}

function sumTotals(daily: DailyPoint[], scale = 1): AnalyticsTotals {
  const activeUsers = Math.round(daily.reduce((sum, day) => sum + day.activeUsers, 0) * 0.82 * scale);
  const sessions = Math.round(daily.reduce((sum, day) => sum + day.sessions, 0) * scale);
  return {
    activeUsers,
    newUsers: Math.round(activeUsers * 0.71),
    sessions,
    pageViews: Math.round(daily.reduce((sum, day) => sum + day.pageViews, 0) * scale),
    engagementSeconds: 94 * scale,
  };
}

export function buildSampleReport(key: AnalyticsRangeKey): AnalyticsReport {
  const random = seeded(20261007);
  const range = rangeDates(key);
  const end = new Date(`${range.endDate}T00:00:00Z`);

  const daily: DailyPoint[] = Array.from({ length: range.days }, (_, index) => {
    const date = new Date(end.getTime() - (range.days - 1 - index) * 86_400_000);
    const weekday = date.getUTCDay();
    const weekendDip = weekday === 0 || weekday === 6 ? 0.62 : 1;
    const growth = 1 + index / range.days;
    const activeUsers = Math.round((120 + random() * 60) * weekendDip * growth);
    const sessions = Math.round(activeUsers * (1.25 + random() * 0.2));
    return { date: isoDate(date), activeUsers, sessions, pageViews: Math.round(sessions * (2.4 + random() * 0.6)) };
  });

  const totals = sumTotals(daily);
  const channelShares: [string, number][] = [
    ["Organic Search", 0.38],
    ["Direct", 0.27],
    ["Organic Social", 0.16],
    ["Referral", 0.11],
    ["Email", 0.05],
    ["Paid Search", 0.03],
  ];
  const pageShares: [string, string, number][] = [
    ["/", "2026 서울주거포럼", 0.31],
    ["/register", "참가 등록", 0.18],
    ["/program", "프로그램", 0.14],
    ["/community/board", "자유게시판", 0.1],
    ["/program/speakers", "연사 소개", 0.09],
    ["/forum/location", "오시는 길", 0.07],
    ["/forum/intro", "포럼 소개", 0.05],
    ["/community/notice", "공지사항", 0.04],
  ];

  const heatmap = Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 24 }, (_, hour) => {
      const workHours = hour >= 9 && hour <= 18 ? 1 : hour >= 20 && hour <= 23 ? 0.6 : 0.15;
      const weekend = day === 0 || day === 6 ? 0.55 : 1;
      return Math.round((8 + random() * 14) * workHours * weekend * (range.days / 7));
    }),
  );

  return {
    isSample: true,
    range: { key, ...range },
    totals,
    previousTotals: sumTotals(daily, 0.84),
    daily,
    channels: channelShares.map(([name, share]) => ({
      name,
      sessions: Math.round(totals.sessions * share),
      users: Math.round(totals.activeUsers * share),
    })),
    pages: pageShares.map(([path, title, share]) => ({
      path,
      title,
      views: Math.round(totals.pageViews * share),
      users: Math.round(totals.activeUsers * share * 0.9),
    })),
    devices: [
      ["mobile", 0.64],
      ["desktop", 0.33],
      ["tablet", 0.03],
    ].map(([name, share]) => ({
      name: String(name),
      sessions: Math.round(totals.sessions * Number(share)),
      users: Math.round(totals.activeUsers * Number(share)),
    })),
    cities: [
      ["Seoul", 0.58],
      ["Incheon", 0.09],
      ["Suwon-si", 0.07],
      ["Seongnam-si", 0.06],
      ["Goyang-si", 0.05],
      ["Busan", 0.04],
    ].map(([name, share]) => ({
      name: String(name),
      sessions: Math.round(totals.sessions * Number(share)),
      users: Math.round(totals.activeUsers * Number(share)),
    })),
    heatmap,
  };
}
