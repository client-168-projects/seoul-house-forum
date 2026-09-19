import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Color, FontSize, TextStyle } from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import type { Extensions } from "@tiptap/react";

/**
 * 에디터(클라이언트)와 공지 본문 렌더러(서버)가 반드시 같은 스키마를 쓰도록 한 곳에서 정의한다.
 * 서버는 이 스키마에 없는 노드/마크를 렌더링하지 못하므로 임의 HTML이 끼어들 여지가 없다.
 */
export const HEADING_LEVELS = [2, 3, 4] as const;

export function createRichTextExtensions(): Extensions {
  return [
    StarterKit.configure({
      heading: { levels: [...HEADING_LEVELS] },
      link: {
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https", "mailto", "tel"],
        HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
      },
    }),
    TextStyle,
    Color,
    FontSize,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Image.configure({ inline: false, allowBase64: false }),
  ];
}
