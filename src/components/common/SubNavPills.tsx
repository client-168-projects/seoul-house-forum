"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/types/nav";
import { cn } from "@/utils/cn";

interface SubNavPillsProps {
  items: NavLink[];
}

export function SubNavPills({ items }: SubNavPillsProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {items.map((item) => {
        // 상세 페이지(/community/notice/3)에서도 해당 탭이 선택 상태로 보이게 한다.
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-10 items-center rounded-full px-[18px] text-body font-extrabold transition-colors",
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
