export type PopupSize = "small" | "medium" | "large";

export type PopupStatus = "scheduled" | "active" | "ended" | "hidden";

/** 공개 사이트 팝업 카드가 그리는 데 필요한 값만 담는다. 공개 API 응답 형태이기도 하다. */
export interface PublicNoticePopup {
  id: number;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  targetUrl: string | null;
  hideDurationDays: number;
  size: PopupSize;
}

export interface NoticePopup extends PublicNoticePopup {
  imageKey: string;
  startDate: string;
  endDate: string;
  priority: number;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoticePopupInput {
  imageKey: string;
  imageWidth: number;
  imageHeight: number;
  targetUrl: string;
  hideDurationDays: number;
  startDate: string;
  endDate: string;
  isHidden: boolean;
  size: PopupSize;
}
