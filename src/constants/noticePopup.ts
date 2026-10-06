import type { PopupSize, PopupStatus } from "@/types/noticePopup";

export const HIDE_DURATION_OPTIONS = [1, 3, 7, 14, 30] as const;
export const DEFAULT_HIDE_DURATION_DAYS = 7;

/** 팝업 너비 프리셋. 높이는 이미지 원본 비율에 따라 자동으로 정해진다(크롭/여백 없음). */
export const POPUP_SIZE_OPTIONS: { value: PopupSize; label: string; widthPx: number }[] = [
  { value: "small", label: "작게", widthPx: 280 },
  { value: "medium", label: "보통", widthPx: 340 },
  { value: "large", label: "크게", widthPx: 400 },
];

export const POPUP_SIZE_WIDTH_CLASS: Record<PopupSize, string> = {
  small: "sm:w-70",
  medium: "sm:w-85",
  large: "sm:w-100",
};

export const POPUP_STATUS_LABEL: Record<PopupStatus, string> = {
  scheduled: "게시 예정",
  active: "게시 중",
  ended: "게시 종료",
  hidden: "숨김",
};

/** 업로드 이미지의 긴 변 최대 길이(px). 초과 시 브라우저에서 축소한 뒤 업로드한다. */
export const POPUP_IMAGE_MAX_DIMENSION = 1600;
export const POPUP_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const POPUP_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export const POPUP_TARGET_URL_MAX_LENGTH = 500;

/** 첫 화면이 그려진 뒤 팝업이 뜨도록 조금 늦춘다. */
export const POPUP_LANDING_DELAY_MS = 800;

export const POPUP_DISMISS_STORAGE_KEY = "shf-notice-popup-hidden";
