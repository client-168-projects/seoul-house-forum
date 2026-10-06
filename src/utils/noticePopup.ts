import { HIDE_DURATION_OPTIONS, POPUP_SIZE_OPTIONS, POPUP_TARGET_URL_MAX_LENGTH } from "@/constants/noticePopup";
import type { NoticePopup, NoticePopupInput, PopupStatus } from "@/types/noticePopup";

/*
 * 관리자 다이얼로그(클라이언트)와 API(서버)가 함께 쓰는 순수 함수.
 * 서버 전용 의존성을 여기에 섞으면 안 된다.
 */

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_IMAGE_PIXELS = 20000;

/**
 * 한국(UTC+9 고정, DST 없음) 기준 오늘 날짜 "YYYY-MM-DD".
 * toISOString()만 쓰면 자정~오전 9시(KST)에 하루 전날로 계산되므로 항상 이 함수를 쓴다.
 */
export function todayInKst(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function getPopupStatus(
  popup: Pick<NoticePopup, "startDate" | "endDate" | "isHidden">,
  today: string = todayInKst(),
): PopupStatus {
  if (popup.isHidden) return "hidden";
  if (today < popup.startDate) return "scheduled";
  if (today > popup.endDate) return "ended";
  return "active";
}

function isValidPixelSize(value: number): boolean {
  return Number.isInteger(value) && value > 0 && value <= MAX_IMAGE_PIXELS;
}

export function validateNoticePopupInput(input: NoticePopupInput): string | null {
  if (!input.imageKey) return "팝업 이미지를 업로드해 주세요.";
  if (!isValidPixelSize(input.imageWidth) || !isValidPixelSize(input.imageHeight)) {
    return "이미지 크기 정보를 읽지 못했습니다. 이미지를 다시 업로드해 주세요.";
  }
  if (!POPUP_SIZE_OPTIONS.some((option) => option.value === input.size)) return "팝업 크기를 선택해 주세요.";
  if (!DATE_PATTERN.test(input.startDate) || !DATE_PATTERN.test(input.endDate)) {
    return "게시 시작일과 종료일을 모두 선택해 주세요.";
  }
  if (input.startDate > input.endDate) return "게시 종료일은 시작일과 같거나 그 이후여야 합니다.";
  if (!(HIDE_DURATION_OPTIONS as readonly number[]).includes(input.hideDurationDays)) {
    return "'다시 보지 않기' 기간을 선택해 주세요.";
  }
  if (input.targetUrl) {
    if (input.targetUrl.length > POPUP_TARGET_URL_MAX_LENGTH) {
      return `이동 URL은 ${POPUP_TARGET_URL_MAX_LENGTH}자 이내로 입력해 주세요.`;
    }
    try {
      const url = new URL(input.targetUrl);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return "이동 URL은 http:// 또는 https://로 시작해야 합니다.";
      }
    } catch {
      return "이동 URL 형식이 올바르지 않습니다. https://를 포함한 전체 주소를 입력해 주세요.";
    }
  }
  return null;
}
