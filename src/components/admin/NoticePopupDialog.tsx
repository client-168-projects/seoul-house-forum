"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { NoticePopupPreviewDialog } from "@/components/admin/NoticePopupPreviewDialog";
import {
  DEFAULT_HIDE_DURATION_DAYS,
  HIDE_DURATION_OPTIONS,
  POPUP_IMAGE_MAX_BYTES,
  POPUP_IMAGE_MAX_DIMENSION,
  POPUP_IMAGE_TYPES,
  POPUP_SIZE_OPTIONS,
  POPUP_TARGET_URL_MAX_LENGTH,
} from "@/constants/noticePopup";
import { adminFetch } from "@/lib/client/adminApi";
import { readImageSize, resizeImageIfNeeded, trimTransparentPadding } from "@/lib/client/imageResize";
import { uploadFile } from "@/lib/client/upload";
import type { NoticePopup, NoticePopupInput, PopupSize } from "@/types/noticePopup";
import { cn } from "@/utils/cn";
import { formatFileSize } from "@/utils/date";
import { todayInKst, validateNoticePopupInput } from "@/utils/noticePopup";

interface NoticePopupDialogProps {
  /** 없으면 새 팝업 등록, 있으면 수정 */
  popup?: NoticePopup;
  onClose: () => void;
}

interface PopupImage {
  key: string;
  url: string;
  width: number;
  height: number;
}

type UploadStep = { label: string; progress: number };

const FIELD_INPUT_CLASS =
  "h-11 w-full rounded-[12px] border border-line-soft px-3 text-caption text-ink placeholder:text-ink-muted focus:border-primary-400 focus:outline-2 focus:outline-primary-100";

