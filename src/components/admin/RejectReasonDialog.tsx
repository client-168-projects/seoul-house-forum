"use client";

import { useEffect, useRef, useState } from "react";

interface RejectReasonDialogProps {
  open: boolean;
  count: number;
  submitting: boolean;
  onConfirm: (note: string) => void;
  onClose: () => void;
}

const PRESETS = [
  "이용 수칙에 맞지 않는 표현",
  "광고·홍보성 내용",
  "포럼 주제와 관련 없는 내용",
  "같은 내용 중복 등록",
];

const MAX_LENGTH = 200;

/** 반려 사유는 운영 기록용이며 작성자에게 보이지 않는다. 자주 쓰는 사유는 버튼으로 채운다. */
export function RejectReasonDialog({ open, count, submitting, onConfirm, onClose }: RejectReasonDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setNote("");
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={(event) => {
        if (submitting) event.preventDefault();
      }}
      className="m-auto w-[calc(100%-32px)] max-w-[460px] rounded-[18px] bg-white p-0 text-ink shadow-[0_20px_56px_rgba(51,12,83,0.3)] backdrop:bg-primary-950/50"
    >
      <div className="p-6">
        <h2 className="font-heading text-[19px] font-bold text-primary-950">의견 {count}건 반려</h2>
        <p className="mt-1.5 text-caption text-ink-muted">
          사유는 관리자 목록에만 표시되고 작성자에게는 전달되지 않습니다. 비워 두어도 반려됩니다.
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setNote(preset)}
              className="h-8 rounded-full bg-primary-50 px-3 text-[12px] font-bold text-primary-700 hover:bg-primary-100"
            >
              {preset}
            </button>
          ))}
        </div>

        <label htmlFor="reject-note" className="sr-only">
          반려 사유
        </label>
        <textarea
          id="reject-note"
          value={note}
          onChange={(event) => setNote(event.target.value.slice(0, MAX_LENGTH))}
          maxLength={MAX_LENGTH}
          rows={3}
          placeholder="반려 사유를 입력하세요"
          className="mt-3 w-full resize-none rounded-[12px] border border-line-soft p-3 text-caption text-ink placeholder:text-ink-muted focus:border-primary-400 focus:outline-2 focus:outline-primary-100"
        />
        <p className="text-right text-[12px] text-ink-muted tabular-nums">
          {note.length}/{MAX_LENGTH}
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="h-10 rounded-full border border-line-soft px-5 text-caption font-bold text-ink-soft hover:bg-surface-muted disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => onConfirm(note)}
            disabled={submitting}
            className="h-10 rounded-full bg-primary-600 px-6 text-caption font-bold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {submitting ? "처리 중..." : "반려"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
