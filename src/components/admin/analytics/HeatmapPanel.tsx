import { Panel } from "@/components/admin/analytics/Panel";
import { formatNumber, WEEKDAY_LABELS } from "@/utils/analyticsFormat";

/** 월요일부터 보여 주는 편이 업무 패턴을 읽기 쉽다. GA4 dayOfWeek는 0=일요일. */
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

/** 단일 색(보라) 명도 단계로 크기를 표현하는 순차 색상 */
const STEPS = ["#f3eefd", "#e7defa", "#d5c9ec", "#b7a4d5", "#8971b1", "#6c4e9d", "#43217d", "#330c53"];

export function HeatmapPanel({ heatmap }: { heatmap: number[][] }) {
  const max = Math.max(1, ...heatmap.flat());
  let peak = { day: 0, hour: 0, value: -1 };
  heatmap.forEach((hours, day) =>
    hours.forEach((value, hour) => {
      if (value > peak.value) peak = { day, hour, value };
    }),
  );

  const colorFor = (value: number) => STEPS[Math.min(STEPS.length - 1, Math.floor((value / max) * STEPS.length))];

  return (
    <Panel
      title="언제 많이 들어오나요"
      caption={peak.value > 0 ? `가장 붐비는 시간 · ${WEEKDAY_LABELS[peak.day]}요일 ${peak.hour}시` : undefined}
    >
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[28px_repeat(24,minmax(0,1fr))] gap-[2px]">
            {DISPLAY_ORDER.map((day) => (
              <div key={day} className="contents">
                <span className="flex items-center text-[11px] font-bold text-ink-muted">{WEEKDAY_LABELS[day]}</span>
                {heatmap[day].map((value, hour) => (
                  <span
                    key={hour}
                    title={`${WEEKDAY_LABELS[day]}요일 ${hour}시 · 방문자 ${formatNumber(value)}명`}
                    className="aspect-square rounded-[4px] transition-transform hover:scale-125 hover:ring-2 hover:ring-accent"
                    style={{ backgroundColor: colorFor(value) }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-[28px_repeat(24,minmax(0,1fr))] gap-[2px] text-[10px] text-ink-muted tabular-nums">
            <span />
            {Array.from({ length: 24 }, (_, hour) => (
              <span key={hour} className="text-center">
                {hour % 3 === 0 ? hour : ""}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-[11px] text-ink-muted">
        적음
        <span className="flex gap-[2px]" aria-hidden="true">
          {STEPS.map((color) => (
            <span key={color} className="h-3 w-5 rounded-[3px]" style={{ backgroundColor: color }} />
          ))}
        </span>
        많음
      </div>
    </Panel>
  );
}
