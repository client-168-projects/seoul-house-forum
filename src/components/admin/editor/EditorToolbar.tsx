"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import { useRef } from "react";
import { ColorPalette } from "@/components/admin/editor/ColorPalette";
import { EditorIcon } from "@/components/admin/editor/EditorIcon";
import { LinkForm } from "@/components/admin/editor/LinkForm";
import { ToolbarButton, ToolbarDivider, ToolbarPopover } from "@/components/admin/editor/ToolbarPrimitives";
import { BRAND_COLORS, EDITOR_FONT_SIZES, HIGHLIGHT_COLORS, TEXT_COLOR_ROWS } from "@/constants/editor";
import { cn } from "@/utils/cn";

interface EditorToolbarProps {
  editor: Editor;
  onInsertImage: (file: File) => void;
  uploadingImage: boolean;
}

const BLOCK_TYPES = [
  { label: "본문", level: 0 },
  { label: "제목 1", level: 2 },
  { label: "제목 2", level: 3 },
  { label: "제목 3", level: 4 },
] as const;

const ALIGNMENTS = [
  { value: "left", icon: "alignLeft", label: "왼쪽 정렬" },
  { value: "center", icon: "alignCenter", label: "가운데 정렬" },
  { value: "right", icon: "alignRight", label: "오른쪽 정렬" },
  { value: "justify", icon: "alignJustify", label: "양쪽 정렬" },
] as const;

