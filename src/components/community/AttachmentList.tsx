import type { NoticeAttachment } from "@/types/notice";
import { formatFileSize } from "@/utils/date";

interface AttachmentListProps {
  attachments: NoticeAttachment[];
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  return (
    <section aria-label="첨부파일" className="border-t border-line-soft py-6 lg:py-[28px]">
      <h3 className="text-caption font-extrabold text-ink-soft">첨부파일 {attachments.length}</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {attachments.map((file) => (
          <li key={file.id}>
            <a
              href={file.url}
              download={file.fileName}
              className="group inline-flex min-h-[44px] max-w-full items-center gap-3 rounded-full bg-primary-50 px-5 text-body text-ink hover:bg-primary-100"
            >
              <DownloadIcon />
              <span className="truncate font-bold group-hover:text-primary-700">{file.fileName}</span>
              <span className="shrink-0 text-caption text-ink-muted">{formatFileSize(file.size)}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-primary-600">
      <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
