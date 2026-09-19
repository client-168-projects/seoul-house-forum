"use client";

import { useState } from "react";
import { TrendChart } from "@/components/admin/analytics/TrendChart";
import type { AnalyticsReport, DailyPoint } from "@/types/analytics";
import { changeRate, formatDuration, formatNumber } from "@/utils/analyticsFormat";
import { cn } from "@/utils/cn";

type MetricKey = keyof Omit<DailyPoint, "date">;

const METRICS: { key: MetricKey; label: string; total: (report: AnalyticsReport, previous?: boolean) => number }[] = [
  {
    key: "activeUsers",
    label: "방문자",
    total: (report, previous) => (previous ? report.previousTotals : report.totals).activeUsers,
  },
  { key: "sessions", label: "방문 횟수", total: (report, previous) => (previous ? report.previousTotals : report.totals).sessions },
  { key: "pageViews", label: "페이지뷰", total: (report, previous) => (previous ? report.previousTotals : report.totals).pageViews },
];

/**
 * 한 번에 한 지표만 그린다(이중 축 금지). 지표 탭이 범례 역할을 겸한다.
 * 상단 숫자는 카드가 아니라 선택된 지표의 헤드라인으로, 차트와 한 몸이다.
 */
export function TrendPanel({ report }: { report: AnalyticsReport }) {
  const [metric, setMetric] = useState<MetricKey>("activeUsers");
  const selected = METRICS.find((item) => item.key === metric) ?? METRICS[0];
  const { totals } = report;

  const ledger = [
    { label: "신규 방문자 비율", value: totals.activeUsers ? `${Math.round((totals.newUsers / totals.activeUsers) * 100)}%` : "-" },
    { label: "방문당 페이지뷰", value: totals.sessions ? (totals.pageViews / totals.sessions).toFixed(1) : "-" },
    { label: "방문당 평균 참여 시간", value: formatDuration(totals.engagementSeconds) },
  ];

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-primary-950 text-white">
      <div className="flex flex-col gap-6 px-6 pt-7 lg:flex-row lg:items-end lg:justify-between lg:px-9 lg:pt-9">
        <div>
          <p className="text-caption font-bold text-white/55">
            {report.range.startDate.replaceAll("-", ".")} – {report.range.endDate.replaceAll("-", ".")} · 지난 {report.range.days}일
          </p>
          <h2 className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-body font-bold text-white/80">{selected.label}</span>
            <span className="font-heading text-[44px] leading-none font-bold tabular-nums lg:text-[56px]">
              {formatNumber(selected.total(report))}
            </span>
            <ChangeChip rate={changeRate(selected.total(report), selected.total(report, true))} days={report.range.days} />
          </h2>
        </div>

        <div role="tablist" aria-label="추이 지표" className="flex gap-1 rounded-full bg-white/8 p-1">
          {METRICS.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={metric === item.key}
              onClick={() => setMetric(item.key)}
              className={cn(
                "flex h-10 items-center gap-2 rounded-full px-4 text-caption font-bold transition-colors",
                metric === item.key ? "bg-accent text-accent-ink" : "text-white/70 hover:text-white",
              )}
            >
              {item.label}
              <span className={cn("tabular-nums", metric === item.key ? "text-accent-ink/70" : "text-white/45")}>
                {formatNumber(item.total(report))}
              </span>
            </button>
          ))}
        </div>
      </div>

      <TrendChart daily={report.daily} metric={metric} metricLabel={selected.label} />

      <dl className="grid grid-cols-1 border-t border-white/10 sm:grid-cols-3">
        {ledger.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "flex items-baseline justify-between gap-3 px-6 py-4 lg:px-9",
              index > 0 && "border-t border-white/10 sm:border-t-0 sm:border-l",
            )}
          >
            <dt className="text-caption text-white/55">{item.label}</dt>
            <dd className="font-heading text-[20px] font-bold tabular-nums">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ChangeChip({ rate, days }: { rate: number | null; days: number }) {
  if (rate === null) return null;
  const up = rate >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-caption font-extrabold tabular-nums",
        up ? "bg-accent/15 text-accent" : "bg-[#ffb4c8]/15 text-[#ffb4c8]",
      )}
      title={`직전 ${days}일 대비`}
    >
      <span aria-hidden="true">{up ? "▲" : "▼"}</span>
      {Math.abs(rate).toFixed(1)}%<span className="sr-only">{up ? " 증가" : " 감소"}, 직전 {days}일 대비</span>
    </span>
  );
}
