export interface Presenter {
  name: string;
  affiliation?: string;
}

export interface AgendaEntry {
  label: string;
  /** 발표 제목 (있는 행만 큰 보라색 타이틀로 노출된다) */
  title?: string;
  presenters?: Presenter[];
  /** 발표자 대신 설명 한 줄만 들어가는 행 */
  note?: string;
}

/** 같은 시간대를 공유하는 세션 묶음. 목업에서 시간은 그룹당 한 번만 표기된다. */
export interface AgendaGroup {
  start: string;
  end: string;
  entries: AgendaEntry[];
}

export interface Speaker {
  id: string;
  name: string;
  affiliation: string;
  sessionLabel: string;
  sessionTitle: string;
  bio: string;
  abstract: string;
}
