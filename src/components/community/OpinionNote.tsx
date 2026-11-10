import { NOTE_TONE_CLASSES } from "@/components/community/noteTones";
import type { OpinionPost } from "@/types/board";
import { cn } from "@/utils/cn";
import { formatRelative } from "@/utils/date";
import { getNoteTone } from "@/utils/noteTone";

interface OpinionNoteProps {
  post: OpinionPost;
}

/** 기울기와 클릭은 감싸는 버튼이 담당하므로, 버튼 안에 들어갈 수 있게 span(phrasing) 요소로만 구성한다. */
export function OpinionNote({ post }: OpinionNoteProps) {
  const tone = NOTE_TONE_CLASSES[getNoteTone(post.id)];

  return (
    <span
      className={cn(
        "mx-auto flex w-full max-w-[280px] flex-col gap-4 rounded-[16px] border p-4 text-left shadow-[0_4px_4px_rgba(0,0,0,0.25)] sm:gap-6 sm:rounded-[20px] sm:p-6 lg:gap-8 lg:rounded-[24px] lg:p-8",
        tone.paper,
      )}
    >
      <span className="line-clamp-3 text-[14px] leading-[1.5] font-extrabold break-all text-ink sm:text-[17px] lg:text-[20px]">{post.content}</span>

      <span className={cn("block text-[12px] leading-snug sm:text-body", tone.ink)}>
        <span className="block font-bold">{post.district}</span>
        {/* 상대 시간은 서버/브라우저 렌더 시각 차이로 달라질 수 있다. */}
        <span className="block" suppressHydrationWarning>
          {post.author} {formatRelative(post.createdAt)}
        </span>
      </span>
    </span>
  );
}
