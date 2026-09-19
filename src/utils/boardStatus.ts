import type { BoardPostStatus } from "@/types/board";

export const BOARD_STATUS_LABELS: Record<BoardPostStatus, string> = {
  pending: "검수 대기",
  approved: "승인",
  rejected: "반려",
};

export function parseBoardStatus(value: unknown): BoardPostStatus | undefined {
  return value === "pending" || value === "approved" || value === "rejected" ? value : undefined;
}
