export const OPINION_MAX_LENGTH = 200;
export const OPINION_MIN_LENGTH = 5;
export const AUTHOR_MAX_LENGTH = 10;

/** 쪽지 기울기 범위(deg). 피그마에서 가장 많이 기운 쪽지가 대략 7도 안팎이다. */
export const NOTE_MAX_TILT_DEG = 7;
export const NOTE_MIN_TILT_DEG = 1.5;

/** 연속 작성 방지: 같은 IP(서버)와 같은 브라우저(버튼 카운트다운)의 재등록 대기 시간 */
export const BOARD_COOLDOWN_SECONDS = 10;
/** 같은 IP의 1시간 최대 등록 수 */
export const BOARD_HOURLY_LIMIT = 20;
/** 폼이 열린 뒤 이 시간 안에 제출되면 자동 입력(매크로)으로 간주한다. */
export const BOARD_MIN_FILL_MS = 3000;
/** 같은 IP가 같은 내용을 다시 올리지 못하게 막는 기간 */
export const BOARD_DUPLICATE_WINDOW_HOURS = 24;
/** 수집한 IP, User-Agent를 파기하기까지의 기간 */
export const BOARD_PERSONAL_DATA_RETENTION_DAYS = 30;

/** 피그마 기준 첫 화면 쪽지 수(4+4+4+2) */
export const BOARD_PUBLIC_PAGE_SIZE = 14;
export const BOARD_ADMIN_PAGE_SIZE = 20;

/** 안내문 문구가 바뀌면 버전을 올려 어떤 안내에 동의했는지 기록에 남긴다. */
export const BOARD_CONSENT_VERSION = "2026-09-19";

export const TURNSTILE_ACTION = "board_post";

export const SEOUL_DISTRICTS = [
  "강남구",
  "강동구",
  "강북구",
  "강서구",
  "관악구",
  "광진구",
  "구로구",
  "금천구",
  "노원구",
  "도봉구",
  "동대문구",
  "동작구",
  "마포구",
  "서대문구",
  "서초구",
  "성동구",
  "성북구",
  "송파구",
  "양천구",
  "영등포구",
  "용산구",
  "은평구",
  "종로구",
  "중구",
  "중랑구",
  "기타",
] as const;
