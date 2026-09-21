import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

const BASE = "inline-flex h-12 items-center rounded-full px-7 text-body font-bold transition-colors";

const VARIANTS = {
  accent: "bg-accent text-accent-ink hover:brightness-95",
  outline: "border border-white/40 text-white hover:bg-white/10",
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  quiet: "border border-line-soft text-ink-soft hover:bg-surface-muted",
} as const;

interface StatusLinkProps {
  href: string;
  variant: keyof typeof VARIANTS;
  children: ReactNode;
}

/** 404/오류 화면 전용 링크 버튼. 본문 버튼(ui/Button)과 달리 상황 안내용 스타일만 가진다. */
export function StatusLink({ href, variant, children }: StatusLinkProps) {
  return (
    <Link href={href} className={cn(BASE, VARIANTS[variant])}>
      {children}
    </Link>
  );
}

export function StatusButton({
  variant,
  children,
  ...props
}: { variant: keyof typeof VARIANTS; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cn(BASE, VARIANTS[variant])} {...props}>
      {children}
    </button>
  );
}
