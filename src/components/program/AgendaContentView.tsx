import { Fragment } from "react";
import type { AgendaContent } from "@/types/program";

interface AgendaContentViewProps {
  content: AgendaContent;
}

export function AgendaContentView({ content }: AgendaContentViewProps) {
  switch (content.kind) {
    case "text":
      return (
        <div className="text-body text-ink">
          {content.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      );

    case "people":
      return (
        <ul className="space-y-1 text-body text-ink">
          {content.people.map((person) => (
            <li key={person.name} className="flex flex-wrap items-center gap-x-2.5">
              <span className="font-bold">{person.name}</span>
              <span>{person.affiliation}</span>
            </li>
          ))}
        </ul>
      );

    case "session":
      return (
        <div>
          {/* 배지와 제목 첫 줄이 떨어지지 않도록 flex 대신 인라인 흐름으로 두고, 긴 제목만 다음 줄로 넘긴다. */}
          <p className="text-card-title break-keep text-primary-800">
            <span className="mr-3 inline-block rounded-full bg-primary-800 px-3 py-0.5 align-middle text-body font-bold whitespace-nowrap text-white">
              {content.badge}
            </span>
            {content.category && `(${content.category}) `}
            {content.title}
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-body lg:mt-4">
            <span className="font-bold text-ink">{content.presenter.name}</span>
            <span className="text-ink">{content.presenter.affiliation}</span>
          </p>
        </div>
      );

    case "panel":
      return (
        <div className="space-y-3 text-body text-ink">
          <div className="flex gap-2">
            <span className="shrink-0 font-bold">{content.moderatorLabel}</span>
            <p className="text-primary-700">
              <span className="font-bold">{content.moderator.name}</span>{" "}
              {content.moderator.affiliation}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="shrink-0 font-bold">{content.discussionLabel}</span>
            <p className="text-primary-700">
              {content.panelists.map((panelist, index) => (
                <Fragment key={panelist.name}>
                  {/* 이름과 소속이 줄바꿈으로 갈라지지 않도록 한 사람을 한 덩어리로 넘긴다. */}
                  <span className="inline-block">
                    <span className="font-bold">{panelist.name}</span> {panelist.affiliation}
                    {index < content.panelists.length - 1 && ","}
                  </span>{" "}
                </Fragment>
              ))}
            </p>
          </div>
        </div>
      );
  }
}
