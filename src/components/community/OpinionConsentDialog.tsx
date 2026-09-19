"use client";

import { useEffect, useId, useRef } from "react";
import { BOARD_DATA_NOTICE, BOARD_REVIEW_NOTICE, BOARD_RULES } from "@/constants/boardPolicy";
import { TurnstileWidget } from "@/components/community/TurnstileWidget";

interface OpinionConsentDialogProps {
  open: boolean;
  siteKey: string;
  agreePrivacy: boolean;
  agreeRules: boolean;
  onAgreePrivacyChange: (value: boolean) => void;
  onAgreeRulesChange: (value: boolean) => void;
  onToken: (token: string | null) => void;
  turnstileResetSignal: number;
  canSubmit: boolean;
  submitting: boolean;
  errorMessage: string | null;
  onSubmit: () => void;
  onClose: () => void;
}

/**
 * 등록 직전 단계. 수집 안내와 이용 수칙을 모두 읽고 각각 동의한 뒤,
 * 자동 입력 방지 확인까지 끝나야 등록 버튼이 활성화된다.
 */
export function OpinionConsentDialog(props: OpinionConsentDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (props.open && !dialog.open) dialog.showModal();
    if (!props.open && dialog.open) dialog.close();
  }, [props.open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={props.onClose}
      onCancel={(event) => {
        if (props.submitting) event.preventDefault();
      }}
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[560px] overflow-y-auto rounded-[20px] bg-white p-0 text-ink shadow-[0_24px_64px_rgba(51,12,83,0.35)] backdrop:bg-primary-950/60 backdrop:backdrop-blur-[2px]"
    >
      <div className="p-5 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-heading text-[19px] leading-[1.35] font-bold break-keep text-primary-950 sm:text-[22px]">
            의견 등록 전 확인해 주세요
          </h2>
          <button
            type="button"
            onClick={props.onClose}
            disabled={props.submitting}
            aria-label="닫기"
            className="-mt-1 -mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="mt-2 rounded-[10px] bg-accent/40 px-3 py-2 text-caption font-bold text-primary-950">
          {BOARD_REVIEW_NOTICE}
        </p>

        <section className="mt-5 rounded-[14px] border border-primary-200 bg-primary-50 p-4 sm:p-5">
          <h3 className="text-body font-extrabold text-primary-800">[{BOARD_DATA_NOTICE.title}]</h3>
          <dl className="mt-3 flex flex-col gap-2 text-caption">
            {BOARD_DATA_NOTICE.items.map((item) => (
              <div key={item.label} className="grid gap-0.5 sm:grid-cols-[96px_1fr] sm:gap-2">
                <dt className="font-bold text-primary-700">{item.label}</dt>
                <dd className="text-ink-soft">{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-caption text-ink-muted">※ {BOARD_DATA_NOTICE.footnote}</p>
        </section>

        <ConsentCheckbox checked={props.agreePrivacy} onChange={props.onAgreePrivacyChange} disabled={props.submitting}>
          <strong className="text-primary-700">[필수]</strong> 위 IP 주소 및 브라우저 정보 수집·이용에 동의합니다.
        </ConsentCheckbox>

        <section className="mt-6">
          <h3 className="text-body font-extrabold text-ink">이용 수칙</h3>
          <ol className="mt-2 flex list-decimal flex-col gap-1.5 pl-5 text-caption text-ink-soft marker:font-bold marker:text-primary-500">
            {BOARD_RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
        </section>

        <ConsentCheckbox checked={props.agreeRules} onChange={props.onAgreeRulesChange} disabled={props.submitting}>
          <strong className="text-primary-700">[필수]</strong> 이용 수칙을 확인했으며, 작성한 의견에 대한 책임이 본인에게 있음에 동의합니다.
        </ConsentCheckbox>

        <div className="mt-6">
          <p className="mb-2 text-caption font-bold text-ink-soft">자동 입력 방지 확인</p>
          {props.open && (
            <TurnstileWidget siteKey={props.siteKey} onToken={props.onToken} resetSignal={props.turnstileResetSignal} />
          )}
        </div>

        {props.errorMessage && (
          <p role="alert" className="mt-4 rounded-[10px] bg-note-pink px-3 py-2 text-caption font-bold text-note-pink-ink">
            {props.errorMessage}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={props.onClose}
            disabled={props.submitting}
            className="h-12 rounded-full border border-line-soft px-6 text-body font-bold text-ink-soft hover:bg-surface-muted disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={props.onSubmit}
            disabled={!props.canSubmit || props.submitting}
            aria-busy={props.submitting}
            className="h-12 rounded-full bg-primary-600 px-8 text-body font-bold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-300"
          >
            {props.submitting ? "등록 중..." : "동의하고 등록"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

function ConsentCheckbox({
  checked,
  onChange,
  disabled,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-3 flex min-h-[44px] cursor-pointer items-start gap-3 rounded-[12px] px-1 py-2 text-caption text-ink hover:bg-surface-muted">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-primary-600"
      />
      <span>{children}</span>
    </label>
  );
}
