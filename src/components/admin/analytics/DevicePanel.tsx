import { Panel } from "@/components/admin/analytics/Panel";
import type { NamedMetric } from "@/types/analytics";
import { cityLabel, deviceLabel, formatNumber } from "@/utils/analyticsFormat";

/** 순위가 바뀌어도 같은 기기는 같은 색으로 보이도록 기기별로 색을 고정한다. */
const DEVICE_COLORS: Record<string, string> = {
  mobile: "var(--color-chart-1)",
  desktop: "var(--color-chart-2)",
  tablet: "var(--color-chart-3)",
};
const FALLBACK_COLOR = "var(--color-line)";

export function DevicePanel({ devices, cities }: { devices: NamedMetric[]; cities: NamedMetric[] }) {
  const totalUsers = devices.reduce((sum, device) => sum + device.users, 0);
  const topCityUsers = Math.max(1, ...cities.map((city) => city.users));

  return (
    <Panel title="누가 보고 있나요" caption="방문자 기준">
      {totalUsers > 0 && (
        <>
          <div className="flex h-4 gap-[2px] overflow-hidden rounded-full" role="img" aria-label="기기별 방문자 비율">
            {devices.map((device) => (
              <span
                key={device.name}
                className="h-full first:rounded-l-full last:rounded-r-full"
                title={`${deviceLabel(device.name)} ${((device.users / totalUsers) * 100).toFixed(1)}%`}
                style={{ width: `${(device.users / totalUsers) * 100}%`, backgroundColor: DEVICE_COLORS[device.name] ?? FALLBACK_COLOR }}
              />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {devices.map((device) => (
              <li key={device.name} className="flex items-center gap-2 text-caption">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: DEVICE_COLORS[device.name] ?? FALLBACK_COLOR }}
                />
                <span className="font-bold text-ink-soft">{deviceLabel(device.name)}</span>
                <span className="font-extrabold text-ink tabular-nums">{((device.users / totalUsers) * 100).toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <h3 className="mt-6 border-t border-primary-50 pt-5 text-caption font-extrabold text-ink-soft">지역</h3>
      {cities.length === 0 ? (
        <p className="py-6 text-center text-caption text-ink-muted">데이터가 없습니다.</p>
      ) : (
        <ol className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
          {cities.map((city) => (
            <li key={city.name} className="flex items-center gap-2 text-caption" title={`${cityLabel(city.name)} 방문자 ${formatNumber(city.users)}명`}>
              <span className="w-12 shrink-0 truncate font-bold text-ink-soft">{cityLabel(city.name)}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary-50">
                <span className="block h-full rounded-full bg-primary-400" style={{ width: `${(city.users / topCityUsers) * 100}%` }} />
              </span>
              <span className="w-12 text-right text-ink tabular-nums">{formatNumber(city.users)}</span>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}
