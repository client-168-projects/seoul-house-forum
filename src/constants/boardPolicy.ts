import { BOARD_COOLDOWN_SECONDS, BOARD_PERSONAL_DATA_RETENTION_DAYS } from "@/constants/board";

/** 자유게시판 등록 전 동의 창에 노출되는 안내. 문구를 바꾸면 BOARD_CONSENT_VERSION도 올린다. */
export const BOARD_DATA_NOTICE = {
  title: "도배 방지 및 시스템 안정성을 위한 안내",
  items: [
    { label: "수집 항목", value: "IP 주소, 브라우저 정보(User-Agent)" },
    { label: "수집 목적", value: "중복·도배성 의견 차단 및 비정상적 접근(매크로) 제어" },
    {
      label: "보유 및 이용 기간",
      value: `작성일로부터 ${BOARD_PERSONAL_DATA_RETENTION_DAYS}일 이내 파기 (포럼 운영 종료 시 즉시 파기)`,
    },
  ],
  footnote:
    "수집한 정보는 도배 방지 시스템(Cloudflare Turnstile 포함)에만 활용되며, 마케팅 등 다른 목적으로 사용되지 않습니다. 동의하지 않으면 의견을 등록할 수 없습니다.",
} as const;

export const BOARD_RULES = [
  "특정 개인·단체를 비방하거나 욕설, 혐오·차별 표현을 담은 의견은 게시되지 않습니다.",
  "광고·홍보성 내용, 외부 링크, 연락처 등 개인정보가 포함된 의견은 게시되지 않습니다.",
  "같은 내용을 반복해서 등록하거나 의미 없는 문자를 나열하는 행위는 제한됩니다.",
  "작성하신 의견은 운영자 검수 후 게시되며, 이용 수칙에 맞지 않으면 게시되지 않을 수 있습니다.",
  `원활한 운영을 위해 한 번 등록한 뒤 ${BOARD_COOLDOWN_SECONDS}초가 지나야 다시 등록할 수 있습니다.`,
] as const;

export const BOARD_REVIEW_NOTICE = "남겨주신 의견은 운영자 검수 승인 후 게시판에 공개됩니다.";
