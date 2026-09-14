import { cn } from "@/utils/cn";

interface RouteBadgeProps {
  children: string;
  tone?: "accent" | "pink";
  className?: string;
}

/** 오시는 길의 노선/방면 배지. 목업 기준 높이 28px, 좌우 14px, 알약형. */
export function RouteBadge({ children, tone = "accent", className }: RouteBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-[28px] shrink-0 items-center rounded-full px-[14px] text-caption font-bold text-ink",
        tone === "accent" ? "bg-accent" : "bg-[#edbed8]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** ">" 로 이어지는 경로 표기 */
export function RouteSteps({ steps }: { steps: string[] }) {
  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body text-ink">
      {steps.map((step, index) => (
        <span key={step} className="flex items-center gap-x-2">
          {index > 0 && (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {step}
        </span>
      ))}
    </span>
  );
}