export function EditorToolbar({ editor, onInsertImage, uploadingImage }: EditorToolbarProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      canUndo: current.can().undo(),
      canRedo: current.can().redo(),
      bold: current.isActive("bold"),
      italic: current.isActive("italic"),
      underline: current.isActive("underline"),
      strike: current.isActive("strike"),
      code: current.isActive("code"),
      bulletList: current.isActive("bulletList"),
      orderedList: current.isActive("orderedList"),
      blockquote: current.isActive("blockquote"),
      codeBlock: current.isActive("codeBlock"),
      link: current.isActive("link"),
      linkHref: (current.getAttributes("link").href as string | undefined) ?? "",
      headingLevel: ([2, 3, 4] as const).find((level) => current.isActive("heading", { level })) ?? 0,
      align: (["center", "right", "justify"] as const).find((value) => current.isActive({ textAlign: value })) ?? "left",
      color: (current.getAttributes("textStyle").color as string | undefined) ?? null,
      fontSize: (current.getAttributes("textStyle").fontSize as string | undefined) ?? null,
      highlight: (current.getAttributes("highlight").color as string | undefined) ?? null,
      highlightActive: current.isActive("highlight"),
    }),
  });

  const chain = () => editor.chain().focus();
  const blockLabel = BLOCK_TYPES.find((type) => type.level === state.headingLevel)?.label ?? "본문";

  return (
    <div
      role="toolbar"
      aria-label="서식 도구"
      className="sticky top-14 z-20 flex flex-wrap items-center gap-0.5 border-b border-primary-100 bg-white/95 px-2 py-1.5 backdrop-blur lg:top-0"
    >
      <ToolbarButton icon="undo" label="실행 취소" disabled={!state.canUndo} onClick={() => chain().undo().run()} />
      <ToolbarButton icon="redo" label="다시 실행" disabled={!state.canRedo} onClick={() => chain().redo().run()} />
      <ToolbarDivider />

      <ToolbarPopover label="문단 형식" trigger={<span className="w-[52px] text-left text-caption font-bold">{blockLabel}</span>}>
        {(close) => (
          <ul className="flex w-[160px] flex-col">
            {BLOCK_TYPES.map((type) => (
              <li key={type.level}>
                <button
                  type="button"
                  onClick={() => {
                    if (type.level === 0) chain().setParagraph().run();
                    else chain().setHeading({ level: type.level }).run();
                    close();
                  }}
                  className={cn(
                    "w-full rounded-[8px] px-3 py-2 text-left hover:bg-primary-50",
                    type.level === state.headingLevel && "bg-primary-50 text-primary-700",
                    type.level === 0 && "text-body",
                    type.level === 2 && "text-[20px] font-extrabold",
                    type.level === 3 && "text-[17px] font-extrabold",
                    type.level === 4 && "text-[15px] font-bold",
                  )}
                >
                  {type.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </ToolbarPopover>

      <ToolbarPopover
        label="글자 크기"
        active={Boolean(state.fontSize)}
        trigger={<span className="w-[38px] text-center text-caption font-bold tabular-nums">{state.fontSize ?? "크기"}</span>}
      >
        {(close) => (
          <div className="grid w-[168px] grid-cols-2 gap-1">
            {EDITOR_FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  chain().setFontSize(`${size}px`).run();
                  close();
                }}
                className={cn(
                  "h-9 rounded-[8px] text-caption font-bold tabular-nums hover:bg-primary-50",
                  state.fontSize === `${size}px` && "bg-primary-950 text-accent hover:bg-primary-950",
                )}
              >
                {size}px
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                chain().unsetFontSize().run();
                close();
              }}
              className="col-span-2 h-8 rounded-[8px] text-[12px] font-bold text-ink-muted hover:bg-surface-muted"
            >
              기본 크기
            </button>
          </div>
        )}
      </ToolbarPopover>
      <ToolbarDivider />

      <ToolbarButton icon="bold" label="굵게 (Ctrl+B)" active={state.bold} onClick={() => chain().toggleBold().run()} />
      <ToolbarButton icon="italic" label="기울임 (Ctrl+I)" active={state.italic} onClick={() => chain().toggleItalic().run()} />
      <ToolbarButton icon="underline" label="밑줄 (Ctrl+U)" active={state.underline} onClick={() => chain().toggleUnderline().run()} />
      <ToolbarButton icon="strike" label="취소선" active={state.strike} onClick={() => chain().toggleStrike().run()} />

      <ToolbarPopover
        label="글자 색"
        active={Boolean(state.color)}
        trigger={
          <span className="flex flex-col items-center">
            <EditorIcon name="textColor" size={16} />
            <span className="-mt-0.5 h-[3px] w-4 rounded-full" style={{ backgroundColor: state.color ?? "#181818" }} />
          </span>
        }
      >
        {(close) => (
          <ColorPalette
            rows={TEXT_COLOR_ROWS}
            brandColors={BRAND_COLORS}
            current={state.color}
            onPick={(color) => {
              chain().setColor(color).run();
              close();
            }}
            onReset={() => {
              chain().unsetColor().run();
              close();
            }}
            resetLabel="기본 글자 색"
          />
        )}
      </ToolbarPopover>

      <ToolbarPopover
        label="형광펜(글자 배경색)"
        active={state.highlightActive}
        trigger={
          <span className="flex flex-col items-center">
            <EditorIcon name="highlight" size={16} />
            <span className="-mt-0.5 h-[3px] w-4 rounded-full" style={{ backgroundColor: state.highlight ?? "#fff3a3" }} />
          </span>
        }
      >
        {(close) => (
          <ColorPalette
            rows={[HIGHLIGHT_COLORS.slice(0, 10), HIGHLIGHT_COLORS.slice(10)]}
            current={state.highlight}
            onPick={(color) => {
              chain().setHighlight({ color }).run();
              close();
            }}
            onReset={() => {
              chain().unsetHighlight().run();
              close();
            }}
            resetLabel="형광펜 지우기"
          />
        )}
      </ToolbarPopover>
      <ToolbarDivider />

      {ALIGNMENTS.map((alignment) => (
        <ToolbarButton
          key={alignment.value}
          icon={alignment.icon}
          label={alignment.label}
          active={state.align === alignment.value}
          onClick={() => chain().setTextAlign(alignment.value).run()}
        />
      ))}
      <ToolbarDivider />

      <ToolbarButton icon="bulletList" label="글머리 기호 목록" active={state.bulletList} onClick={() => chain().toggleBulletList().run()} />
      <ToolbarButton icon="orderedList" label="번호 목록" active={state.orderedList} onClick={() => chain().toggleOrderedList().run()} />
      <ToolbarButton icon="quote" label="인용" active={state.blockquote} onClick={() => chain().toggleBlockquote().run()} />
      <ToolbarButton icon="code" label="코드 블록" active={state.codeBlock} onClick={() => chain().toggleCodeBlock().run()} />
      <ToolbarButton icon="divider" label="구분선" onClick={() => chain().setHorizontalRule().run()} />
      <ToolbarDivider />

      <ToolbarPopover label="링크" active={state.link} trigger={<EditorIcon name="link" />} align="right">
        {(close) => (
          <LinkForm
            initialHref={state.linkHref}
            onApply={(href) => {
              chain().extendMarkRange("link").setLink({ href }).run();
              close();
            }}
            onRemove={() => {
              chain().extendMarkRange("link").unsetLink().run();
              close();
            }}
          />
        )}
      </ToolbarPopover>

      <ToolbarButton
        icon="image"
        label={uploadingImage ? "이미지 업로드 중" : "이미지 삽입 (커서 위치)"}
        disabled={uploadingImage}
        onClick={() => imageInputRef.current?.click()}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onInsertImage(file);
          event.target.value = "";
        }}
      />
      <ToolbarButton icon="clear" label="서식 지우기" onClick={() => chain().unsetAllMarks().clearNodes().run()} />
    </div>
  );
}
