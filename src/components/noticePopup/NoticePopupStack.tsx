"use client";

import { useEffect, useState } from "react";
import { NoticePopupCard } from "@/components/noticePopup/NoticePopupCard";
import { POPUP_LANDING_DELAY_MS } from "@/constants/noticePopup";
import { hidePopupForDays, isPopupHidden } from "@/lib/client/popupDismissal";
import type { PublicNoticePopup } from "@/types/noticePopup";
import { cn } from "@/utils/cn";

/**
 * 공개 사이트 우하단 공지 팝업. 사이트 레이아웃에 한 번만 두며,
 * 첫 화면을 그린 뒤 활성 팝업을 받아 "다시 보지 않기" 처리된 것을 빼고 노출한다.
 */
export function NoticePopupStack() {
  const [queue, setQueue] = useState<PublicNoticePopup[]>([]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/popups/active");
        const body = (await response.json().catch(() => null)) as { popups?: unknown } | null;
        const popups = Array.isArray(body?.popups) ? (body.popups as PublicNoticePopup[]) : [];
        if (!cancelled) setQueue(popups.filter((popup) => !isPopupHidden(popup.id)));
      } catch {
        // 팝업은 부가 기능이라 실패해도 조용히 넘어간다.
      }
    }, POPUP_LANDING_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  const handleClose = (id: number, hideDays: number | null) => {
    if (hideDays !== null) hidePopupForDays(id, hideDays);
    setQueue((current) => current.filter((popup) => popup.id !== id));
  };

  if (queue.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-4 z-[60] flex max-h-[calc(100dvh-32px)] flex-col-reverse items-stretch gap-3 overflow-y-auto",
        "sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-h-none sm:flex-row-reverse sm:items-end sm:overflow-visible",
        "lg:right-8 lg:bottom-8",
      )}
    >
      {queue.map((popup) => (
        <NoticePopupCard key={popup.id} popup={popup} onClose={(hideDays) => handleClose(popup.id, hideDays)} />
      ))}
    </div>
  );
}
