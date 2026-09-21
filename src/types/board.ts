export type OpinionNoteTone = "pink" | "yellow" | "lavender" | "green";

export type BoardPostStatus = "pending" | "approved" | "rejected";

/** 공개 목록에 노출되는 승인된 의견. IP 등 수집 정보는 포함하지 않는다. */
export interface OpinionPost {
  id: number;
  content: string;
  district: string;
  /** 마스킹된 이름(예: 김ㅇㅇ). 원문 이름은 공개 응답에 절대 포함하지 않는다. */
  author: string;
  createdAt: string;
}

export interface AdminBoardPost extends OpinionPost {
  /** 관리자 전용 복호화 이름. 복호화할 수 없는 과거 데이터는 null */
  authorFullName: string | null;
  status: BoardPostStatus;
  ip: string | null;
  userAgent: string | null;
  reviewedAt: string | null;
  /** 반려 사유 등 운영자 메모 */
  reviewNote: string | null;
}
