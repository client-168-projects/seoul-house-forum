import type { JSONContent } from "@tiptap/react";
import { HEADING_LEVELS } from "@/lib/richText/extensions";

/**
 * 관리자 API로 들어온 에디터 JSON을 저장 전에 화이트리스트로 정리한다.
 * 에디터를 거치지 않고 API를 직접 호출해도 스키마 밖 노드, 위험한 URL, 임의 style 값이 저장되지 않는다.
 */
const ALLOWED_NODES = new Set([
  "doc",
  "paragraph",
  "text",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "blockquote",
  "horizontalRule",
  "hardBreak",
  "codeBlock",
  "image",
]);

const ALLOWED_MARKS = new Set(["bold", "italic", "underline", "strike", "code", "link", "textStyle", "highlight"]);

const ALIGNMENTS = new Set(["left", "center", "right", "justify"]);
const COLOR_PATTERN = /^(#[0-9a-fA-F]{3,8}|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+)\s*)?\))$/;
const FONT_SIZE_PATTERN = /^(1[0-9]|[2-6][0-9]|7[0-2])px$/;
const MAX_TEXT_LENGTH = 50_000;
const MAX_DEPTH = 12;

export function isSafeLinkHref(href: unknown): href is string {
  if (typeof href !== "string" || href.length > 2000) return false;
  if (href.startsWith("/") && !href.startsWith("//")) return true;
  try {
    return ["http:", "https:", "mailto:", "tel:"].includes(new URL(href).protocol);
  } catch {
    return false;
  }
}

/** 에디터 이미지는 R2 업로드 경로 또는 https 원격 이미지만 허용한다. */
export function isSafeImageSrc(src: unknown): src is string {
  if (typeof src !== "string" || src.length > 2000) return false;
  if (/^\/api\/files\/editor\/[\w.-]+$/.test(src)) return true;
  try {
    return new URL(src).protocol === "https:";
  } catch {
    return false;
  }
}

function pickString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.slice(0, maxLength) : null;
}

function sanitizeNodeAttrs(type: string, attrs: Record<string, unknown> = {}) {
  const clean: Record<string, unknown> = {};
  if ((type === "paragraph" || type === "heading") && ALIGNMENTS.has(String(attrs.textAlign))) {
    clean.textAlign = attrs.textAlign;
  }
  if (type === "heading") {
    const level = Number(attrs.level);
    clean.level = (HEADING_LEVELS as readonly number[]).includes(level) ? level : HEADING_LEVELS[0];
  }
  if (type === "orderedList") {
    const start = Number(attrs.start);
    clean.start = Number.isInteger(start) && start > 0 && start < 10_000 ? start : 1;
  }
  if (type === "image") {
    if (!isSafeImageSrc(attrs.src)) return null;
    clean.src = attrs.src;
    clean.alt = pickString(attrs.alt, 200);
    clean.title = pickString(attrs.title, 200);
  }
  return clean;
}

function sanitizeMark(mark: { type?: unknown; attrs?: Record<string, unknown> }) {
  const type = String(mark.type);
  if (!ALLOWED_MARKS.has(type)) return null;
  const attrs = mark.attrs ?? {};

  if (type === "link") {
    return isSafeLinkHref(attrs.href) ? { type, attrs: { href: attrs.href } } : null;
  }
  if (type === "textStyle") {
    const clean: Record<string, unknown> = {};
    if (typeof attrs.color === "string" && COLOR_PATTERN.test(attrs.color)) clean.color = attrs.color;
    if (typeof attrs.fontSize === "string" && FONT_SIZE_PATTERN.test(attrs.fontSize)) clean.fontSize = attrs.fontSize;
    return Object.keys(clean).length > 0 ? { type, attrs: clean } : null;
  }
  if (type === "highlight") {
    const color = typeof attrs.color === "string" && COLOR_PATTERN.test(attrs.color) ? attrs.color : null;
    return { type, attrs: { color } };
  }
  return { type };
}

function sanitizeNode(node: JSONContent, depth: number): JSONContent | null {
  const type = String(node?.type);
  if (!ALLOWED_NODES.has(type) || depth > MAX_DEPTH) return null;

  if (type === "text") {
    if (typeof node.text !== "string" || node.text.length === 0) return null;
    const marks = (node.marks ?? []).map(sanitizeMark).filter((mark) => mark !== null);
    return { type, text: node.text.slice(0, MAX_TEXT_LENGTH), ...(marks.length ? { marks } : {}) };
  }

  const attrs = sanitizeNodeAttrs(type, node.attrs);
  if (attrs === null) return null;

  const content = Array.isArray(node.content)
    ? node.content.map((child) => sanitizeNode(child, depth + 1)).filter((child) => child !== null)
    : undefined;

  return {
    type,
    ...(Object.keys(attrs).length ? { attrs } : {}),
    ...(content && content.length ? { content } : {}),
  };
}

export function sanitizeRichText(input: unknown): JSONContent | null {
  if (!input || typeof input !== "object" || (input as JSONContent).type !== "doc") return null;
  return sanitizeNode(input as JSONContent, 0);
}

export function richTextToPlainText(doc: JSONContent): string {
  const parts: string[] = [];
  const walk = (node: JSONContent) => {
    if (node.type === "text" && node.text) parts.push(node.text);
    node.content?.forEach(walk);
    if (node.type === "paragraph" || node.type === "heading" || node.type === "listItem") parts.push(" ");
  };
  walk(doc);
  return parts.join("").replace(/\s+/g, " ").trim();
}
