import "server-only";
import type { AnalyticsRangeKey, AnalyticsReport } from "@/types/analytics";

/** GA4 Data API는 하루 요청 수 제한이 있어, 같은 기간 조회는 10분간 재사용한다. */
const TTL_SECONDS = 600;
const CACHE_ORIGIN = "https://analytics.cache.local";

function cacheKey(propertyId: string, range: AnalyticsRangeKey) {
  return `${CACHE_ORIGIN}/${propertyId}/${range}`;
}

/** Workers에서만 Cache API를 쓸 수 있다. 로컬 node 런타임에서는 캐시 없이 동작한다. */
function getCache(): Cache | null {
  return typeof caches !== "undefined" && "default" in caches ? caches.default : null;
}

export async function readCachedReport(
  propertyId: string,
  range: AnalyticsRangeKey,
): Promise<AnalyticsReport | null> {
  const cache = getCache();
  if (!cache) return null;
  try {
    const hit = await cache.match(cacheKey(propertyId, range));
    return hit ? ((await hit.json()) as AnalyticsReport) : null;
  } catch {
    return null;
  }
}

export async function writeCachedReport(
  propertyId: string,
  range: AnalyticsRangeKey,
  report: AnalyticsReport,
): Promise<void> {
  const cache = getCache();
  if (!cache) return;
  try {
    await cache.put(
      cacheKey(propertyId, range),
      new Response(JSON.stringify(report), {
        headers: { "content-type": "application/json", "cache-control": `max-age=${TTL_SECONDS}` },
      }),
    );
  } catch {
    // 캐시 저장 실패는 조회 자체에 영향을 주지 않는다.
  }
}
