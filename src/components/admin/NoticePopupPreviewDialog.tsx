"use client";

import { useEffect, useRef } from "react";
import { NoticePopupCard } from "@/components/noticePopup/NoticePopupCard";
import type { PublicNoticePopup } from "@/types/noticePopup";

interface NoticePopupPreviewDialogProps {
  popup: PublicNoticePopup;
  onClose: () => void;
}

/**
 * 공개 사이트와 같은 카드 컴포넌트로 실제 위치/크기를 미리 보여준다.
 * 네이티브 모달 다이얼로그는 나중에 연 것이 최상단에 쌓이므로, 미리보기를 닫아도 바깥 편집 다이얼로그는 유지된다.
 */
export function NoticePopupPreviewDialog({ popup, onClose }: NoticePopupPreviewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label="공지 팝업 미리보기"
      // Escape는 카드가 직접 처리해 닫힘 애니메이션을 보여준다.
      onCancel={(event) => event.preventDefault()}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="fixed inset-x-4 top-auto bottom-4 m-0 w-auto max-w-none overflow-visible bg-transparent p-0 backdrop:bg-primary-950/30 sm:inset-x-auto sm:right-6 sm:bottom-6 lg:right-8 lg:bottom-8"
    >
      <NoticePopupCard popup={popup} onClose={onClose} interactive={false} />
    </dialog>
  );
}
