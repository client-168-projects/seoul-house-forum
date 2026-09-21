"use client";

import { useEffect, useRef, useState } from "react";
import { OpinionConsentDialog } from "@/components/community/OpinionConsentDialog";
import {
  AUTHOR_MAX_LENGTH,
  BOARD_COOLDOWN_SECONDS,
  OPINION_MAX_LENGTH,
  OPINION_MIN_LENGTH,
  SEOUL_DISTRICTS,
} from "@/constants/board";
import { BOARD_REVIEW_NOTICE } from "@/constants/boardPolicy";
import { useCooldown } from "@/hooks/useCooldown";
import { cn } from "@/utils/cn";

interface OpinionFormProps {
  turnstileSiteKey: string;
}

type Feedback = { tone: "success" | "error"; message: string } | null;

const COOLDOWN_STORAGE_KEY = "shf-board-cooldown-until";

export function OpinionForm({ turnstileSiteKey }: OpinionFormProps) {
  const [content, setContent] = useState("");
  const [district, setDistrict] = useState("");
  const [author, setAuthor] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeRules, setAgreeRules] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const startedAtRef = useRef(0);
  const cooldown = useCooldown(COOLDOWN_STORAGE_KEY);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const validate = (): string | null => {
    const trimmed = content.trim();
    if (trimmed.length < OPINION_MIN_LENGTH)
      return `의견을 ${OPINION_MIN_LENGTH}자 이상 입력해 주세요.`;
    if (!district) return "지역구를 선택해 주세요.";
    if (!author.trim()) return "이름(닉네임)을 입력해 주세요.";
    return null;
  };

  const openConsent = () => {
    if (cooldown.isCoolingDown) return;
    const error = validate();
    if (error) {
      setFeedback({ tone: "error", message: error });
      return;
    }
    setFeedback(null);
    setDialogError(null);
    setDialogOpen(true);
  };

  const closeConsent = () => {
    if (submitting) return;
    setDialogOpen(false);
    setTurnstileToken(null);
  };

  const submit = async () => {
    if (!agreePrivacy || !agreeRules || !turnstileToken || submitting) return;
    setSubmitting(true);
    setDialogError(null);

    try {
      const response = await fetch("/api/board", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          content,
          district,
          author,
          website: honeypot,
          elapsedMs: Date.now() - startedAtRef.current,
          agreePrivacy,
          agreeRules,
          turnstileToken,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        retryAfterSeconds?: number;
      };

      if (response.status === 202) {
        setDialogOpen(false);
        setContent("");
        setAgreePrivacy(false);
        setAgreeRules(false);
        setTurnstileToken(null);
        startedAtRef.current = Date.now();
        cooldown.start(BOARD_COOLDOWN_SECONDS);
        setFeedback({
          tone: "success",
          message: `의견이 접수되었습니다. ${BOARD_REVIEW_NOTICE}`,
        });
        return;
      }

      if (response.status === 429 && result.retryAfterSeconds)
        cooldown.start(result.retryAfterSeconds);
      setDialogError(
        result.message ??
          "의견을 등록하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
      setTurnstileResetSignal((value) => value + 1);
    } catch {
      setDialogError(
        "네트워크 오류로 등록하지 못했습니다. 연결 상태를 확인하고 다시 시도해 주세요.",
      );
      setTurnstileResetSignal((value) => value + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const buttonLabel = cooldown.isCoolingDown
    ? `${cooldown.remainingSeconds}초 후 재등록 가능`
    : "의견 남기기";

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          openConsent();
        }}
      >
        <div className="flex min-h-[200px] flex-col rounded-[16px] bg-white p-5 shadow-[0_8px_24px_rgba(51,12,83,0.18)] sm:min-h-[216px] lg:p-6">
          <label htmlFor="opinion-content" className="sr-only">
            의견
          </label>
          <textarea
            id="opinion-content"
            name="content"
            value={content}
            onChange={(event) =>
              setContent(event.target.value.slice(0, OPINION_MAX_LENGTH))
            }
            maxLength={OPINION_MAX_LENGTH}
            placeholder={`의견을 입력해주세요. (최대 ${OPINION_MAX_LENGTH}자)`}
            className="min-h-[96px] flex-1 resize-none text-body text-ink placeholder:text-ink-muted focus:outline-none"
          />
          <p
            className="text-right text-caption text-ink-muted"
            aria-live="polite"
          >
            {content.length}/{OPINION_MAX_LENGTH}
          </p>

          {/* 사람에게는 보이지 않는 허니팟. 값이 채워지면 서버가 봇으로 판단한다. */}
          <div
            aria-hidden="true"
            className="absolute -left-[9999px] h-px w-px overflow-hidden"
          >
            <label htmlFor="opinion-website">웹사이트</label>
            <input
              id="opinion-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label htmlFor="opinion-district" className="sr-only">
              지역구
            </label>
            <div className="relative">
              <select
                id="opinion-district"
                name="district"
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
                className="h-10 w-[118px] appearance-none rounded-full border border-primary-300 bg-white pr-9 pl-4 text-caption font-bold text-ink sm:w-[128px]"
              >
                <option value="" disabled>
                  지역구
                </option>
                {SEOUL_DISTRICTS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon />
            </div>

            <label htmlFor="opinion-author" className="sr-only">
              이름(닉네임)
            </label>
            <input
              id="opinion-author"
              name="author"
              type="text"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              maxLength={AUTHOR_MAX_LENGTH}
              placeholder="닉네임"
              autoComplete="nickname"
              className="h-10 w-[100px] rounded-full border border-primary-300 px-4 text-caption text-ink placeholder:text-ink-muted sm:w-[120px]"
            />

            {/* 태블릿/PC: 카드 안 오른쪽 */}
            <SubmitButton
              label={buttonLabel}
              coolingDown={cooldown.isCoolingDown}
              className="ml-auto hidden h-10 px-5 sm:inline-flex"
              idleClassName="bg-primary-600 text-white hover:bg-primary-700"
            />
          </div>
        </div>

        {/* 모바일: M02 시안처럼 카드 밖 전체 폭 라임 버튼 */}
        <SubmitButton
          label={buttonLabel}
          coolingDown={cooldown.isCoolingDown}
          className="mt-3 flex h-12 w-full shadow-[0_6px_16px_rgba(51,12,83,0.25)] sm:hidden"
          idleClassName="bg-accent text-accent-ink hover:brightness-95"
        />
      </form>

      {feedback && (
        <p
          role={feedback.tone === "error" ? "alert" : "status"}
          className={cn(
            "mt-3 rounded-[12px] px-4 py-3 text-caption font-bold",
            feedback.tone === "success"
              ? "bg-accent text-accent-ink"
              : "bg-white text-note-pink-ink",
          )}
        >
          {feedback.message}
        </p>
      )}

      <OpinionConsentDialog
        open={dialogOpen}
        siteKey={turnstileSiteKey}
        agreePrivacy={agreePrivacy}
        agreeRules={agreeRules}
        onAgreePrivacyChange={setAgreePrivacy}
        onAgreeRulesChange={setAgreeRules}
        onToken={setTurnstileToken}
        turnstileResetSignal={turnstileResetSignal}
        canSubmit={agreePrivacy && agreeRules && Boolean(turnstileToken)}
        submitting={submitting}
        errorMessage={dialogError}
        onSubmit={submit}
        onClose={closeConsent}
      />
    </div>
  );
}

/** 화면 폭에 따라 한 번에 하나만 보이는 등록 버튼. 둘 다 같은 폼을 제출한다. */
function SubmitButton({
  label,
  coolingDown,
  className,
  idleClassName,
}: {
  label: string;
  coolingDown: boolean;
  className: string;
  idleClassName: string;
}) {
  return (
    <button
      type="submit"
      disabled={coolingDown}
      className={cn(
        "items-center justify-center gap-1.5 rounded-full text-caption font-bold transition-colors",
        className,
        coolingDown
          ? "cursor-not-allowed bg-primary-300 text-white tabular-nums"
          : idleClassName,
      )}
    >
      {label}
      {!coolingDown && <PencilIcon />}
    </button>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-ink"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 20h16M14.5 5.5l4 4M6 18l1-4.5L16.5 4a1.4 1.4 0 012 0l1.5 1.5a1.4 1.4 0 010 2L10.5 17 6 18z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
