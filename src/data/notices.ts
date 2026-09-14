export interface Notice {
  id: number;
  title: string;
  date: string;
}

/**
 * temp/소통의장.png 목업의 샘플 게시글을 그대로 반영한 placeholder 데이터.
 * 실제 게시판 연동(D1) 전까지 사용하는 임시 데이터다.
 */
export const NOTICES: Notice[] = Array.from({ length: 10 }, (_, index) => ({
  id: 11 - index,
  title: "[인스타그램] 서울포럼 2026 현장 스케치",
  date: "2026.06.02",
}));

/** 자유게시판은 아직 등록된 글이 없어 빈 상태로 노출된다. */
export const BOARD_POSTS: Notice[] = [];
