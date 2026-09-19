export type AdminNavIcon = "dashboard" | "notice" | "board";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: AdminNavIcon;
  /** 하위 경로(/admin/notices/new 등)에서도 활성으로 표시할지 */
  matchPrefix: boolean;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "방문 통계", href: "/admin", icon: "dashboard", matchPrefix: false },
  { label: "공지사항 관리", href: "/admin/notices", icon: "notice", matchPrefix: true },
  { label: "자유게시판 검수", href: "/admin/board", icon: "board", matchPrefix: true },
];
