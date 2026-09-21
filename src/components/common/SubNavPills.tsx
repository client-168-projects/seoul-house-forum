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

  /*
   * 상세 페이지(/community/notice/3)에서도 해당 탭이 선택 상태로 보이게 하되,
   * /program 처럼 다른 탭(/program/speakers)의 상위 경로인 탭까지 같이 켜지지 않도록
   * 조건을 만족하는 탭 중 가장 구체적인(긴) 경로 하나만 고른다.
   */
  const activeHref = items.reduce<string | null>((best, item) => {
    const matched = pathname === item.href || pathname.startsWith(`${item.href}/`);
    if (!matched) return best;
    return best && best.length >= item.href.length ? best : item.href;
  }, null);

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {items.map((item) => {
        const active = item.href === activeHref;
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
