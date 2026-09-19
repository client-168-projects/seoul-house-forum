import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface PanelProps {
  title: string;
  caption?: string;
  className?: string;
  children: ReactNode;
}

export function Panel({ title, caption, className, children }: PanelProps) {
  return (
    <section className={cn("rounded-[24px] bg-white p-6 ring-1 ring-primary-100 lg:p-7", className)}>
      <header className="flex items-baseline justify-between gap-3">
        <h2 className="font-heading text-[18px] font-bold text-primary-950">{title}</h2>
        {caption && <p className="text-[12px] text-ink-muted">{caption}</p>}
      </header>
      <div className="mt-5">{children}</div>
    </section>
  );
}
