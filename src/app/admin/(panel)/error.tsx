"use client";

import { useEffect } from "react";
import { StatusButton, StatusLink } from "@/components/common/StatusLink";
import { StatusScreen } from "@/components/common/StatusScreen";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <StatusScreen
      tone="admin"
      title="데이터를 불러오지 못했습니다"
      description={
        <>
          잠시 후 다시 시도해 주세요. 계속 실패하면 D1 연결 상태와 바인딩 설정을 확인해 주세요.
          {error.digest && <span className="mt-2 block text-caption text-ink-muted">오류 번호 {error.digest}</span>}
        </>
      }
      actions={
        <>
          <StatusButton variant="primary" onClick={reset}>
            다시 시도
          </StatusButton>
          <StatusLink href="/admin" variant="quiet">
            대시보드로
          </StatusLink>
        </>
      }
    />
  );
}
