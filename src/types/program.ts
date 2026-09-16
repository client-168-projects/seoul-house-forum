export interface Presenter {
  name: string;
  affiliation: string;
  /** 발표 분류 (공공임대, 민간임대 등) */
  category?: string;
}

export type AgendaContent =
  | { kind: "text"; lines: string[] }
  | { kind: "session"; badge: string; title: string; presenter: Presenter }
  | {
      kind: "panel";
      moderatorRole: string;
      moderator: string;
      discussionLabel: string;
      discussionSummary: string;
      panelists: Presenter[];
    };

export interface AgendaSlot {
  timeRange: string;
  duration?: string;
  /** 여러 슬롯을 묶은 행에서만 쓰는 세부 구분명 */
  subLabel?: string;
  content: AgendaContent;
}

export interface AgendaRow {
  label: string;
  highlighted: boolean;
  slots: AgendaSlot[];
}

/** 배경이 제거된 인물 컷아웃. 카드/모달에서 하단 정렬로 배치한다. */
export interface SpeakerPhoto {
  src: string;
  width: number;
  height: number;
}

export interface Speaker {
  id: string;
  photo: SpeakerPhoto;
  name: string;
  affiliation: string;
  sessionLabel: string;
  sessionTitle: string;
  bio: string;
  abstract: string;
}
