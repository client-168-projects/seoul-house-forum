import type { CSSProperties } from "react";
import type { AgendaRow, AgendaSlot } from "@/types/program";
import { AgendaContentView } from "@/components/program/AgendaContentView";
import { cn } from "@/utils/cn";

interface AgendaTableProps {
  rows: AgendaRow[];
}

function SlotTime({ slot }: { slot: AgendaSlot }) {
  return (
    <p className="text-caption text-ink-muted">
      <span className="lg:block">{slot.timeRange}</span>
      {slot.duration && <span className="ml-1 lg:ml-0 lg:block">({slot.duration})</span>}
    </p>
  );
}

function SingleSlotRow({ row }: { row: AgendaRow }) {
  const [slot] = row.slots;
  return (
    <div
      className={cn(
        "grid gap-2 py-6 lg:grid-cols-[17%_16%_1fr] lg:gap-0 lg:py-9",
        slot.content.kind === "session" ? "lg:items-start" : "lg:items-center",
      )}
    >
      <SlotTime slot={slot} />
      <p className="text-body font-bold text-primary-800">{row.label}</p>
      <AgendaContentView content={slot.content} />
    </div>
  );
}

/**
 * 토론 및 질의처럼 한 구분 아래 여러 시간대가 묶인 행.
 * 데스크톱에서는 구분명이 전체 슬롯 높이에 걸치고, 각 슬롯은 점선으로 나뉜다.
 */
function GroupedSlotRow({ row }: { row: AgendaRow }) {
  const slotCountStyle = { "--slot-count": row.slots.length } as CSSProperties;
  return (
    <div className="grid py-6 lg:grid-cols-[17%_10%_16%_1fr] lg:py-0">
      <p
        className="text-body font-bold text-primary-800 lg:col-start-2 lg:row-start-1 lg:flex lg:items-center lg:text-center lg:[grid-row-end:span_var(--slot-count)]"
        style={slotCountStyle}
      >
        <span className="lg:w-[2.5em]">{row.label}</span>
      </p>
      {row.slots.map((slot, index) => {
        const slotRowStyle = { "--slot-row": index + 1 } as CSSProperties;
        const isFollowingSlot = index > 0;
        return (
          <div key={slot.timeRange} className="contents">
            <div
              className={cn(
                "mt-4 lg:col-start-1 lg:mt-0 lg:[grid-row:var(--slot-row)]",
                isFollowingSlot && "border-t border-dotted border-line pt-5 lg:border-0 lg:pt-0",
              )}
              style={slotRowStyle}
            >
              <div className={cn("lg:w-[60%] lg:py-9", isFollowingSlot && "lg:border-t lg:border-dotted lg:border-line")}>
                <SlotTime slot={slot} />
              </div>
            </div>
            <div
              className={cn(
                "mt-2 grid gap-2 lg:col-span-2 lg:col-start-3 lg:mt-0 lg:grid-cols-subgrid lg:gap-0 lg:py-9 lg:[grid-row:var(--slot-row)]",
                isFollowingSlot && "lg:border-t lg:border-dotted lg:border-line",
              )}
              style={slotRowStyle}
            >
              <p className="text-body font-bold text-primary-800 lg:self-center">{slot.subLabel}</p>
              <AgendaContentView content={slot.content} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AgendaTable({ rows }: AgendaTableProps) {
  return (
    <ol className="mt-10 border-y border-ink lg:mt-[38px]">
      {rows.map((row, index) => (
        <li
          key={row.label}
          className={cn(
            index > 0 && "border-t border-line",
            row.highlighted && "bg-primary-50",
          )}
        >
          {row.slots.length > 1 ? <GroupedSlotRow row={row} /> : <SingleSlotRow row={row} />}
        </li>
      ))}
    </ol>
  );
}
