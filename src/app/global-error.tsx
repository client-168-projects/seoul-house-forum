"use client";

import { gmarketSans, suit } from "@/styles/fonts";
import "./globals.css";

/** 루트 레이아웃 자체가 실패했을 때만 쓰인다. html/body를 직접 그려야 한다. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ko" className={`${gmarketSans.variable} ${suit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center bg-primary-600 px-6 text-center text-white">
        <h1 className="font-heading text-[28px] font-bold">화면을 불러오지 못했습니다</h1>
        <p className="mt-3 text-body-lg text-white/85">잠시 후 다시 시도해 주세요.</p>
        {error.digest && <p className="mt-2 text-caption text-white/60">오류 번호 {error.digest}</p>}
        <button
          type="button"
          onClick={reset}
          className="mt-8 h-12 rounded-full bg-accent px-7 text-body font-bold text-accent-ink hover:brightness-95"
        >
          다시 시도
        </button>
      </body>
    </html>
  );
}
