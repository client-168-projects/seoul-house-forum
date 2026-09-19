"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ChannelPanel } from "@/components/admin/analytics/ChannelPanel";
import { DevicePanel } from "@/components/admin/analytics/DevicePanel";
import { HeatmapPanel } from "@/components/admin/analytics/HeatmapPanel";
import { PagesPanel } from "@/components/admin/analytics/PagesPanel";
import { TrendPanel } from "@/components/admin/analytics/TrendPanel";
import { exportAnalyticsWorkbook } from "@/components/admin/analytics/exportWorkbook";
import { adminFetch } from "@/lib/client/adminApi";
import type { AnalyticsRangeKey, AnalyticsReport } from "@/types/analytics";
import { cn } from "@/utils/cn";

interface AnalyticsDashboardProps {
  initialReport: AnalyticsReport | null;
  initialError: string | null;
}

const RANGES: { key: AnalyticsRangeKey; label: string }[] = [
  { key: "7d", label: "7일" },
  { key: "28d", label: "28일" },
  { key: "90d", label: "90일" },
];

export function AnalyticsDashboard({ initialReport, initialError }: AnalyticsDashboardProps) {
  const [report, setReport] = useState(initialReport);
  const [range, setRange] = useState<AnalyticsRangeKey>(initialReport?.range.key ?? "28d");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(initialError);

  const changeRange = async (next: AnalyticsRangeKey) => {
    if (next === range || loading) return;
    setRange(next);
    setLoading(true);
    setError(null);
    try {
      setReport(await adminFetch<AnalyticsReport>(`/api/admin/analytics?range=${next}`));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "통계를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const download = async () => {
    if (!report) return;
    setExporting(true);
    try {
      await exportAnalyticsWorkbook(report);
    } catch {
      setError("엑셀 파일을 만들지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      <AdminPageHeader
        eyebrow="GOOGLE ANALYTICS 4"
        title="방문 통계"
        description={
          report?.isSample ? (
            <span className="inline-flex items-center gap-2">
              <span className="rounded-full bg-note-yellow px-2 py-0.5 text-[12px] font-extrabold text-note-yellow-ink ring-1 ring-note-yellow-edge">
                샘플 데이터
              </span>
              GA4 서비스 계정을 연결하면 실제 데이터로 바뀝니다.
            </span>
          ) : (
            "어제까지 집계된 데이터 기준입니다."
          )
        }
        actions={
          <>
            <div role="radiogroup" aria-label="조회 기간" className="flex rounded-full bg-white p-1 ring-1 ring-primary-100">
              {RANGES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  role="radio"
                  aria-checked={range === item.key}
                  onClick={() => changeRange(item.key)}
                  className={cn(
                    "h-9 rounded-full px-4 text-caption font-bold transition-colors",
                    range === item.key ? "bg-primary-950 text-white" : "text-ink-soft hover:bg-primary-50",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={download}
              disabled={!report || exporting || loading}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-caption font-extrabold text-accent-ink hover:brightness-95 disabled:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {exporting ? "만드는 중..." : "엑셀 다운로드"}
            </button>
          </>
        }
      />

      {error && (
        <p role="alert" className="mt-6 rounded-[14px] bg-note-pink px-5 py-4 text-body font-bold text-note-pink-ink">
          {error}
        </p>
      )}

      {report && (
        <div className={cn("mt-8 flex flex-col gap-6 transition-opacity", loading && "pointer-events-none opacity-50")} aria-busy={loading}>
          <TrendPanel report={report} />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <PagesPanel pages={report.pages} />
            <div className="flex flex-col gap-6">
              <ChannelPanel channels={report.channels} />
              <DevicePanel devices={report.devices} cities={report.cities} />
            </div>
          </div>
          <HeatmapPanel heatmap={report.heatmap} />
        </div>
      )}
    </div>
  );
}
