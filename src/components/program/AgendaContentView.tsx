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

    case "session":
      return (
        <div>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="shrink-0 rounded-full bg-primary-800 px-3 py-0.5 text-body font-bold text-white">
              {content.badge}
            </span>
            <span className="text-card-title text-primary-800">{content.title}</span>
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-body lg:mt-4">
            {content.presenter.category && (
              <span className="rounded-full bg-line-faint px-2 py-0.5 text-[11px] text-ink-muted">
                {content.presenter.category}
              </span>
            )}
            <span className="font-bold text-ink">{content.presenter.name}</span>
            <span className="text-ink">{content.presenter.affiliation}</span>
          </p>
        </div>
      );

    case "panel":
      return (
        <div className="space-y-3 text-body text-ink">
          <p>
            <span className="font-bold">{content.moderatorRole}</span>
            <span className="ml-2 text-primary-700">{content.moderator}</span>
          </p>
          <div className="flex gap-2">
            <span className="shrink-0 font-bold">{content.discussionLabel}</span>
            <div>
              <p>{content.discussionSummary}</p>
              <p className="mt-1 text-primary-700">
                {content.panelists.map((panelist, index) => (
                  <span key={panelist.name}>
                    <span className="font-bold">{panelist.name}</span> {panelist.affiliation}
                    {index < content.panelists.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      );
  }
}
