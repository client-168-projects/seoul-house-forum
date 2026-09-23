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
 *
 * 사진이 아직 없으면 회색 사각형으로 대체하고, 약력까지 없는 인물은 준비 중 안내만 보여 준다.
 */
export function SpeakerCard({ speaker, onSelect }: SpeakerCardProps) {
  const hasProfile = Boolean(speaker.bioSummary);

  const heading = speaker.sessionTitle && (
    <>
      <span className="inline-flex h-[32px] items-center rounded-[3px] bg-primary-800 px-5 text-caption font-bold text-white">
        {speaker.sessionLabel}
      </span>
      <p className="mt-[12px] text-h4 break-keep text-ink">
        {speaker.sessionTitle}
      </p>
    </>
  );

  const photoBlock = (
    <div className="relative mt-5 aspect-square overflow-hidden rounded-lg bg-surface-muted transition-colors duration-200 first:mt-0 group-hover:bg-primary-800 lg:mt-6">
      <span className="absolute top-[24px] left-[20px] z-10 flex items-baseline gap-2 text-ink transition-colors group-hover:text-white">
        <span className="text-body font-bold underline decoration-2 underline-offset-[5px]">
          {speaker.name}
        </span>
        {speaker.role && <span className="text-caption font-semibold">{speaker.role}</span>}
      </span>

      {hasProfile ? (
        <span className="absolute bottom-[20px] left-[20px] z-10 text-caption text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {speaker.affiliation}
        </span>
      ) : (
        <>
          <span className="absolute top-[52px] left-[20px] z-10 text-caption text-ink-soft">
            {speaker.affiliation}
          </span>
          <span className="absolute inset-0 z-10 flex items-center justify-center text-caption font-semibold text-ink-muted">
            연사 정보 준비 중입니다.
          </span>
        </>
      )}

      {speaker.photo && (
        <Image
          src={speaker.photo.src}
          alt=""
          width={speaker.photo.width}
          height={speaker.photo.height}
          sizes="(min-width: 640px) 580px, 100vw"
          className="absolute bottom-0 left-1/2 h-[92.5%] w-auto max-w-full -translate-x-1/2"
        />
      )}
    </div>
  );

  if (!hasProfile) {
    return (
      <div className="block w-full text-left">
        {heading}
        {photoBlock}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(speaker)}
      className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
    >
      {heading}
      {photoBlock}
    </button>
  );
}
