import { Panel } from "@/components/admin/analytics/Panel";
import type { NamedMetric } from "@/types/analytics";
import { channelLabel, formatNumber } from "@/utils/analyticsFormat";

export function ChannelPanel({ channels }: { channels: NamedMetric[] }) {
  const total = channels.reduce((sum, channel) => sum + channel.sessions, 0);
  const max = Math.max(1, ...channels.map((channel) => channel.sessions));

  return (
    <Panel title="어디서 왔나요" caption="유입 채널별 방문 횟수">
      {channels.length === 0 ? (
        <p className="py-8 text-center text-body text-ink-muted">데이터가 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {channels.map((channel) => {
            const share = total ? (channel.sessions / total) * 100 : 0;
            return (
              <li
                key={channel.name}
                className="grid grid-cols-[80px_minmax(0,1fr)_104px] items-center gap-3"
                title={`${channelLabel(channel.name)} · 방문 ${formatNumber(channel.sessions)}회 · ${share.toFixed(1)}%`}
              >
                <span className="truncate text-caption font-bold text-ink-soft">{channelLabel(channel.name)}</span>
                <span className="h-2.5 overflow-hidden rounded-full bg-primary-50">
                  <span
                    className="block h-full rounded-full bg-primary-600"
                    style={{ width: `${(channel.sessions / max) * 100}%` }}
                  />
                </span>
                <span className="text-right text-caption whitespace-nowrap tabular-nums">
                  <span className="font-extrabold text-ink">{share.toFixed(0)}%</span>{" "}
                  <span className="text-ink-muted">{formatNumber(channel.sessions)}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
