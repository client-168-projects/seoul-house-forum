import type { BoardPostStatus } from "@/types/board";
import { BOARD_STATUS_LABELS } from "@/utils/boardStatus";
import { cn } from "@/utils/cn";

const STATUS_CLASSES: Record<BoardPostStatus, string> = {
  pending: "bg-note-yellow text-note-yellow-ink ring-note-yellow-edge",
  approved: "bg-note-green text-note-green-ink ring-note-green-edge",
  rejected: "bg-note-pink text-note-pink-ink ring-note-pink-edge/40",
};

export function BoardStatusBadge({ status }: { status: BoardPostStatus }) {
  return (
    <span className={cn("inline-flex h-7 items-center rounded-full px-2.5 text-[12px] font-bold ring-1", STATUS_CLASSES[status])}>
      {BOARD_STATUS_LABELS[status]}
    </span>
  );
}
