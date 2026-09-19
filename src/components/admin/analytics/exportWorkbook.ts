import type { AnalyticsReport } from "@/types/analytics";
import { channelLabel, cityLabel, deviceLabel, WEEKDAY_LABELS } from "@/utils/analyticsFormat";

type Cell = { value: string | number; fontWeight?: "bold"; type?: NumberConstructor | StringConstructor } | null;

const header = (...labels: string[]): Cell[] => labels.map((value) => ({ value, fontWeight: "bold" }));
const num = (value: number): Cell => ({ value: Math.round(value * 100) / 100, type: Number });
const text = (value: string): Cell => ({ value, type: String });

/** 대시보드에 보이는 모든 항목을 시트별로 나눠 .xlsx로 저장한다. 라이브러리는 이 시점에만 불러온다. */
export async function exportAnalyticsWorkbook(report: AnalyticsReport) {
  const { default: writeXlsxFile } = await import("write-excel-file/browser");
  const { totals, previousTotals, range } = report;

  const summary: Cell[][] = [
    header("항목", "이번 기간", "직전 기간"),
    [text("기간"), text(`${range.startDate} ~ ${range.endDate}`), text(`${range.days}일`)],
    [text("방문자"), num(totals.activeUsers), num(previousTotals.activeUsers)],
    [text("신규 방문자"), num(totals.newUsers), num(previousTotals.newUsers)],
    [text("방문 횟수"), num(totals.sessions), num(previousTotals.sessions)],
    [text("페이지뷰"), num(totals.pageViews), num(previousTotals.pageViews)],
    [text("방문당 평균 참여 시간(초)"), num(totals.engagementSeconds), num(previousTotals.engagementSeconds)],
    [text("데이터 출처"), text(report.isSample ? "샘플 데이터" : "GA4 Data API"), null],
  ];

  const sheets = [
    { sheet: "요약", data: summary, columns: [{ width: 26 }, { width: 24 }, { width: 14 }] },
    {
      sheet: "일별 추이",
      data: [header("날짜", "방문자", "방문 횟수", "페이지뷰"), ...report.daily.map((d) => [text(d.date), num(d.activeUsers), num(d.sessions), num(d.pageViews)])],
      columns: [{ width: 14 }, { width: 12 }, { width: 12 }, { width: 12 }],
    },
    {
      sheet: "인기 페이지",
      data: [header("순위", "페이지 제목", "경로", "페이지뷰", "방문자"), ...report.pages.map((p, i) => [num(i + 1), text(p.title), text(p.path), num(p.views), num(p.users)])],
      columns: [{ width: 6 }, { width: 30 }, { width: 30 }, { width: 12 }, { width: 12 }],
    },
    {
      sheet: "유입 채널",
      data: [header("채널", "원본 이름", "방문 횟수", "방문자"), ...report.channels.map((c) => [text(channelLabel(c.name)), text(c.name), num(c.sessions), num(c.users)])],
      columns: [{ width: 16 }, { width: 20 }, { width: 12 }, { width: 12 }],
    },
    {
      sheet: "기기",
      data: [header("기기", "방문 횟수", "방문자"), ...report.devices.map((d) => [text(deviceLabel(d.name)), num(d.sessions), num(d.users)])],
      columns: [{ width: 12 }, { width: 12 }, { width: 12 }],
    },
    {
      sheet: "지역",
      data: [header("지역", "방문 횟수", "방문자"), ...report.cities.map((c) => [text(cityLabel(c.name)), num(c.sessions), num(c.users)])],
      columns: [{ width: 14 }, { width: 12 }, { width: 12 }],
    },
    {
      sheet: "요일-시간",
      data: [
        header("요일", ...Array.from({ length: 24 }, (_, hour) => `${hour}시`)),
        ...report.heatmap.map((hours, day) => [text(WEEKDAY_LABELS[day]), ...hours.map(num)]),
      ],
      columns: [{ width: 6 }, ...Array.from({ length: 24 }, () => ({ width: 6 }))],
    },
  ];

  await writeXlsxFile(
    sheets.map((sheet) => ({ ...sheet, stickyRowsCount: 1 })),
  ).toFile(`서울주거포럼_방문통계_${range.startDate}_${range.endDate}.xlsx`);
}
