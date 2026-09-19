import { Panel } from "@/components/admin/analytics/Panel";
import type { PageMetric } from "@/types/analytics";
import { formatNumber } from "@/utils/analyticsFormat";

/** 순위 + 막대를 행 배경에 깐 랭킹 표. 막대는 단일 색(크기)이고 값은 항상 글자로도 표시한다. */
export function PagesPanel({ pages }: { pages: PageMetric[] }) {
  const max = Math.max(1, ...pages.map((page) => page.views));

  return (
    <Panel title="많이 본 페이지" caption="페이지뷰 기준 상위 10">
      {pages.length === 0 ? (
        <p className="py-10 text-center text-body text-ink-muted">데이터가 없습니다.</p>
      ) : (
        <table className="w-full text-left">
          <thead className="sr-only">
            <tr>
              <th scope="col">순위</th>
              <th scope="col">페이지</th>
              <th scope="col">페이지뷰</th>
              <th scope="col">방문자</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page, index) => (
              <tr key={page.path} className="group" title={`${page.title} · 페이지뷰 ${formatNumber(page.views)} · 방문자 ${formatNumber(page.users)}`}>
                <td className="w-10 py-1.5 align-middle font-heading text-[18px] font-bold text-primary-300 tabular-nums group-first:text-primary-600">
                  {index + 1}
                </td>
                <td className="py-1.5">
                  <div className="relative overflow-hidden rounded-[10px] px-3 py-2">
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 rounded-[10px] bg-primary-50 transition-colors group-hover:bg-primary-100"
                      style={{ width: `${(page.views / max) * 100}%` }}
                    />
                    <p className="relative truncate text-caption font-bold text-ink">{page.title || page.path}</p>
                    <p className="relative truncate font-mono text-[11px] text-ink-muted">{page.path}</p>
                  </div>
                </td>
                <td className="w-20 py-1.5 pl-3 text-right text-body font-extrabold text-ink tabular-nums">
                  {formatNumber(page.views)}
                </td>
                <td className="hidden w-20 py-1.5 pl-3 text-right text-caption text-ink-muted tabular-nums sm:table-cell">
                  {formatNumber(page.users)}명
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  );
}
