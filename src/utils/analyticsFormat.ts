const CHANNEL_LABELS: Record<string, string> = {
  "Organic Search": "검색 유입",
  Direct: "직접 방문",
  "Organic Social": "소셜 미디어",
  Referral: "외부 링크",
  Email: "이메일",
  "Paid Search": "검색 광고",
  "Paid Social": "소셜 광고",
  Display: "디스플레이 광고",
  "Organic Video": "동영상",
  Unassigned: "미분류",
};

const DEVICE_LABELS: Record<string, string> = {
  mobile: "모바일",
  desktop: "데스크톱",
  tablet: "태블릿",
  smarttv: "스마트TV",
};

const CITY_LABELS: Record<string, string> = {
  Seoul: "서울",
  Incheon: "인천",
  Busan: "부산",
  Daegu: "대구",
  Daejeon: "대전",
  Gwangju: "광주",
  Ulsan: "울산",
  "Suwon-si": "수원",
  "Seongnam-si": "성남",
  "Goyang-si": "고양",
  "Yongin-si": "용인",
  "Bucheon-si": "부천",
  "(not set)": "알 수 없음",
};

export const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export const channelLabel = (name: string) => CHANNEL_LABELS[name] ?? name;
export const deviceLabel = (name: string) => DEVICE_LABELS[name] ?? name;
export const cityLabel = (name: string) => CITY_LABELS[name] ?? name;

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("ko-KR");
}

export function formatDuration(seconds: number): string {
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  return minutes > 0 ? `${minutes}분 ${total % 60}초` : `${total}초`;
}

/** 이전 기간 대비 증감률(%). 이전 값이 0이면 비교하지 않는다. */
export function changeRate(current: number, previous: number): number | null {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

export function formatShortDate(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  return `${Number(month)}.${Number(day)}`;
}
