import { NextResponse, type NextRequest } from "next/server";
import { getAnalyticsReport } from "@/lib/server/analytics/ga4";
import { parseRangeKey } from "@/lib/server/analytics/range";
import { guardAdminApi } from "@/lib/server/auth/dal";
import { jsonError } from "@/lib/server/http";

export async function GET(request: NextRequest) {
  const guard = await guardAdminApi(request);
  if (guard.error) return guard.error;

  try {
    const report = await getAnalyticsReport(parseRangeKey(request.nextUrl.searchParams.get("range")));
    return NextResponse.json(report);
  } catch (error) {
    console.error("[analytics]", error);
    return jsonError("GA4 데이터를 불러오지 못했습니다. 속성 ID와 서비스 계정 권한을 확인해 주세요.", 502);
  }
}