export function NoticePopupDialog({ popup, onClose }: NoticePopupDialogProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<PopupImage | null>(
    popup ? { key: popup.imageKey, url: popup.imageUrl, width: popup.imageWidth, height: popup.imageHeight } : null,
  );
  const [size, setSize] = useState<PopupSize>(popup?.size ?? "medium");
  const [targetUrl, setTargetUrl] = useState(popup?.targetUrl ?? "");
  const [startDate, setStartDate] = useState(popup?.startDate ?? todayInKst());
  const [endDate, setEndDate] = useState(popup?.endDate ?? "");
  const [hideDurationDays, setHideDurationDays] = useState(popup?.hideDurationDays ?? DEFAULT_HIDE_DURATION_DAYS);
  const [isHidden, setIsHidden] = useState(popup?.isHidden ?? false);

  const [uploadStep, setUploadStep] = useState<UploadStep | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"saving" | "deleting" | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const locked = uploadStep !== null || busy !== null;

  const handleImageSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);
    if (!POPUP_IMAGE_TYPES.includes(file.type)) {
      setError("PNG, JPG, WEBP, GIF 이미지만 업로드할 수 있습니다.");
      return;
    }

    try {
      setUploadStep({ label: "여백 정리 중", progress: 20 });
      const trimmed = await trimTransparentPadding(file);
      setUploadStep({ label: "이미지 처리 중", progress: 50 });
      const processed = await resizeImageIfNeeded(trimmed, POPUP_IMAGE_MAX_DIMENSION);
      if (processed.size > POPUP_IMAGE_MAX_BYTES) {
        throw new Error(`이미지는 ${formatFileSize(POPUP_IMAGE_MAX_BYTES)} 이하만 업로드할 수 있습니다.`);
      }
      const dimensions = await readImageSize(processed);
      if (!dimensions) throw new Error("이미지를 읽지 못했습니다. 다른 파일로 다시 시도해 주세요.");

      setUploadStep({ label: "업로드 중", progress: 80 });
      const uploaded = await uploadFile(processed, "popup");
      setImage({ key: uploaded.key, url: uploaded.url, ...dimensions });
      setUploadStep({ label: "완료", progress: 100 });
      window.setTimeout(() => setUploadStep(null), 300);
    } catch (uploadError) {
      setUploadStep(null);
      setError(uploadError instanceof Error ? uploadError.message : "이미지를 업로드하지 못했습니다.");
    }
  };

  const save = async () => {
    const input: NoticePopupInput = {
      imageKey: image?.key ?? "",
      imageWidth: image?.width ?? 0,
      imageHeight: image?.height ?? 0,
      targetUrl: targetUrl.trim(),
      hideDurationDays,
      startDate,
      endDate,
      isHidden,
      size,
    };
    const validationError = validateNoticePopupInput(input);
    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy("saving");
    setError(null);
    try {
      await adminFetch(popup ? `/api/admin/notice-popups/${popup.id}` : "/api/admin/notice-popups", {
        method: popup ? "PATCH" : "POST",
        body: JSON.stringify(input),
      });
      router.refresh();
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "저장하지 못했습니다.");
      setBusy(null);
    }
  };

  const remove = async () => {
    if (!popup) return;
    if (!window.confirm("이 팝업을 삭제할까요?\n이미지도 함께 삭제되며 되돌릴 수 없습니다.")) return;
    setBusy("deleting");
    try {
      await adminFetch(`/api/admin/notice-popups/${popup.id}`, { method: "DELETE" });
      router.refresh();
      onClose();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "삭제하지 못했습니다.");
      setBusy(null);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="notice-popup-dialog-title"
      onClose={onClose}
      onCancel={(event) => {
        if (locked || previewOpen) event.preventDefault();
      }}
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[560px] overflow-y-auto rounded-[18px] bg-white p-0 text-ink shadow-[0_20px_56px_rgba(51,12,83,0.3)] backdrop:bg-primary-950/50"
    >
      <div className="p-6">
        <h2 id="notice-popup-dialog-title" className="font-heading text-[19px] font-bold text-primary-950">
          {popup ? "팝업 수정" : "팝업 등록"}
        </h2>

        <div className="mt-5 flex flex-col gap-5">
          <Field label="이미지">
            {image ? (
              <div className="relative flex max-h-72 justify-center overflow-hidden rounded-[12px] bg-admin-canvas ring-1 ring-primary-100">
                <Image
                  src={image.url}
                  alt="팝업 이미지 미리보기"
                  width={image.width}
                  height={image.height}
                  sizes="512px"
                  className="h-auto max-h-72 w-auto max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-44 items-center justify-center rounded-[12px] border-2 border-dashed border-primary-100 bg-admin-canvas/50 text-caption text-ink-muted">
                업로드된 이미지가 없습니다
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={locked}
                className="h-10 rounded-full bg-white px-5 text-caption font-bold text-primary-700 ring-1 ring-primary-200 hover:bg-primary-50 disabled:opacity-50"
              >
                {image ? "이미지 교체" : "이미지 업로드"}
              </button>
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                disabled={!image || locked}
                className="h-10 rounded-full bg-white px-5 text-caption font-bold text-ink-soft ring-1 ring-line-soft hover:bg-surface-muted disabled:opacity-50"
              >
                미리보기
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept={POPUP_IMAGE_TYPES.join(",")}
                className="hidden"
                onChange={handleImageSelected}
              />
            </div>
            {uploadStep && (
              <div className="mt-3 flex items-center gap-3" role="status">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-primary-50">
                  <div
                    className="h-full rounded-full bg-primary-500 transition-[width] duration-300"
                    style={{ width: `${uploadStep.progress}%` }}
                  />
                </div>
                <span className="shrink-0 text-[12px] text-ink-muted">{uploadStep.label}</span>
              </div>
            )}
            <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
              PNG, JPG, WEBP, GIF · {formatFileSize(POPUP_IMAGE_MAX_BYTES)} 이하. 가장자리 투명 여백은 자동으로 잘리고, 가로나
              세로가 {POPUP_IMAGE_MAX_DIMENSION}px를 넘으면 자동으로 축소됩니다.
            </p>
          </Field>

          <Field label="팝업 크기" hint="너비 기준이며 높이는 이미지 비율에 맞춰 자동으로 정해집니다.">
            <OptionGroup>
              {POPUP_SIZE_OPTIONS.map((option) => (
                <OptionButton key={option.value} selected={size === option.value} onClick={() => setSize(option.value)}>
                  {option.label} ({option.widthPx}px)
                </OptionButton>
              ))}
            </OptionGroup>
          </Field>

          <Field label="이동 URL (선택)" htmlFor="popup-target-url" hint="이미지를 누르면 새 탭으로 열립니다. https://를 포함한 전체 주소를 입력해 주세요.">
            <input
              id="popup-target-url"
              type="url"
              value={targetUrl}
              onChange={(event) => setTargetUrl(event.target.value)}
              maxLength={POPUP_TARGET_URL_MAX_LENGTH}
              placeholder="https://example.com"
              className={FIELD_INPUT_CLASS}
            />
          </Field>

          <Field label="게시 기간" hint="한국 시간 기준으로 시작일 0시부터 종료일 자정까지 노출됩니다.">
            <div className="flex items-center gap-2">
              <input
                type="date"
                aria-label="게시 시작일"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => setStartDate(event.target.value)}
                className={FIELD_INPUT_CLASS}
              />
              <span aria-hidden="true" className="text-ink-muted">
                ~
              </span>
              <input
                type="date"
                aria-label="게시 종료일"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => setEndDate(event.target.value)}
                className={FIELD_INPUT_CLASS}
              />
            </div>
          </Field>

          <Field label="'다시 보지 않기' 기간">
            <OptionGroup>
              {HIDE_DURATION_OPTIONS.map((days) => (
                <OptionButton key={days} selected={hideDurationDays === days} onClick={() => setHideDurationDays(days)}>
                  {days}일
                </OptionButton>
              ))}
            </OptionGroup>
          </Field>

          <Field label="게시 상태" hint="숨김으로 두면 게시 기간과 관계없이 노출되지 않습니다.">
            <OptionGroup>
              <OptionButton selected={!isHidden} onClick={() => setIsHidden(false)}>
                게시
              </OptionButton>
              <OptionButton selected={isHidden} tone="danger" onClick={() => setIsHidden(true)}>
                숨김
              </OptionButton>
            </OptionGroup>
          </Field>

          {error && (
            <p role="alert" className="rounded-[12px] bg-note-pink px-4 py-3 text-caption font-bold text-[#c2255c]">
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
          {popup && (
            <button
              type="button"
              onClick={remove}
              disabled={locked}
              className="mr-auto h-10 rounded-full px-4 text-caption font-bold text-[#c2255c] hover:bg-note-pink disabled:opacity-50"
            >
              {busy === "deleting" ? "삭제 중..." : "삭제"}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={busy !== null}
            className="h-10 rounded-full border border-line-soft px-5 text-caption font-bold text-ink-soft hover:bg-surface-muted disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={save}
            disabled={locked}
            className="h-10 rounded-full bg-primary-600 px-6 text-caption font-bold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {busy === "saving" ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>

      {previewOpen && image && (
        <NoticePopupPreviewDialog
          popup={{
            id: popup?.id ?? -1,
            imageUrl: image.url,
            imageWidth: image.width,
            imageHeight: image.height,
            targetUrl: targetUrl.trim() || null,
            hideDurationDays,
            size,
          }}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </dialog>
  );
}

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor?: string; hint?: string; children: ReactNode }) {
  const LabelTag = htmlFor ? "label" : "p";
  return (
    <div>
      <LabelTag htmlFor={htmlFor} className="mb-2 block text-caption font-bold text-ink">
        {label}
      </LabelTag>
      {children}
      {hint && <p className="mt-2 text-[12px] text-ink-muted">{hint}</p>}
    </div>
  );
}

function OptionGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-1.5">{children}</div>;
}

function OptionButton({
  selected,
  tone = "default",
  onClick,
  children,
}: {
  selected: boolean;
  tone?: "default" | "danger";
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "h-10 rounded-full px-4 text-caption font-bold transition-colors",
        !selected && "bg-white text-ink-soft ring-1 ring-line-soft hover:bg-primary-50",
        selected && tone === "default" && "bg-primary-950 text-white",
        selected && tone === "danger" && "bg-[#c2255c] text-white",
      )}
    >
      {children}
    </button>
  );
}
