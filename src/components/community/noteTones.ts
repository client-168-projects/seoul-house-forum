import type { OpinionNoteTone } from "@/types/board";

/** 쪽지 카드와 확대 모달이 같은 색 체계를 공유한다. */
export const NOTE_TONE_CLASSES: Record<OpinionNoteTone, { paper: string; ink: string; inner: string }> = {
  pink: {
    paper: "bg-note-pink border-note-pink-edge",
    ink: "text-note-pink-ink",
    inner: "bg-note-pink-soft border-note-pink-edge/60",
  },
  yellow: {
    paper: "bg-note-yellow border-note-yellow-edge",
    ink: "text-note-yellow-ink",
    inner: "bg-note-yellow-soft border-note-yellow-edge",
  },
  lavender: {
    paper: "bg-note-lavender border-note-lavender-edge",
    ink: "text-note-lavender-ink",
    inner: "bg-note-lavender-soft border-note-lavender-edge",
  },
  green: {
    paper: "bg-note-green border-note-green-edge",
    ink: "text-note-green-ink",
    inner: "bg-note-green-soft border-note-green-edge",
  },
};
