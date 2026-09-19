"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";

interface ColorPaletteProps {
  rows: string[][];
  brandColors?: { name: string; value: string }[];
  current: string | null;
  onPick: (color: string) => void;
  onReset: () => void;
  resetLabel: string;
}

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function ColorPalette({ rows, brandColors, current, onPick, onReset, resetLabel }: ColorPaletteProps) {
  const [custom, setCustom] = useState(current && HEX_PATTERN.test(current) ? current : "#6c4e9d");
  const normalizedCurrent = current?.toLowerCase();

  return (
    <div className="w-[268px]">
      {brandColors && (
        <>
          <p className="mb-1.5 text-[11px] font-bold text-ink-muted">포럼 브랜드</p>
          <div className="mb-3 grid grid-cols-8 gap-1.5">
            {brandColors.map((color) => (
              <Swatch key={color.value} color={color.value} label={color.name} selected={normalizedCurrent === color.value} onPick={onPick} />
            ))}
          </div>
        </>
      )}

      <p className="mb-1.5 text-[11px] font-bold text-ink-muted">색상</p>
      <div className="flex flex-col gap-1">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={cn("grid grid-cols-10 gap-1", rowIndex === 0 && "mb-1.5")}>
            {row.map((color) => (
              <Swatch key={color} color={color} label={color} selected={normalizedCurrent === color} onPick={onPick} small />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-primary-50 pt-3">
        <label className="flex flex-1 items-center gap-2 text-[12px] font-bold text-ink-soft">
          <input
            type="color"
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
            className="h-8 w-8 cursor-pointer rounded-[6px] border border-line-soft bg-white p-0.5"
          />
          <span className="font-mono uppercase">{custom}</span>
        </label>
        <button
          type="button"
          onClick={() => onPick(custom)}
          className="h-8 rounded-[8px] bg-primary-600 px-3 text-[12px] font-bold text-white hover:bg-primary-700"
        >
          적용
        </button>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-2 h-8 w-full rounded-[8px] text-[12px] font-bold text-ink-muted hover:bg-surface-muted hover:text-ink"
      >
        {resetLabel}
      </button>
    </div>
  );
}

function Swatch({
  color,
  label,
  selected,
  onPick,
  small,
}: {
  color: string;
  label: string;
  selected: boolean;
  onPick: (color: string) => void;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={selected}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onPick(color)}
      style={{ backgroundColor: color }}
      className={cn(
        "rounded-[6px] ring-1 ring-black/10 transition-transform hover:scale-110 focus-visible:scale-110",
        small ? "h-[22px] w-[22px]" : "h-7 w-7",
        selected && "ring-2 ring-primary-950 ring-offset-1",
      )}
    />
  );
}
