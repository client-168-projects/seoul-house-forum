import type { Metadata } from "next";
import { gmarketSans, suit } from "@/styles/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "2026 서울주거포럼",
    template: "%s | 2026 서울주거포럼",
  },
  description: "전월세 시장 현황 및 시장 안정화 방안을 논의하는 2026 서울주거포럼",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${gmarketSans.variable} ${suit.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
