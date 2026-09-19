"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/client/adminApi";

export function DeleteNoticeButton({ id, title }: { id: number; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    if (!window.confirm(`'${title}' 공지를 삭제할까요?\n첨부파일도 함께 삭제되며 되돌릴 수 없습니다.`)) return;
    setBusy(true);
    try {
      await adminFetch(`/api/notices/${id}`, { method: "DELETE" });
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "삭제하지 못했습니다.");
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={remove}
      disabled={busy}
      className="h-9 rounded-[10px] px-3 text-caption font-bold text-[#c2255c] hover:bg-note-pink disabled:opacity-50"
    >
      {busy ? "삭제 중" : "삭제"}
    </button>
  );
}
