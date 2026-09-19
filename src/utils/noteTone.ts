import type { OpinionNoteTone } from "@/types/board";

const TONES: OpinionNoteTone[] = ["pink", "yellow", "lavender", "green"];

/** 쪽지 색은 게시글 id로 고정한다. 4의 배수 주기라 그리드에서 같은 색이 한 열에 몰리지 않게 1칸씩 민다. */
export function getNoteTone(id: number): OpinionNoteTone {
  return TONES[(id + Math.floor(id / TONES.length)) % TONES.length];
}
