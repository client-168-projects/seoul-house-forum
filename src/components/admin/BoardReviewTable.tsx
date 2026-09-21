"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { BoardStatusBadge } from "@/components/admin/BoardStatusBadge";
import { RejectReasonDialog } from "@/components/admin/RejectReasonDialog";
import { adminFetch } from "@/lib/client/adminApi";
import type { AdminBoardPost, BoardPostStatus } from "@/types/board";
import { cn } from "@/utils/cn";
import { formatDateTime } from "@/utils/date";

interface BoardReviewTableProps {
  posts: AdminBoardPost[];
  total: number;
}

type Action = { kind: "status"; status: BoardPostStatus; note?: string } | { kind: "delete" };

export function BoardReviewTable({ posts, total }: BoardReviewTableProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  // 반려는 사유 입력 창을 거치므로 대상 id를 잠시 들고 있는다.
  const [rejectTargets, setRejectTargets] = useState<number[] | null>(null);

  const allSelected = posts.length > 0 && selected.size === posts.length;

  const toggle = (id: number) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const run = async (ids: number[], action: Action) => {
    if (ids.length === 0 || busy) return;
    if (action.kind === "delete" && !window.confirm(`선택한 의견 ${ids.length}건을 삭제할까요? 삭제하면 되돌릴 수 없습니다.`)) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await adminFetch("/api/admin/board", {
        method: action.kind === "delete" ? "DELETE" : "PATCH",
        body: JSON.stringify(
          action.kind === "delete" ? { ids } : { ids, status: action.status, note: action.note },
        ),
      });
      setSelected(new Set());
      setRejectTargets(null);
      startTransition(() => router.refresh());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "처리하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const selectedIds = [...selected];

  return (
    <section className="mt-6 overflow-hidden rounded-[20px] bg-white ring-1 ring-primary-100">
      <div
        className={cn(
          "flex min-h-[60px] flex-wrap items-center justify-between gap-3 border-b border-primary-100 px-5 py-3 transition-colors",
          selected.size > 0 && "bg-primary-950 text-white",
        )}
      >
        <p className="text-caption font-bold" aria-live="polite">
          {selected.size > 0 ? `${selected.size}건 선택됨` : `총 ${total.toLocaleString()}건`}
        </p>
        {selected.size > 0 && (
          <div className="flex flex-wrap gap-2">
            <BulkButton onClick={() => run(selectedIds, { kind: "status", status: "approved" })} disabled={busy} tone="accent">
              선택 승인
            </BulkButton>
            <BulkButton onClick={() => setRejectTargets(selectedIds)} disabled={busy} tone="ghost">
              선택 반려
            </BulkButton>
            <BulkButton onClick={() => run(selectedIds, { kind: "delete" })} disabled={busy} tone="danger">
              삭제
            </BulkButton>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="border-b border-primary-100 bg-note-pink px-5 py-3 text-caption font-bold text-note-pink-ink">
          {error}
        </p>
      )}

      <RejectReasonDialog
        open={rejectTargets !== null}
        count={rejectTargets?.length ?? 0}
        submitting={busy}
        onConfirm={(note) => rejectTargets && run(rejectTargets, { kind: "status", status: "rejected", note })}
        onClose={() => setRejectTargets(null)}
      />

      {posts.length === 0 ? (
        <p className="px-5 py-20 text-center text-body text-ink-muted">해당 조건의 의견이 없습니다.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-caption">
            <thead className="bg-admin-canvas/60 text-[12px] font-bold text-ink-muted">
              <tr>
                <th scope="col" className="w-12 py-3 pl-5">
                  <input
                    type="checkbox"
                    aria-label="현재 페이지 전체 선택"
                    checked={allSelected}
                    onChange={() => setSelected(allSelected ? new Set() : new Set(posts.map((post) => post.id)))}
                    className="h-4 w-4 accent-primary-600"
                  />
                </th>
                <th scope="col" className="w-16 py-3">번호</th>
                <th scope="col" className="py-3">의견</th>
                <th scope="col" className="w-36 py-3">작성자 · 지역</th>
                <th scope="col" className="w-40 py-3">IP</th>
                <th scope="col" className="w-36 py-3">등록일</th>
                <th scope="col" className="w-24 py-3">상태</th>
                <th scope="col" className="w-[176px] py-3 pr-5 text-right">관리</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className={cn(
                    "border-t border-primary-50 align-top transition-colors hover:bg-primary-50/50",
                    selected.has(post.id) && "bg-primary-50",
                  )}
                >
                  <td className="py-4 pl-5">
                    <input
                      type="checkbox"
                      aria-label={`${post.id}번 의견 선택`}
                      checked={selected.has(post.id)}
                      onChange={() => toggle(post.id)}
                      className="h-4 w-4 accent-primary-600"
                    />
                  </td>
                  <td className="py-4 text-ink-muted tabular-nums">{post.id}</td>
                  <td className="py-4 pr-6">
                    <p className="text-body leading-relaxed text-ink">{post.content}</p>
                    {post.reviewNote && (
                      <p className="mt-1.5 text-[12px] text-ink-muted">반려 사유: {post.reviewNote}</p>
                    )}
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-ink" title={post.authorFullName ? `공개 표시: ${post.author}` : undefined}>
                      {post.authorFullName ?? post.author}
                    </p>
                    <p className="text-ink-muted">{post.district}</p>
                  </td>
                  <td className="py-4">
                    {post.ip ? (
                      <span className="font-mono text-[12px] text-ink-soft" title={post.userAgent ?? undefined}>
                        {post.ip}
                      </span>
                    ) : (
                      <span className="text-[12px] text-ink-muted">파기됨</span>
                    )}
                  </td>
                  <td className="py-4 text-ink-soft tabular-nums">{formatDateTime(post.createdAt)}</td>
                  <td className="py-4">
                    <BoardStatusBadge status={post.status} />
                  </td>
                  <td className="py-4 pr-5">
                    <div className="flex justify-end gap-1.5">
                      {post.status !== "approved" && (
                        <RowButton onClick={() => run([post.id], { kind: "status", status: "approved" })} disabled={busy} primary>
                          승인
                        </RowButton>
                      )}
                      {post.status !== "rejected" && (
                        <RowButton onClick={() => setRejectTargets([post.id])} disabled={busy}>
                          반려
                        </RowButton>
                      )}
                      <RowButton onClick={() => run([post.id], { kind: "delete" })} disabled={busy} danger>
                        삭제
                      </RowButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function BulkButton({
  tone,
  children,
  ...props
}: { tone: "accent" | "ghost" | "danger" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "h-9 rounded-full px-4 text-caption font-bold transition-colors disabled:opacity-50",
        tone === "accent" && "bg-accent text-accent-ink hover:brightness-95",
        tone === "ghost" && "border border-white/30 text-white hover:bg-white/10",
        tone === "danger" && "text-[#ffb4c8] hover:bg-white/10",
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function RowButton({
  primary,
  danger,
  children,
  ...props
}: { primary?: boolean; danger?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "h-9 rounded-[10px] px-3 text-caption font-bold transition-colors disabled:opacity-50",
        primary && "bg-primary-600 text-white hover:bg-primary-700",
        !primary && !danger && "bg-primary-50 text-primary-700 hover:bg-primary-100",
        danger && "text-[#c2255c] hover:bg-note-pink",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
