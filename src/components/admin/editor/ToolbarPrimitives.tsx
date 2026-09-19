"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { EditorIcon, type EditorIconName } from "@/components/admin/editor/EditorIcon";
import { useDismiss } from "@/hooks/useDismiss";
import { cn } from "@/utils/cn";

interface ToolbarButtonProps {
  icon: EditorIconName;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

/** onMouseDown 기본 동작을 막아 버튼 클릭 시 에디터 선택 영역이 풀리지 않게 한다. */
export function ToolbarButton({ icon, label, active, disabled, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-[8px] transition-colors disabled:opacity-35",
        active ? "bg-primary-950 text-accent" : "text-ink-soft hover:bg-primary-50 hover:text-primary-950",
      )}
    >
      <EditorIcon name={icon} />
    </button>
  );
}

export function ToolbarDivider() {
  return <span aria-hidden="true" className="mx-1 h-6 w-px bg-primary-100" />;
}

interface ToolbarPopoverProps {
  label: string;
  /** 트리거 버튼 안에 그릴 내용(아이콘 + 현재 값 표시 등) */
  trigger: ReactNode;
  active?: boolean;
  children: (close: () => void) => ReactNode;
  align?: "left" | "right";
}

export function ToolbarPopover({ label, trigger, active, children, align = "left" }: ToolbarPopoverProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(containerRef, open, close);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        title={label}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex h-9 items-center gap-0.5 rounded-[8px] px-1.5 transition-colors",
          open || active ? "bg-primary-50 text-primary-950" : "text-ink-soft hover:bg-primary-50 hover:text-primary-950",
        )}
      >
        {trigger}
        <EditorIcon name="chevron" size={12} />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label={label}
          className={cn(
            "absolute top-[calc(100%+6px)] z-30 rounded-[14px] bg-white p-3 shadow-[0_12px_32px_rgba(51,12,83,0.18)] ring-1 ring-primary-100",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}
