"use client";

import { useState } from "react";
import type { Speaker } from "@/types/program";
import { SpeakerCard } from "@/components/program/SpeakerCard";
import { SpeakerModal } from "@/components/program/SpeakerModal";

interface SpeakerGridProps {
  speakers: Speaker[];
}

/** 목업 기준: 2열, 컬럼 간격 40px, 행 간격 42px */
export function SpeakerGrid({ speakers }: SpeakerGridProps) {
  const [selected, setSelected] = useState<Speaker | null>(null);

  return (
    <>
      <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:gap-y-[42px]">
        {speakers.map((speaker) => (
          <SpeakerCard key={speaker.id} speaker={speaker} onSelect={setSelected} />
        ))}
      </div>
      {selected && <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
