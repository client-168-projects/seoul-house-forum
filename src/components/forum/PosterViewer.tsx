"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const POSTER = {
  src: "/images/forum/poster.webp",
  width: 1400,
  height: 1980,
};

interface PosterViewerProps {
  alt: string;
}

/**
 * 행사 개요의 포스터. 클릭하면 뷰포트에 맞춰 확대해 보여준다.
 * 모바일에서는 좌우 여백을 줄이고 배경 스크롤을 잠근다.
 */
export function PosterViewer({ alt }: PosterViewerProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", handleKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [expanded]);

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        aria-label={`${alt} 크게 보기`}
        className="block w-full max-w-[274px] cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
      >
        <Image
          src={POSTER.src}
          alt={alt}
          width={POSTER.width}
          height={POSTER.height}
          sizes="274px"
          className="h-auto w-full"
        />
      </button>

      {expanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setExpanded(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 sm:p-8"
        >
          <Image
            src={POSTER.src}
            alt={alt}
            width={POSTER.width}
            height={POSTER.height}
            priority
            className="max-h-full w-auto max-w-full cursor-zoom-out object-contain"
          />

          <button
            type="button"
            onClick={() => setExpanded(false)}
            aria-label="닫기"
            className="absolute top-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 sm:top-4 sm:right-4"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
