import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}

export function AdminPageHeader({ eyebrow, title, description, actions }: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[12px] font-extrabold tracking-[0.16em] text-primary-500">{eyebrow}</p>
        <h1 className="mt-1.5 font-heading text-[26px] leading-tight font-bold text-primary-950 lg:text-[30px]">{title}</h1>
        {description && <p className="mt-2 text-body text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
