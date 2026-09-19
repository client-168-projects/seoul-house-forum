/** 제어 문자, 폭 없는 문자, 방향 제어 문자 범위. 소스에 보이지 않는 문자를 두지 않으려고 코드값으로 만든다. */
const INVISIBLE_RANGES: [number, number][] = [
  [0x00, 0x1f],
  [0x7f, 0x9f],
  [0x200b, 0x200f],
  [0x2028, 0x202e],
  [0x2060, 0x206f],
  [0xfeff, 0xfeff],
];

export const INVISIBLE_CHAR_PATTERN = new RegExp(
  `[${INVISIBLE_RANGES.map(([from, to]) => `${String.fromCharCode(from)}-${String.fromCharCode(to)}`).join("")}]`,
  "g",
);

/** 보이지 않는 문자와 연속 공백을 정리한다. 줄바꿈도 공백 하나로 바꾼다. */
export function normalizeText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFC")
    .replace(INVISIBLE_CHAR_PATTERN, " ")
    .replace(/\s+/g, " ")
    .trim();
}
