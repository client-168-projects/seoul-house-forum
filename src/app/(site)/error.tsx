"use client";

import { useEffect } from "react";
import { StatusButton, StatusLink } from "@/components/common/StatusLink";
import { StatusScreen } from "@/components/common/StatusScreen";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[site]", error);
  }, [error]);

  return (
    <StatusScreen
      title="화면을 불러오지 못했습니다"
      description={
        <>
          일시적인 오류일 수 있습니다. 다시 시도해도 같은 화면이 보이면 잠시 후 접속해 주세요.
          {error.digest && <span className="mt-2 block text-caption text-white/60">오류 번호 {error.digest}</span>}
        </>
      }
      actions={
        <>
          <StatusButton variant="accent" onClick={reset}>
            다시 시도
          </StatusButton>
          <StatusLink href="/" variant="outline">
            홈으로
          </StatusLink>
        </>
      }
    />
  );
}
