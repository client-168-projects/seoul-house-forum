import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/admin/analytics/AnalyticsDashboard";
import { getAnalyticsReport } from "@/lib/server/analytics/ga4";
import { verifyAdmin } from "@/lib/server/auth/dal";
import type { AnalyticsReport } from "@/types/analytics";

export const metadata: Metadata = { title: "방문 통계" };

export default async function AdminDashboardPage() {
  await verifyAdmin();

  let initialReport: AnalyticsReport | null = null;
  let initialError: string | null = null;
  try {
    initialReport = await getAnalyticsReport("28d");
  } catch (error) {
    console.error("[analytics]", error);
    initialError = "GA4 데이터를 불러오지 못했습니다. 속성 ID와 서비스 계정 권한을 확인해 주세요.";
  }

  return <AnalyticsDashboard initialReport={initialReport} initialError={initialError} />;
}
