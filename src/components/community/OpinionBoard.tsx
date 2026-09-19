"use client";

import { useState, type CSSProperties } from "react";
import { OpinionNote } from "@/components/community/OpinionNote";
import { OpinionNoteModal } from "@/components/community/OpinionNoteModal";
import type { OpinionPost } from "@/types/board";
import type { Paginated } from "@/types/pagination";
import { getNoteTilt } from "@/utils/noteTilt";

interface OpinionBoardProps {
  initial: Paginated<OpinionPost>;
}

/** 첫 페이지는 서버에서 받아 바로 그리고, 이후 페이지는 더보기로 이어 붙인다. */
export function OpinionBoard({ initial }: OpinionBoardProps) {
  const [posts, setPosts] = useState(initial.items);
  const [page, setPage] = useState(initial.page);
  const [totalPages, setTotalPages] = useState(initial.totalPages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openedPost, setOpenedPost] = useState<OpinionPost | null>(null);

  const loadMore = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/board?page=${page + 1}`);
      if (!response.ok) throw new Error();
      const next = (await response.json()) as Paginated<OpinionPost>;
      setPosts((current) => {
        const seen = new Set(current.map((post) => post.id));
        return [...current, ...next.items.filter((post) => !seen.has(post.id))];
      });
      setPage(next.page);
      setTotalPages(next.totalPages);
    } catch {
      setError("의견을 더 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (posts.length === 0) {
    return (
      <p className="mt-16 rounded-[20px] border border-dashed border-white/40 px-6 py-16 text-center text-body-lg text-white/85 lg:mt-[100px]">
        아직 공개된 의견이 없습니다. 첫 번째 의견을 남겨 주세요.
      </p>
    );
  }

  return (
    <>
      <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-6 px-1 sm:mt-16 sm:gap-x-5 sm:gap-y-8 sm:px-2 lg:mt-[100px] lg:grid-cols-4 lg:gap-y-10">
        {posts.map((post) => (
          <li key={post.id}>
            {/* 평소엔 기울어져 있다가 호버/포커스 시 정 각도로 맞춰지고, 누르면 확대 모달이 열린다. */}
            <button
              type="button"
              onClick={() => setOpenedPost(post)}
              aria-haspopup="dialog"
              style={{ "--note-tilt": `${getNoteTilt(post.id)}deg` } as CSSProperties}
              className="relative block w-full rotate-(--note-tilt) cursor-pointer rounded-[16px] transition-transform sm:rounded-[20px] lg:rounded-[24px] duration-300 ease-out hover:z-10 hover:rotate-0 focus-visible:z-10 focus-visible:rotate-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transition-none"
            >
              <OpinionNote post={post} />
            </button>
          </li>
        ))}
      </ul>

      <OpinionNoteModal post={openedPost} onClose={() => setOpenedPost(null)} />

      {error && (
        <p role="alert" className="mt-8 text-center text-body font-bold text-accent">
          {error}
        </p>
      )}

      {page < totalPages && (
        <div className="mt-14 flex justify-center lg:mt-[100px]">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            aria-busy={loading}
            className="inline-flex h-12 items-center gap-1.5 rounded-full bg-primary-950 px-8 text-body font-bold text-white transition-colors hover:bg-primary-900 disabled:opacity-60"
          >
            {loading ? "불러오는 중..." : "더보기"}
            {!loading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      )}
    </>
  );
}
