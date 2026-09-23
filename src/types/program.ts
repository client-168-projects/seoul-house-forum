export interface Presenter {
  name: string;
  affiliation: string;
}

export type AgendaContent =
  | { kind: "text"; lines: string[] }
  | {
      kind: "session";
      badge: string;
      /** 발표 분류 (공공임대, 민간임대 등). 제목 앞에 괄호로 붙는다. */
      category?: string;
      title: string;
      presenter: Presenter;
    }
  | {
      kind: "panel";
      moderatorLabel: string;
      moderator: Presenter;
      discussionLabel: string;
      panelists: Presenter[];
    };

export interface AgendaSlot {
  timeRange: string;
  duration?: string;
  /** 여러 슬롯을 묶은 행에서만 쓰는 세부 구분명 */
  subLabel?: string;
  /** 시간과 구분명만 노출하는 순서(환영사, 축사 등)는 비워 둔다. */
  content?: AgendaContent;
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

/** 약력의 항목 묶음. 학력, 주요 경력, 주요 저서처럼 소제목 + 불릿 목록으로 노출한다. */
export interface SpeakerBioSection {
  heading: string;
  items: string[];
}

export interface Speaker {
  id: string;
  /** 인물 컷아웃이 준비되지 않은 연사는 비워 둔다. */
  photo?: SpeakerPhoto;
  name: string;
  /** 섭외만 끝나고 소속이 아직 확인되지 않은 인물은 비워 둔다. */
  affiliation?: string;
  /** 발표가 아닌 역할(사회, 토론). 이름 옆에 이름보다 작게 붙는다. */
  role?: string;
  sessionLabel?: string;
  sessionTitle?: string;
  /** 약력 도입 문단. 섭외만 끝나고 정보가 아직 없는 인물은 비워 둔다. */
  bioSummary?: string;
  bioSections: SpeakerBioSection[];
  /** 약력·사진을 받기 전까지 연사 소개에서 숨긴다. 받으면 이 값을 지우고 정보를 채운다. */
  hidden?: boolean;
}

/** 연사 소개 페이지의 구분(기조발제/주제발표/패널토론). groups로 사회·토론을 한 번 더 나눈다. */
export interface SpeakerSection {
  title: string;
  groups: { label?: string; speakers: Speaker[] }[];
}
