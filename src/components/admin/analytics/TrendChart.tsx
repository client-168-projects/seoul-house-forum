"use client";

import { useId, useRef, useState } from "react";
import type { DailyPoint } from "@/types/analytics";
import { formatNumber, formatShortDate, WEEKDAY_LABELS } from "@/utils/analyticsFormat";

interface TrendChartProps {
  daily: DailyPoint[];
  metric: keyof Omit<DailyPoint, "date">;
  metricLabel: string;
}

const WIDTH = 1000;
const HEIGHT = 240;
const PAD_TOP = 16;

/** 보기 좋은 눈금 최대값(1, 2, 2.5, 5 x 10^n) */
function niceMax(value: number) {
  if (value <= 0) return 10;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((candidate) => candidate * magnitude >= value) ?? 10;
  return step * magnitude;
}

export function TrendChart({ daily, metric, metricLabel }: TrendChartProps) {
  const gradientId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (daily.length === 0) {
    return <p className="px-9 py-20 text-center text-body text-white/60">해당 기간의 데이터가 없습니다.</p>;
  }

  const values = daily.map((point) => point[metric]);
  const max = niceMax(Math.max(...values));
  const stepX = daily.length > 1 ? WIDTH / (daily.length - 1) : 0;
  const x = (index: number) => index * stepX;
  const y = (value: number) => PAD_TOP + (HEIGHT - PAD_TOP) * (1 - value / max);

  const line = values.map((value, index) => `${index === 0 ? "M" : "L"}${x(index).toFixed(1)},${y(value).toFixed(1)}`).join("");
  const area = `${line}L${x(values.length - 1)},${HEIGHT}L0,${HEIGHT}Z`;
  const gridValues = [0.25, 0.5, 0.75, 1].map((ratio) => max * ratio);
  const labelEvery = Math.ceil(daily.length / 7);

  const handlePointer = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setHoverIndex(Math.round(ratio * (daily.length - 1)));
  };

  const hovered = hoverIndex === null ? null : daily[hoverIndex];
  const hoveredDay = hovered ? WEEKDAY_LABELS[new Date(`${hovered.date}T00:00:00Z`).getUTCDay()] : "";

  return (
    <figure className="px-6 pt-8 pb-4 lg:px-9">
      <figcaption className="sr-only">일별 {metricLabel} 추이</figcaption>
      <div className="relative pl-12">
        {gridValues.map((value) => (
          <span
            key={value}
            className="absolute left-0 -translate-y-1/2 text-[11px] text-white/40 tabular-nums"
            style={{ top: `${(y(value) / HEIGHT) * 100}%` }}
          >
            {formatNumber(value)}
          </span>
        ))}

        <div
          ref={containerRef}
          className="relative h-[220px] cursor-crosshair touch-none lg:h-[260px]"
          onPointerMove={(event) => handlePointer(event.clientX)}
          onPointerDown={(event) => handlePointer(event.clientX)}
          onPointerLeave={() => setHoverIndex(null)}
        >
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c8ea3d" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#c8ea3d" stopOpacity="0" />
              </linearGradient>
            </defs>
            {gridValues.map((value) => (
              <line key={value} x1="0" x2={WIDTH} y1={y(value)} y2={y(value)} stroke="white" strokeOpacity="0.08" vectorEffect="non-scaling-stroke" />
            ))}
            <line x1="0" x2={WIDTH} y1={HEIGHT} y2={HEIGHT} stroke="white" strokeOpacity="0.2" vectorEffect="non-scaling-stroke" />
            <path d={area} fill={`url(#${gradientId})`} />
            <path d={line} fill="none" stroke="#c8ea3d" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            {hoverIndex !== null && (
              <line x1={x(hoverIndex)} x2={x(hoverIndex)} y1={PAD_TOP} y2={HEIGHT} stroke="white" strokeOpacity="0.35" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
            )}
          </svg>

          {hovered && hoverIndex !== null && (
            <>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-2 ring-primary-950"
                style={{ left: `${(x(hoverIndex) / WIDTH) * 100}%`, top: `${(y(hovered[metric]) / HEIGHT) * 100}%` }}
              />
              <div
                role="status"
                className="pointer-events-none absolute top-0 z-10 w-max rounded-[12px] bg-white px-3 py-2 text-ink shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
                style={{
                  left: `${(x(hoverIndex) / WIDTH) * 100}%`,
                  transform: `translateX(${hoverIndex > daily.length / 2 ? "calc(-100% - 12px)" : "12px"})`,
                }}
              >
                <p className="text-[12px] text-ink-muted">
                  {hovered.date.replaceAll("-", ".")} ({hoveredDay})
                </p>
                <p className="text-body font-extrabold tabular-nums">
                  {metricLabel} {formatNumber(hovered[metric])}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="relative mt-2 h-4">
          {daily.map((point, index) =>
            index % labelEvery === 0 ? (
              <span
                key={point.date}
                className="absolute -translate-x-1/2 text-[11px] text-white/45 tabular-nums"
                style={{ left: `${(x(index) / WIDTH) * 100}%` }}
              >
                {formatShortDate(point.date)}
              </span>
            ) : null,
          )}
        </div>
      </div>
    </figure>
  );
}
