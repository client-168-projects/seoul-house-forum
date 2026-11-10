"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_GROUPS, SITE_NAME } from "@/constants/nav";
import { Container } from "@/components/common/Container";
import { cn } from "@/utils/cn";

const WHITE_LOGO = "/images/hero/logos/logo-white.svg";
const PURPLE_LOGO = "/images/hero/logos/logo-purple.svg";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const expanded = hoveredIndex !== null;

  return (
    <header
      className={cn(
        "absolute inset-x-0 top-0 z-50",
        expanded ? "bg-white shadow-[0_12px_24px_rgba(24,24,24,0.08)]" : "bg-transparent",
        // 모바일 메뉴를 열면 상단 바와 메뉴 패널이 한 덩어리로 보이도록 같은 배경을 깐다.
        mobileOpen && "max-lg:bg-primary-900 max-lg:shadow-[0_16px_32px_rgba(24,24,24,0.25)]",
      )}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <Container className="relative">
        <div className="grid min-h-[68px] grid-cols-[1fr_auto] items-center lg:min-h-0 lg:grid-cols-[250px_repeat(4,minmax(0,1fr))] lg:items-stretch">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="self-center py-3 lg:self-start lg:py-0 lg:pt-[31px]"
          >
            <Image
              src={expanded ? PURPLE_LOGO : WHITE_LOGO}
              alt={SITE_NAME}
              width={123}
              height={44}
              priority
              className="h-auto w-[105px] lg:w-[123px]"
            />
          </Link>

          {NAV_GROUPS.map((group, index) => {
            const highlighted = hoveredIndex === index;
            return (
              <div
                key={group.label}
                className={cn(
                  "hidden text-center transition-[padding] duration-200 lg:block",
                  "pt-[43px]",
                  expanded ? "pb-[46px]" : "pb-0",
                  highlighted && "bg-primary-50",
                )}
                onMouseEnter={() => setHoveredIndex(index)}
              >
                <Link
                  href={group.href}
                  onFocus={() => setHoveredIndex(index)}
                  className={cn(
                    "inline-block text-body font-extrabold",
                    highlighted
                      ? "text-primary-950 underline underline-offset-[7px]"
                      : expanded
                        ? "text-ink"
                        : "text-white",
                  )}
                >
                  {group.label}
                </Link>

                <ul
                  className={cn(
                    "overflow-hidden transition-[max-height,margin-top,opacity] duration-200",
                    expanded ? "mt-[43px] max-h-[140px] opacity-100" : "mt-0 max-h-0 opacity-0",
                  )}
                >
                  {group.children.map((child) => {
                    const current = pathname === child.href;
                    return (
                      <li key={child.href} className="h-[29px]">
                        <Link
                          href={child.href}
                          onFocus={() => setHoveredIndex(index)}
                          onClick={() => setHoveredIndex(null)}
                          className={cn(
                            "text-caption font-bold hover:text-primary-950",
                            current
                              ? "text-primary-950 underline underline-offset-[5px]"
                              : "text-ink-soft",
                          )}
                        >
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          <button
            type="button"
            className={cn(
              "-mr-2 inline-flex h-11 w-11 items-center justify-center justify-self-end lg:hidden",
              expanded ? "text-primary-950" : "text-white",
            )}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </Container>

      {mobileOpen && (
        <nav className="border-t border-white/15 bg-primary-900 lg:hidden">
          <Container className="flex flex-col py-2">
            {NAV_GROUPS.map((group) => (
              <details key={group.label} className="group/details border-b border-white/10">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-body font-extrabold text-white marker:content-none">
                  {group.label}
                  <ChevronIcon />
                </summary>
                <ul className="pb-2">
                  {group.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block min-h-11 py-2.5 pl-4 text-caption font-bold text-primary-100 hover:bg-white/10"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="transition-transform group-open/details:rotate-180"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
