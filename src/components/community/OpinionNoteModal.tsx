"use client";

import { useEffect, useId, useRef } from "react";
import { NOTE_TONE_CLASSES } from "@/components/community/noteTones";
import type { OpinionPost } from "@/types/board";
import { cn } from "@/utils/cn";
import { formatRelative } from "@/utils/date";
import { getNoteTone } from "@/utils/noteTone";

interface OpinionNoteModalProps {
  post: OpinionPost | null;
  onClose: () => void;
}

/** 피그마 팝업_4종: 스티커 색의 바탕 + 한 톤 진한 본문 상자, 하단에 지역구와 마스킹된 이름 */
export function OpinionNoteModal({ post, onClose }: OpinionNoteModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (post && !dialog.open) dialog.showModal();
    if (!post && dialog.open) dialog.close();
  }, [post]);

  const tone = post ? NOTE_TONE_CLASSES[getNoteTone(post.id)] : null;

  return (
    <dialog
      ref={dialogRef}
      aria-describedby={contentId}
      aria-label="의견 크게 보기"
      onClose={onClose}
      onClick={(event) => {
        // 모달 바깥(backdrop)을 누르면 닫는다.
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "m-auto w-[calc(100%-32px)] max-w-[588px] rounded-[8px] border p-0 text-ink shadow-[0_24px_64px_rgba(51,12,83,0.3)] backdrop:bg-primary-950/55",
        tone?.paper,
      )}
    >
      {post && tone && (
        <div className="px-5 pt-5 pb-6 sm:px-[29px] sm:pt-[26px] sm:pb-[30px]">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              autoFocus
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-black/5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <p
            id={contentId}
            className={cn(
              "mt-1 flex min-h-[120px] items-center justify-center rounded-[16px] border px-6 py-8 text-center text-[16px] leading-[1.6] font-bold break-keep text-ink sm:px-10",
              tone.inner,
            )}
          >
            {post.content}
          </p>

          <p className={cn("mt-12 flex gap-3 text-body sm:mt-[56px]", tone.ink)}>
            <span className="font-bold">{post.district}</span>
            <span suppressHydrationWarning>
              {post.author} {formatRelative(post.createdAt)}
            </span>
          </p>
        </div>
      )}
    </dialog>
  );
}
