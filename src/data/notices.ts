export interface Notice {
  id: number;
  title: string;
  date: string;
  /** 상세 페이지 본문. 빈 줄로 문단을 나눈다. */
  content: string;
}

/**
 * temp/소통의장.png 목업의 샘플 게시글을 그대로 반영한 placeholder 데이터.
 * 실제 게시판 연동(D1) 전까지 사용하는 임시 데이터다.
 */
const PLACEHOLDER_CONTENT = [
  "2026 서울주거포럼 현장 스케치를 공식 인스타그램에 공개했습니다.",
  "포럼 당일의 기조발제와 주제발표, 종합토론 현장을 담았습니다. 참여해 주신 분들의 모습과 주요 발표 장면을 함께 확인하실 수 있습니다.",
  "자세한 내용은 공식 인스타그램 계정에서 확인해 주세요. 문의 사항은 사무국으로 연락 주시기 바랍니다.",
].join("\n\n");

export const NOTICES: Notice[] = Array.from({ length: 10 }, (_, index) => ({
  id: 11 - index,
  title: "[인스타그램] 서울포럼 2026 현장 스케치",
  date: "2026.06.02",
  content: PLACEHOLDER_CONTENT,
}));

/** 자유게시판은 아직 등록된 글이 없어 빈 상태로 노출된다. */
export const BOARD_POSTS: Notice[] = [];

export function findNotice(id: number): Notice | undefined {
  return NOTICES.find((notice) => notice.id === id);
}

/**
 * 목록이 최신순이므로 배열의 뒤쪽이 더 이전 글이다.
 * 이전글 = 더 먼저 올라온 글, 다음글 = 더 나중에 올라온 글.
 */
export function getNoticeNeighbors(id: number) {
  const index = NOTICES.findIndex((notice) => notice.id === id);
  if (index === -1) return { previous: undefined, next: undefined };
  return { previous: NOTICES[index + 1], next: NOTICES[index - 1] };
}
