import type { Metadata } from "next";
import { gmarketSans, suit } from "@/styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "2026 서울주거포럼",
    template: "%s | 2026 서울주거포럼",
  },
  description: "전월세시장 현황을 진단하고 안정화 방안을 모색하는 2026 서울주거포럼",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${gmarketSans.variable} ${suit.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col">{children}</body>
    </html>
  );
}
