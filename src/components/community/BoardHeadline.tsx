import type { ReactNode } from "react";

/** 폼 옆 좁은 열(xl 이상)과 모바일은 4줄, 가로가 넉넉한 태블릿 단독 배치는 3줄로 끊는다. */
export function BoardHeadline() {
  return (
    <h2 className="font-heading text-section-title leading-[1.3] font-medium break-keep">
      여러분이 보시는
      <br className="sm:hidden xl:inline" /> <Highlight>서울 전월세 시장</Highlight>
      <br />
      불안정의 원인과,
      <br className="sm:hidden xl:inline" /> 그 해법을
      <br className="hidden sm:inline xl:hidden" /> 들려주세요
    </h2>
  );
}

function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="relative mb-[0.22em] inline-block text-[1.22em] font-bold text-primary-50">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 300 16"
        preserveAspectRatio="none"
        className="absolute -bottom-[0.2em] -left-[0.3em] h-[0.4em] w-[calc(100%+0.5em)] text-brush"
      >
        <path
          d="M4 6.5C80 3.5 180 2 294 3.2c3.5 0 4 5.2.4 5.6C190 10.5 90 12.6 7 15c-4.5.2-7-7.8-3-8.5Z"
          fill="currentColor"
        />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="absolute -top-[0.4em] -right-[0.85em] h-[0.72em] w-[0.72em] text-brush"
      >
        <path
          d="M5 11 8.5 3M12 14.5l8-6.5M13.5 20.5l8.5-1.5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
