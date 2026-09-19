"use client";

import type { JSONContent } from "@tiptap/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AttachmentUploader } from "@/components/admin/AttachmentUploader";
import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";
import { adminFetch } from "@/lib/client/adminApi";
import type { UploadedFile } from "@/types/notice";

interface NoticeEditorFormProps {
  notice?: { id: number; title: string; content: JSONContent; attachments: UploadedFile[] };
}

const TITLE_MAX_LENGTH = 150;

export function NoticeEditorForm({ notice }: NoticeEditorFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(notice?.title ?? "");
  const [content, setContent] = useState<JSONContent>(notice?.content ?? { type: "doc", content: [] });
  const [attachments, setAttachments] = useState<UploadedFile[]>(notice?.attachments ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await adminFetch(notice ? `/api/notices/${notice.id}` : "/api/notices", {
        method: notice ? "PATCH" : "POST",
        body: JSON.stringify({ title, content, attachments: attachments.map((file) => ({ key: file.key })) }),
      });
      router.push("/admin/notices");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "저장하지 못했습니다.");
      setSaving(false);
    }
  };

  return (
    <form
      className="mt-8 flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <div className="rounded-[20px] bg-white ring-1 ring-primary-100">
        <label htmlFor="notice-title" className="sr-only">
          제목
        </label>
        <input
          id="notice-title"
          value={title}
          onChange={(event) => setTitle(event.target.value.slice(0, TITLE_MAX_LENGTH))}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.preventDefault();
          }}
          placeholder="공지 제목을 입력하세요"
          maxLength={TITLE_MAX_LENGTH}
          className="h-[72px] w-full rounded-t-[20px] border-b border-primary-100 px-6 font-heading text-[22px] font-bold text-primary-950 placeholder:text-primary-200 focus:outline-none lg:px-10"
        />
        <RichTextEditor initialContent={notice?.content} onChange={setContent} onError={setError} />
      </div>

      <section className="rounded-[20px] bg-white p-6 ring-1 ring-primary-100 lg:p-8">
        <h2 className="text-body font-extrabold text-ink">
          첨부파일 <span className="text-primary-500 tabular-nums">{attachments.length}</span>
        </h2>
        <p className="mt-1 text-caption text-ink-muted">공개 공지 하단에 다운로드 목록으로 표시됩니다.</p>
        <div className="mt-4">
          <AttachmentUploader files={attachments} onChange={setAttachments} onError={setError} />
        </div>
      </section>

      {error && (
        <p role="alert" className="rounded-[12px] bg-note-pink px-4 py-3 text-caption font-bold text-note-pink-ink">
          {error}
        </p>
      )}

      <div className="sticky bottom-4 z-10 flex justify-end gap-2 rounded-full bg-white/90 p-2 shadow-[0_8px_24px_rgba(51,12,83,0.12)] ring-1 ring-primary-100 backdrop-blur">
        <Link href="/admin/notices" className="flex h-11 items-center rounded-full px-6 text-body font-bold text-ink-soft hover:bg-surface-muted">
          취소
        </Link>
        <button
          type="submit"
          disabled={saving}
          aria-busy={saving}
          className="h-11 rounded-full bg-primary-600 px-8 text-body font-bold text-white hover:bg-primary-700 disabled:cursor-wait disabled:bg-primary-400"
        >
          {saving ? "저장 중..." : notice ? "수정 저장" : "공지 등록"}
        </button>
      </div>
    </form>
  );
}
