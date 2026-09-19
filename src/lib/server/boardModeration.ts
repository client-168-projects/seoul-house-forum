import "server-only";
import {
  AUTHOR_MAX_LENGTH,
  OPINION_MAX_LENGTH,
  OPINION_MIN_LENGTH,
  SEOUL_DISTRICTS,
} from "@/constants/board";
import { normalizeText } from "@/utils/text";

/**
 * 자동 차단 규칙. 검수 전 단계에서 명백한 스팸/악성 입력만 거르고,
 * 애매한 표현은 운영자 검수(승인/반려)에 맡긴다.
 */
const LINK_PATTERN = /(https?:\/\/|www\.|[a-z0-9-]+\.(com|net|org|kr|co|io|me|ly|xyz|site|shop)\b)/i;
const PHONE_PATTERN = /01[016789][-\s.]?\d{3,4}[-\s.]?\d{4}/;
const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.]+/;
const REPEATED_CHAR_PATTERN = /(.)\1{9,}/;
const BLOCKED_WORDS = ["시발", "씨발", "ㅅㅂ", "병신", "ㅂㅅ", "개새끼", "좆", "fuck", "카지노", "토토", "바카라"];

export interface OpinionInput {
  content: string;
  author: string;
  district: string;
}

export type ValidationResult = { ok: true; value: OpinionInput } | { ok: false; message: string };


function compact(value: string) {
  return value.toLowerCase().replace(/[\s.\-_*~!?,]/g, "");
}

export function validateOpinion(raw: Record<string, unknown>): ValidationResult {
  const content = normalizeText(raw.content);
  const author = normalizeText(raw.author);
  const district = normalizeText(raw.district);

  if (content.length < OPINION_MIN_LENGTH) {
    return { ok: false, message: `의견을 ${OPINION_MIN_LENGTH}자 이상 입력해 주세요.` };
  }
  if (content.length > OPINION_MAX_LENGTH) {
    return { ok: false, message: `의견은 ${OPINION_MAX_LENGTH}자 이내로 입력해 주세요.` };
  }
  if (!author || author.length > AUTHOR_MAX_LENGTH) {
    return { ok: false, message: `이름을 ${AUTHOR_MAX_LENGTH}자 이내로 입력해 주세요.` };
  }
  if (!(SEOUL_DISTRICTS as readonly string[]).includes(district)) {
    return { ok: false, message: "지역구를 선택해 주세요." };
  }

  const combined = `${content} ${author}`;
  if (LINK_PATTERN.test(combined)) {
    return { ok: false, message: "링크나 도메인 주소는 입력할 수 없습니다." };
  }
  if (PHONE_PATTERN.test(combined) || EMAIL_PATTERN.test(combined)) {
    return { ok: false, message: "연락처나 이메일 등 개인정보는 입력할 수 없습니다." };
  }
  if (REPEATED_CHAR_PATTERN.test(content)) {
    return { ok: false, message: "같은 문자를 반복한 의견은 등록할 수 없습니다." };
  }
  const compacted = compact(combined);
  if (BLOCKED_WORDS.some((word) => compacted.includes(word))) {
    return { ok: false, message: "이용 수칙에 맞지 않는 표현이 포함되어 있습니다. 내용을 수정해 주세요." };
  }

  return { ok: true, value: { content, author, district } };
}
