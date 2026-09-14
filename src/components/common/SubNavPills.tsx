"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/types/nav";
import { cn } from "@/utils/cn";

interface SubNavPillsProps {
  items: NavLink[];
}

/** 목업 기준: 높이 40px, 좌우 여백 22px, 16px 텍스트, 간격 8px */
export function SubNavPills({ items }: SubNavPillsProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-10 items-center rounded-full px-5 text-body font-bold transition-colors",
              active ? "bg-white text-ink" : "bg-primary-400 text-white hover:bg-primary-500",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
