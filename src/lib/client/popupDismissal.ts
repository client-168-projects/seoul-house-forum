import { POPUP_DISMISS_STORAGE_KEY } from "@/constants/noticePopup";

/** 팝업 ID별 "다시 보지 않기" 만료 시각(ISO). 브라우저에만 저장한다. */
type HiddenMap = Record<string, string>;

const DAY_MS = 24 * 60 * 60 * 1000;

function readMap(): HiddenMap {
  try {
    const raw = window.localStorage.getItem(POPUP_DISMISS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HiddenMap) : {};
  } catch {
    return {};
  }
}

function writeMap(map: HiddenMap) {
  try {
    window.localStorage.setItem(POPUP_DISMISS_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // 저장소를 쓸 수 없는 환경(프라이빗 모드 등)에서는 팝업이 매번 다시 노출될 뿐이다.
  }
}

export function isPopupHidden(id: number): boolean {
  const until = readMap()[`popup-${id}`];
  return until ? new Date(until).getTime() > Date.now() : false;
}

export function hidePopupForDays(id: number, days: number) {
  const map = readMap();
  const now = Date.now();
  // 만료된 기록은 저장할 때 함께 정리한다.
  for (const [key, until] of Object.entries(map)) {
    if (new Date(until).getTime() <= now) delete map[key];
  }
  map[`popup-${id}`] = new Date(now + days * DAY_MS).toISOString();
  writeMap(map);
}
