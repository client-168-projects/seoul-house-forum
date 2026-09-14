import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** false면 좌우 안전 여백 없이 순수 1200px 중앙 정렬만 적용한다. */
  padded?: boolean;
}

/** 목업 기준 컨테이너: 1920px 프레임에서 1200px 중앙 정렬(좌우 여백 360px). */
export function Container({ children, className, padded = true }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1200px]",
        padded && "px-5 sm:px-8 xl:px-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
