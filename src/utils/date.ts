const TIME_ZONE = "Asia/Seoul";

function parts(iso: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const map = Object.fromEntries(formatter.formatToParts(new Date(iso)).map((part) => [part.type, part.value]));
  return map as Record<"year" | "month" | "day" | "hour" | "minute", string>;
}

/** 2026.06.02 */
export function formatDate(iso: string): string {
  const { year, month, day } = parts(iso);
  return `${year}.${month}.${day}`;
}

/** 2026.06.02 14:05 */
export function formatDateTime(iso: string): string {
  const { hour, minute } = parts(iso);
  return `${formatDate(iso)} ${hour}:${minute}`;
}

/** 방금 전 / 5분전 / 3시간전 / 2일전 / 이후는 날짜 */
export function formatRelative(iso: string, now = Date.now()): string {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일전`;
  return formatDate(iso);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
