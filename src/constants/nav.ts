import type { NavGroup, NavLink } from "@/types/nav";

export const SITE_NAME = "2026 서울주거포럼";

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "2026 서울주거포럼",
    href: "/forum/intro",
    children: [
      { label: "2026 서울주거포럼 소개", href: "/forum/intro" },
      { label: "행사 개요", href: "/forum/overview" },
      { label: "오시는 길", href: "/forum/location" },
    ],
  },
  {
    label: "프로그램",
    href: "/program",
    children: [
      { label: "프로그램", href: "/program" },
      { label: "연사 소개", href: "/program/speakers" },
    ],
  },
  {
    label: "참가 등록",
    href: "/register",
    children: [{ label: "사전 등록", href: "/register" }],
  },
  {
    label: "소통의 장",
    href: "/community/notice",
    children: [
      { label: "공지사항", href: "/community/notice" },
      { label: "자유게시판", href: "/community/board" },
    ],
  },
];

/** 서브 페이지 히어로에 쓰이는 짧은 탭 라벨 (헤더 메가메뉴 라벨과는 별도로 관리) */
export const FORUM_TABS: NavLink[] = [
  { label: "소개", href: "/forum/intro" },
  { label: "행사 개요", href: "/forum/overview" },
  { label: "오시는 길", href: "/forum/location" },
];

export const PROGRAM_TABS: NavLink[] = [
  { label: "프로그램", href: "/program" },
  { label: "연사 소개", href: "/program/speakers" },
];

export const COMMUNITY_TABS: NavLink[] = [
  { label: "공지사항", href: "/community/notice" },
  { label: "자유게시판", href: "/community/board" },
];
