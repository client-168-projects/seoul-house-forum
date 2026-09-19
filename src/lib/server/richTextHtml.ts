import "server-only";
import type { JSONContent } from "@tiptap/react";
import { renderToHTMLString } from "@tiptap/static-renderer";
import { createRichTextExtensions } from "@/lib/richText/extensions";
import { sanitizeRichText } from "@/lib/richText/sanitize";

/**
 * 저장 시점에 이미 정리된 JSON이지만, 렌더링 직전에도 한 번 더 화이트리스트를 거친다.
 * static-renderer는 스키마에 정의된 노드만 출력하고 텍스트/속성을 이스케이프한다.
 */
export function renderRichText(content: JSONContent): string {
  const safe = sanitizeRichText(content);
  if (!safe) return "";
  return renderToHTMLString({ extensions: createRichTextExtensions(), content: safe });
}
