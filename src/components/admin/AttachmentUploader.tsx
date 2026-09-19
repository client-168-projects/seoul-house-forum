"use client";

import { useRef, useState } from "react";
import { uploadFile } from "@/lib/client/upload";
import type { UploadedFile } from "@/types/notice";
import { cn } from "@/utils/cn";
import { formatFileSize } from "@/utils/date";

interface AttachmentUploaderProps {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  onError: (message: string) => void;
}

const MAX_FILES = 10;
const ACCEPT = ".pdf,.hwp,.hwpx,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.jpg,.jpeg,.png,.gif,.webp";

export function AttachmentUploader({ files, onChange, onError }: AttachmentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadingNames, setUploadingNames] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  const upload = async (selected: File[]) => {
    const room = MAX_FILES - files.length;
    if (room <= 0) {
      onError(`첨부파일은 최대 ${MAX_FILES}개까지 등록할 수 있습니다.`);
      return;
    }
    const batch = selected.slice(0, room);
    setUploadingNames(batch.map((file) => file.name));

    const uploaded: UploadedFile[] = [];
    for (const file of batch) {
      try {
        uploaded.push(await uploadFile(file, "attachments"));
      } catch (error) {
        onError(`${file.name}: ${error instanceof Error ? error.message : "업로드하지 못했습니다."}`);
      }
    }
    setUploadingNames([]);
    if (uploaded.length > 0) onChange([...files, ...uploaded]);
  };

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void upload(Array.from(event.dataTransfer.files));
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-[16px] border-2 border-dashed px-6 py-7 text-center transition-colors",
          dragging ? "border-primary-500 bg-primary-50" : "border-primary-100 bg-admin-canvas/50",
        )}
      >
        <p className="text-body font-bold text-ink-soft">파일을 끌어다 놓거나</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadingNames.length > 0}
          className="h-10 rounded-full bg-white px-5 text-caption font-bold text-primary-700 ring-1 ring-primary-200 hover:bg-primary-50 disabled:opacity-50"
        >
          파일 선택
        </button>
        <p className="text-[12px] text-ink-muted">PDF, HWP, 오피스 문서, 이미지, ZIP · 파일당 20MB · 최대 {MAX_FILES}개</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="hidden"
          onChange={(event) => {
            void upload(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
      </div>

      {(files.length > 0 || uploadingNames.length > 0) && (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((file) => (
            <li key={file.key} className="flex items-center gap-3 rounded-[12px] bg-white px-4 py-3 ring-1 ring-primary-100">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary-50 text-[11px] font-extrabold text-primary-600 uppercase">
                {file.fileName.split(".").pop()?.slice(0, 4)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-caption font-bold text-ink">{file.fileName}</p>
                <p className="text-[12px] text-ink-muted">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => onChange(files.filter((item) => item.key !== file.key))}
                aria-label={`${file.fileName} 첨부 제거`}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-note-pink hover:text-[#c2255c]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
          {uploadingNames.map((name) => (
            <li key={`uploading-${name}`} className="flex items-center gap-3 rounded-[12px] bg-white px-4 py-3 ring-1 ring-primary-100">
              <span className="h-9 w-9 shrink-0 animate-pulse rounded-[10px] bg-primary-100" aria-hidden="true" />
              <p className="truncate text-caption text-ink-muted">{name} 업로드 중...</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
