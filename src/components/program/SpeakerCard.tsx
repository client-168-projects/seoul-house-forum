import Image from "next/image";
import type { Speaker } from "@/types/program";

interface SpeakerCardProps {
  speaker: Speaker;
  onSelect: (speaker: Speaker) => void;
}

/**
 * 목업(temp/연사소개.png) 기준 1920px 프레임 수치
 * - 배지 32px 높이(primary-800), 세션명 22px, 카드 580x584(정사각에 가깝게)
 * - 기본 배경 #F5F5F5 / 마우스 오버 시 primary-800 + 소속 노출
 * - 인물 컷아웃은 카드 하단에 밀착하고 높이 92.5%, 좌우 중앙. 폭은 인물마다 비율대로 달라진다.
 */
export function SpeakerCard({ speaker, onSelect }: SpeakerCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(speaker)}
      className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
    >
      <span className="inline-flex h-[32px] items-center rounded-[3px] bg-primary-800 px-5 text-caption font-bold text-white">
        {speaker.sessionLabel}
      </span>

      <p className="mt-[12px] text-h4 text-ink">
        {speaker.sessionTitle}
      </p>

      <div className="relative mt-6 aspect-square overflow-hidden rounded-lg bg-surface-muted transition-colors duration-200 group-hover:bg-primary-800 lg:mt-[34px]">
        <span className="absolute top-[24px] left-[20px] z-10 text-body font-bold text-ink underline decoration-2 underline-offset-[5px] transition-colors group-hover:text-white">
          {speaker.name}
        </span>

        <span className="absolute bottom-[20px] left-[20px] z-10 text-caption text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {speaker.affiliation}
        </span>

        <Image
          src={speaker.photo.src}
          alt=""
          width={speaker.photo.width}
          height={speaker.photo.height}
          sizes="(min-width: 640px) 580px, 100vw"
          className="absolute bottom-0 left-1/2 h-[92.5%] w-auto max-w-full -translate-x-1/2"
        />
      </div>
    </button>
  );
}
