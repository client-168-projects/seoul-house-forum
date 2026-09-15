"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { Speaker } from "@/types/program";

interface SpeakerModalProps {
  speaker: Speaker;
  onClose: () => void;
}

/**
 * 목업(temp/연사소개-모달.png) 기준 1920px 프레임 수치
 * - 패널 996x634, 좌우 여백 40px, 사진 정사각 + 간격 36px + 본문 437px
 * - 타이포는 피그마 기준: 이름/소제목 Body1_extra bold(20px/800),
 *   소속 Body2_medium(16px/600), 본문 Small_medium(14px/500)
 */
export function SpeakerModal({ speaker, onClose }: SpeakerModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${speaker.name} 연사 소개`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="relative max-h-full w-full max-w-[996px] overflow-y-auto rounded-lg bg-white px-6 pt-16 pb-8 lg:px-[40px] lg:pt-[80px] lg:pb-[40px]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-[22px] right-[22px] flex h-11 w-11 items-center justify-center text-ink-soft hover:text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="grid gap-8 lg:grid-cols-[442px_437px] lg:gap-[36px]">
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-muted">
              <Image
                src={speaker.photo.src}
                alt=""
                width={speaker.photo.width}
                height={speaker.photo.height}
                sizes="442px"
                className="absolute bottom-0 left-1/2 h-[92.5%] w-auto max-w-full -translate-x-1/2"
              />
            </div>
            <p className="mt-[18px] text-body-lg font-extrabold text-ink underline decoration-2 underline-offset-[6px]">
              {speaker.name}
            </p>
            <p className="mt-[12px] text-body font-semibold text-ink">
              {speaker.affiliation}
            </p>
          </div>

          <div className="space-y-[24px]">
            <section>
              <h3 className="text-body-lg font-extrabold text-primary-800">
                약력
              </h3>
              <p className="mt-[9px] text-caption font-medium text-ink-soft">
                {speaker.bio}
              </p>
            </section>
            <section>
              <h3 className="text-body-lg font-extrabold text-primary-800">
                {speaker.sessionLabel}에 대한 초록
              </h3>
              <p className="mt-[9px] text-caption font-medium text-ink-soft">
                {speaker.abstract}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
