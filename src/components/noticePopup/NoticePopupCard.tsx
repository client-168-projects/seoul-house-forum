"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { POPUP_SIZE_WIDTH_CLASS } from "@/constants/noticePopup";
import type { PublicNoticePopup } from "@/types/noticePopup";
import { cn } from "@/utils/cn";

const ANIMATION_MS = 200;

interface NoticePopupCardProps {
  popup: PublicNoticePopup;
  /** 닫힘 애니메이션이 끝난 뒤 호출된다. "다시 보지 않기"를 체크했으면 그 일수를 넘긴다. */
  onClose: (hideDays: number | null) => void;
  /** false면 이동 링크와 "다시 보지 않기" 체크가 꺼진다. 관리자 미리보기 전용. */
  interactive?: boolean;
}

/** 위치(fixed 좌표)는 부모 스택 컨테이너가 정하고, 이 컴포넌트는 카드 한 장만 그린다. */
export function NoticePopupCard({ popup, onClose, interactive = true }: NoticePopupCardProps) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const dontShowAgainRef = useRef(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
    dontShowAgainRef.current = dontShowAgain;
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const close = () => {
    setClosing(true);
    window.setTimeout(() => {
      onCloseRef.current(dontShowAgainRef.current ? popup.hideDurationDays : null);
    }, ANIMATION_MS);
  };
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // 원본 비율 그대로 카드 너비에 맞추므로 잘리거나 여백이 생기지 않는다.
  const image = (
    <Image
      src={popup.imageUrl}
      alt="공지 팝업"
      width={popup.imageWidth}
      height={popup.imageHeight}
      sizes="(min-width: 640px) 400px, calc(100vw - 32px)"
      className="block h-auto w-full bg-white"
    />
  );

  return (
    <div
      role="dialog"
      aria-label="공지 팝업"
      aria-modal="false"
      className={cn(
        "relative flex w-full shrink-0 flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_20px_56px_rgba(51,12,83,0.28)] ring-1 ring-primary-100 transition-all duration-200 ease-out motion-reduce:transition-opacity",
        POPUP_SIZE_WIDTH_CLASS[popup.size],
        visible && !closing ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 motion-reduce:translate-y-0",
      )}
    >
      <button
        type="button"
        aria-label="팝업 닫기"
        onClick={close}
        className="absolute top-2 right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-ink shadow-sm transition-colors hover:bg-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {popup.targetUrl && interactive ? (
        <a href={popup.targetUrl} target="_blank" rel="noopener noreferrer" className="block">
          {image}
        </a>
      ) : (
        image
      )}

      <div className="flex items-center justify-between gap-3 border-t border-line-soft px-4 py-1.5">
        <label
          className={cn(
            "flex min-h-10 items-center gap-2 text-caption text-ink-soft",
            interactive ? "cursor-pointer" : "cursor-not-allowed opacity-50",
          )}
        >
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(event) => setDontShowAgain(event.target.checked)}
            disabled={!interactive}
            className="h-4 w-4 accent-primary-600 disabled:cursor-not-allowed"
          />
          {popup.hideDurationDays}일간 보지 않기
        </label>
        <button
          type="button"
          onClick={close}
          className="h-10 px-1 text-caption font-bold text-ink hover:text-primary-600 hover:underline hover:underline-offset-4"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
