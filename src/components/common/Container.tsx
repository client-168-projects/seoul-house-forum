import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** false면 좌우 안전 여백 없이 순수 1200px 중앙 정렬만 적용한다. */
  padded?: boolean;
}

export function Container({ children, className, padded = true }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1200px]",
        padded && "px-12 min-[1296px]:px-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
