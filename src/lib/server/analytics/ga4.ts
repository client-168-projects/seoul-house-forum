import "server-only";
import { getEnv } from "@/lib/server/cloudflare";
import { base64ToBytes, bytesToBase64Url } from "@/lib/server/crypto";
import { rangeDates } from "@/lib/server/analytics/range";
import { buildSampleReport } from "@/lib/server/analytics/sample";
import type {
  AnalyticsRangeKey,
  AnalyticsReport,
  AnalyticsTotals,
  DailyPoint,
  NamedMetric,
  PageMetric,
} from "@/types/analytics";

const DATA_API = "https://analyticsdata.googleapis.com/v1beta";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

interface Ga4Row {
  dimensionValues?: { value: string }[];
  metricValues?: { value: string }[];
}
interface Ga4Report {
  rows?: Ga4Row[];
}

/** 서비스 계정 JWT(RS256)를 WebCrypto로 서명해 액세스 토큰으로 교환한다. */
async function getAccessToken(clientEmail: string, privateKeyPem: string): Promise<string> {
  const pem = privateKeyPem.replace(/\\n/g, "\n").replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const key = await crypto.subtle.importKey(
    "pkcs8",
    base64ToBytes(pem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const now = Math.floor(Date.now() / 1000);
  const encode = (value: object) => bytesToBase64Url(new TextEncoder().encode(JSON.stringify(value)));
  const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({
    iss: clientEmail,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${bytesToBase64Url(new Uint8Array(signature))}`,
    }),
  });
  if (!response.ok) throw new Error(`GA4 인증 실패 (${response.status})`);
  return ((await response.json()) as { access_token: string }).access_token;
}

const metricNumber = (row: Ga4Row, index: number) => Number(row.metricValues?.[index]?.value ?? 0);
const dimension = (row: Ga4Row, index: number) => row.dimensionValues?.[index]?.value ?? "";

function toTotals(report: Ga4Report | undefined): AnalyticsTotals {
  const row = report?.rows?.[0];
  if (!row) return { activeUsers: 0, newUsers: 0, sessions: 0, pageViews: 0, engagementSeconds: 0 };
  const sessions = metricNumber(row, 2);
  return {
    activeUsers: metricNumber(row, 0),
    newUsers: metricNumber(row, 1),
    sessions,
    pageViews: metricNumber(row, 3),
    engagementSeconds: sessions ? metricNumber(row, 4) / sessions : 0,
  };
}

const TOTAL_METRICS = ["activeUsers", "newUsers", "sessions", "screenPageViews", "userEngagementDuration"].map(
  (name) => ({ name }),
);

async function fetchLiveReport(key: AnalyticsRangeKey, credentials: { propertyId: string; clientEmail: string; privateKey: string }) {
  const token = await getAccessToken(credentials.clientEmail, credentials.privateKey);
  const current = rangeDates(key);
  const previous = rangeDates(key, current.days);
  const dateRanges = [{ startDate: current.startDate, endDate: current.endDate }];

  const call = async (method: string, body: object) => {
    const response = await fetch(`${DATA_API}/properties/${credentials.propertyId}:${method}`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`GA4 조회 실패 (${response.status})`);
    return response.json();
  };

  const [batch, extra] = (await Promise.all([
    call("batchRunReports", {
      requests: [
        {
          dateRanges,
          dimensions: [{ name: "date" }],
          metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
          orderBys: [{ dimension: { dimensionName: "date" } }],
        },
        {
          dateRanges,
          dimensions: [{ name: "sessionDefaultChannelGroup" }],
          metrics: [{ name: "sessions" }, { name: "activeUsers" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 8,
        },
        {
          dateRanges,
          dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
          metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 10,
        },
        {
          dateRanges,
          dimensions: [{ name: "deviceCategory" }],
          metrics: [{ name: "sessions" }, { name: "activeUsers" }],
        },
        {
          dateRanges,
          dimensions: [{ name: "dayOfWeek" }, { name: "hour" }],
          metrics: [{ name: "activeUsers" }],
        },
      ],
    }),
    call("batchRunReports", {
      requests: [
        { dateRanges, metrics: TOTAL_METRICS },
        { dateRanges: [{ startDate: previous.startDate, endDate: previous.endDate }], metrics: TOTAL_METRICS },
        {
          dateRanges,
          dimensions: [{ name: "city" }],
          metrics: [{ name: "sessions" }, { name: "activeUsers" }],
          orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
          limit: 8,
        },
      ],
    }),
  ])) as [{ reports: Ga4Report[] }, { reports: Ga4Report[] }];

  const [dailyReport, channelReport, pageReport, deviceReport, heatmapReport] = batch.reports;
  const [totalReport, previousReport, cityReport] = extra.reports;

  const named = (report: Ga4Report): NamedMetric[] =>
    (report.rows ?? []).map((row) => ({ name: dimension(row, 0) || "(not set)", sessions: metricNumber(row, 0), users: metricNumber(row, 1) }));

  const daily: DailyPoint[] = (dailyReport.rows ?? []).map((row) => {
    const raw = dimension(row, 0);
    return {
      date: `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`,
      activeUsers: metricNumber(row, 0),
      sessions: metricNumber(row, 1),
      pageViews: metricNumber(row, 2),
    };
  });

  const pages: PageMetric[] = (pageReport.rows ?? []).map((row) => ({
    path: dimension(row, 0),
    title: dimension(row, 1),
    views: metricNumber(row, 0),
    users: metricNumber(row, 1),
  }));

  const heatmap = Array.from({ length: 7 }, () => Array<number>(24).fill(0));
  for (const row of heatmapReport.rows ?? []) {
    heatmap[Number(dimension(row, 0))][Number(dimension(row, 1))] = metricNumber(row, 0);
  }

  return {
    isSample: false,
    range: { key, ...current },
    totals: toTotals(totalReport),
    previousTotals: toTotals(previousReport),
    daily,
    channels: named(channelReport),
    pages,
    devices: named(deviceReport),
    cities: named(cityReport),
    heatmap,
  } satisfies AnalyticsReport;
}

/** 자격 증명이 없으면 샘플 데이터를 돌려준다(isSample=true). API 오류는 호출부에 그대로 전달한다. */
export async function getAnalyticsReport(key: AnalyticsRangeKey): Promise<AnalyticsReport> {
  const env = getEnv();
  const propertyId = String(env.GA4_PROPERTY_ID ?? "").trim();
  const clientEmail = env.GA4_CLIENT_EMAIL?.trim();
  const privateKey = env.GA4_PRIVATE_KEY?.trim();

  if (!propertyId || !clientEmail || !privateKey) return buildSampleReport(key);
  return fetchLiveReport(key, { propertyId, clientEmail, privateKey });
}

