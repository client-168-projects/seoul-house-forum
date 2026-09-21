"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { logout } from "@/app/admin/login/actions";
import { AdminNavIcon } from "@/components/admin/AdminNavIcon";
import { ADMIN_NAV } from "@/constants/adminNav";
import { cn } from "@/utils/cn";
import { formatDateTime } from "@/utils/date";

interface AdminShellProps {
  username: string;
  lastLoginAt: string | null;
  pendingCount: number;
  children: ReactNode;
}

/**
 * 사이드바는 화면 높이에 고정(h-dvh, overflow 없음)되어 본문 스크롤과 무관하게 항상 같은 모습이다.
 * 항목 수가 적어 스크롤이 생기지 않도록 구성하고, lg 미만에서는 드로어로 전환한다.
 */
export function AdminShell({ username, lastLoginAt, pendingCount, children }: AdminShellProps) {
  const pathname = usePathname();
  // 드로어를 연 경로를 기억해 두고, 경로가 바뀌면(메뉴 이동) 자동으로 닫힌 상태가 된다.
  const [drawerPath, setDrawerPath] = useState<string | null>(null);
  const drawerOpen = drawerPath === pathname;
  const setDrawerOpen = (open: boolean) => setDrawerPath(open ? pathname : null);

  return (
    <div className="lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-primary-950 px-4 lg:hidden">
        <Image src="/images/hero/logos/logo-white.svg" alt="2026 서울주거포럼 관리자" width={88} height={32} className="h-auto" />
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="메뉴 열기"
          aria-expanded={drawerOpen}
          className="flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-white/10"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {drawerOpen && (
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-primary-950/50 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-dvh w-[264px] flex-col overflow-hidden bg-primary-950 text-white transition-transform lg:sticky lg:top-0 lg:translate-x-0",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-[88px] shrink-0 items-center gap-3 px-7">
          <Image src="/images/hero/logos/logo-white.svg" alt="2026 서울주거포럼" width={96} height={34} priority className="h-auto" />
          <span className="rounded-full border border-white/25 px-2 py-0.5 text-[11px] font-bold text-white/70">
            ADMIN
          </span>
        </div>

        <nav aria-label="관리자 메뉴" className="flex-1 px-4 pt-4">
          <p className="px-3 pb-3 text-[11px] font-bold tracking-[0.18em] text-white/40">MENU</p>
          <ul className="flex flex-col gap-1">
            {ADMIN_NAV.map((item) => {
              const active = item.matchPrefix ? pathname.startsWith(item.href) : pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex h-12 items-center gap-3 rounded-[12px] px-3 text-body font-bold transition-colors",
                      active ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {active && (
                      <span aria-hidden="true" className="absolute top-3 bottom-3 -left-4 w-1 rounded-r-full bg-accent" />
                    )}
                    <AdminNavIcon name={item.icon} className={active ? "text-accent" : undefined} />
                    <span className="flex-1">{item.label}</span>
                    {item.icon === "board" && pendingCount > 0 && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-extrabold text-accent-ink tabular-nums">
                        {pendingCount > 99 ? "99+" : pendingCount}
                        <span className="sr-only">건 검수 대기</span>
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-white/10 p-4">
          <Link
            href="/admin/account"
            aria-current={pathname === "/admin/account" ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-[14px] p-3 transition-colors",
              pathname === "/admin/account" ? "bg-white/15" : "bg-white/5 hover:bg-white/10",
            )}
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-body font-bold text-accent-ink"
            >
              {username.slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-body font-bold">{username}</span>
              <span className="block truncate text-[12px] text-white/55">
                관리자 · {lastLoginAt ? `${formatDateTime(lastLoginAt).slice(5)} 접속` : "첫 접속"}
              </span>
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-white/50">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="sr-only">계정 설정</span>
          </Link>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener"
              className="flex h-11 items-center justify-center gap-1.5 rounded-[12px] bg-white/10 text-caption font-bold text-white hover:bg-white/15"
            >
              포럼 페이지
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M14 5h5v5M19 5l-8 8M10 5H5v14h14v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center rounded-[12px] border border-white/15 text-caption font-bold text-white/80 hover:border-white/30 hover:text-white"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">{children}</main>
    </div>
  );
}
