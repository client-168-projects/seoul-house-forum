"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NoticePopupDialog } from "@/components/admin/NoticePopupDialog";
import { POPUP_SIZE_OPTIONS, POPUP_STATUS_LABEL } from "@/constants/noticePopup";
import { adminFetch } from "@/lib/client/adminApi";
import type { NoticePopup, PopupStatus } from "@/types/noticePopup";
import { cn } from "@/utils/cn";
import { getPopupStatus } from "@/utils/noticePopup";

type DialogState = { mode: "create" } | { mode: "edit"; popup: NoticePopup } | null;

const STATUS_CLASS: Record<PopupStatus, string> = {
  scheduled: "bg-primary-50 text-primary-700",
  active: "bg-accent text-accent-ink",
  ended: "bg-surface-muted text-ink-muted",
  hidden: "bg-note-pink text-[#c2255c]",
};

const SIZE_LABEL = Object.fromEntries(POPUP_SIZE_OPTIONS.map((option) => [option.value, option.label]));

export function NoticePopupsManager({ popups }: { popups: NoticePopup[] }) {
  const router = useRouter();
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [reorderingId, setReorderingId] = useState<number | null>(null);

  const move = async (id: number, direction: "up" | "down") => {
    setReorderingId(id);
    try {
      await adminFetch(`/api/admin/notice-popups/${id}/reorder`, {
        method: "PATCH",
        body: JSON.stringify({ direction }),
      });
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "순서를 바꾸지 못했습니다.");
    } finally {
      setReorderingId(null);
    }
  };

  return (
    <>
      <div className="mt-8 flex items-center justify-between gap-3">
        <p className="text-caption font-bold text-ink-soft">
          총 <span className="text-primary-600">{popups.length}</span>건
        </p>
        <button
          type="button"
          onClick={() => setDialogState({ mode: "create" })}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary-600 px-5 text-body font-bold text-white hover:bg-primary-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          새 팝업 등록
        </button>
      </div>

      <section className="mt-4 overflow-hidden rounded-[20px] bg-white ring-1 ring-primary-100">
        {popups.length === 0 ? (
          <p className="px-5 py-20 text-center text-body text-ink-muted">등록된 팝업이 없습니다.</p>
        ) : (
          <ul>
            {popups.map((popup, index) => {
              const status = getPopupStatus(popup);
              return (
                <li
                  key={popup.id}
                  className="flex flex-col gap-3 border-t border-primary-50 px-5 py-4 first:border-t-0 hover:bg-primary-50/50 sm:flex-row sm:items-center sm:gap-5"
                >
                  <button
                    type="button"
                    onClick={() => setDialogState({ mode: "edit", popup })}
                    className="flex min-w-0 flex-1 items-center gap-4 rounded-[12px] text-left"
                  >
                    <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-[10px] bg-admin-canvas ring-1 ring-primary-100">
                      <Image src={popup.imageUrl} alt="" fill sizes="96px" className="object-cover" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className={cn("rounded-full px-2.5 py-0.5 text-[12px] font-extrabold", STATUS_CLASS[status])}>
                          {POPUP_STATUS_LABEL[status]}
                        </span>
                        <span className="text-caption text-ink-soft tabular-nums">
                          {popup.startDate} ~ {popup.endDate}
                        </span>
                        <span className="text-[12px] text-ink-muted">
                          {SIZE_LABEL[popup.size]} · {popup.hideDurationDays}일간 보지 않기
                        </span>
                      </span>
                      <span className="truncate text-[12px] text-ink-muted">{popup.targetUrl ?? "이동 링크 없음"}</span>
                    </span>
                  </button>

                  <div className="flex shrink-0 items-center justify-end gap-1">
                    <MoveButton
                      label="위로 이동"
                      path="M12 19V5M5 12l7-7 7 7"
                      disabled={index === 0 || reorderingId !== null}
                      onClick={() => move(popup.id, "up")}
                    />
                    <MoveButton
                      label="아래로 이동"
                      path="M12 5v14M19 12l-7 7-7-7"
                      disabled={index === popups.length - 1 || reorderingId !== null}
                      onClick={() => move(popup.id, "down")}
                    />
                    <button
                      type="button"
                      onClick={() => setDialogState({ mode: "edit", popup })}
                      className="ml-1 flex h-10 items-center rounded-[10px] bg-primary-50 px-3 text-caption font-bold text-primary-700 hover:bg-primary-100"
                    >
                      수정
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {dialogState && (
        <NoticePopupDialog
          key={dialogState.mode === "edit" ? dialogState.popup.id : "create"}
          popup={dialogState.mode === "edit" ? dialogState.popup : undefined}
          onClose={() => setDialogState(null)}
        />
      )}
    </>
  );
}

function MoveButton({ label, path, disabled, onClick }: { label: string; path: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-[10px] text-ink-soft hover:bg-primary-50 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d={path} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
