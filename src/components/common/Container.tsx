import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/**
 * 좌우 안전 여백. 휴대폰 20px / 큰 휴대폰 32px / 태블릿 이상 48px, 1296px 이상(PC)은 1200px 중앙 정렬만.
 * PC 구간(md 이상)의 값은 기존과 같다.
 * 1296px 구간을 rem(81rem)으로 적는 이유: md(48rem)와 단위가 달라지면 Tailwind가 미디어쿼리 순서를 보장하지 못해 md:px-12가 이긴다.
 */
export const CONTAINER_GUTTER = "px-5 sm:px-8 md:px-12 min-[81rem]:px-0";

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
        padded && CONTAINER_GUTTER,
        className,
      )}
    >
      {children}
    </div>
  );
}
