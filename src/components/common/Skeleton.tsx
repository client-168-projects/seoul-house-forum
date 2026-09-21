import { cn } from "@/utils/cn";

/** 로딩 중 자리를 잡아 주는 회색 블록. 크기는 사용하는 쪽에서 클래스로 정한다. */
export function Skeleton({ className, tone = "light" }: { className?: string; tone?: "light" | "onPurple" }) {
  return (
    <span
      aria-hidden="true"
      className={cn("block animate-pulse rounded-[8px]", tone === "light" ? "bg-line-faint" : "bg-white/15", className)}
    />
  );
}
