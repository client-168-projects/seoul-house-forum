import type { JSONContent } from "@tiptap/react";

export interface NoticeAttachment {
  id: number;
  fileName: string;
  contentType: string;
  size: number;
  url: string;
}

export interface NoticeSummary {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  attachmentCount: number;
}

export interface NoticeDetail extends NoticeSummary {
  content: JSONContent;
  contentText: string;
  attachments: NoticeAttachment[];
}

/** 에디터에서 업로드를 마치고 공지 저장 요청에 함께 보내는 첨부 메타데이터 */
export interface UploadedFile {
  key: string;
  url: string;
  fileName: string;
  contentType: string;
  size: number;
}

export interface NoticeInput {
  title: string;
  content: JSONContent;
  attachments: UploadedFile[];
}
