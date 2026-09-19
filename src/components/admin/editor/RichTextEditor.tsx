"use client";

import { EditorContent, useEditor, type Editor, type JSONContent } from "@tiptap/react";
import { useRef, useState } from "react";
import { EditorToolbar } from "@/components/admin/editor/EditorToolbar";
import { uploadFile } from "@/lib/client/upload";
import { createRichTextExtensions } from "@/lib/richText/extensions";

interface RichTextEditorProps {
  initialContent?: JSONContent;
  onChange: (content: JSONContent) => void;
  onError: (message: string) => void;
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export function RichTextEditor({ initialContent, onChange, onError }: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);
  const editorRef = useRef<Editor | null>(null);

  /** position이 없으면 현재 커서 위치에, 있으면(드롭) 그 위치에 삽입한다. */
  const insertImage = async (file: File, position?: number) => {
    const editor = editorRef.current;
    if (!editor) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      onError("JPG, PNG, GIF, WEBP 이미지만 삽입할 수 있습니다.");
      return;
    }
    setUploading(true);
    try {
      const uploaded = await uploadFile(file, "editor");
      const image = { type: "image", attrs: { src: uploaded.url, alt: uploaded.fileName.replace(/\.[^.]+$/, "") } };
      const chain = editor.chain().focus();
      (position === undefined ? chain.insertContent(image) : chain.insertContentAt(position, image)).run();
    } catch (error) {
      onError(error instanceof Error ? error.message : "이미지를 업로드하지 못했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const editor = useEditor({
    extensions: createRichTextExtensions(),
    content: initialContent ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "rich-text min-h-[420px] px-6 py-6 text-[16px] text-ink-soft focus:outline-none lg:px-10 lg:py-8",
        "aria-label": "공지 본문",
      },
      handlePaste: (_view, event) => {
        const file = Array.from(event.clipboardData?.files ?? []).find((item) => item.type.startsWith("image/"));
        if (!file) return false;
        void insertImage(file);
        return true;
      },
      handleDrop: (view, event) => {
        const file = Array.from(event.dataTransfer?.files ?? []).find((item) => item.type.startsWith("image/"));
        if (!file) return false;
        event.preventDefault();
        const position = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        void insertImage(file, position);
        return true;
      },
    },
    onCreate: ({ editor: created }) => {
      editorRef.current = created;
    },
    onUpdate: ({ editor: updated }) => onChange(updated.getJSON()),
  });

  if (!editor) {
    return <div className="h-[480px] animate-pulse rounded-b-[20px] bg-primary-50/40" aria-hidden="true" />;
  }

  return (
    <div>
      <EditorToolbar editor={editor} onInsertImage={(file) => insertImage(file)} uploadingImage={uploading} />
      <EditorContent editor={editor} />
      {uploading && (
        <p role="status" className="px-6 pb-4 text-caption font-bold text-primary-600 lg:px-10">
          이미지를 업로드하는 중입니다...
        </p>
      )}
    </div>
  );
}
