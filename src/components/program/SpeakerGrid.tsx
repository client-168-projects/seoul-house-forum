"use client";

import { useState } from "react";
import type { Speaker, SpeakerSection } from "@/types/program";
import { SpeakerCard } from "@/components/program/SpeakerCard";
import { SpeakerModal } from "@/components/program/SpeakerModal";

interface SpeakerGridProps {
  sections: SpeakerSection[];
}

export function SpeakerGrid({ sections }: SpeakerGridProps) {
  const [selected, setSelected] = useState<Speaker | null>(null);

  return (
    <>
      <div className="space-y-14 lg:space-y-20">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="border-b-2 border-primary-800 pb-3 text-section-title text-ink lg:pb-3.5">
              {section.title}
            </h2>

            <div className="mt-8 space-y-10 lg:mt-10 lg:space-y-12">
              {section.groups.map((group, groupIndex) => (
                <div key={group.label ?? groupIndex}>
                  {group.label && (
                    <h3 className="mb-5 text-h4 text-primary-800 lg:mb-6">{group.label}</h3>
                  )}
                  <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:gap-y-[42px]">
                    {group.speakers.map((speaker) => (
                      <SpeakerCard key={speaker.id} speaker={speaker} onSelect={setSelected} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      {selected && <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
