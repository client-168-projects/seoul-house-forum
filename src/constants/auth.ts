/** proxy.ts(낙관적 검사)와 서버 세션 모듈이 함께 참조하므로 server-only 밖에 둔다. */
export const ADMIN_SESSION_COOKIE = "shf_admin_session";

export const ADMIN_SESSION_TTL_HOURS = 12;

export const ADMIN_LOGIN_PATH = "/admin/login";

/** IP 기준 15분 동안 로그인 실패 허용 횟수 */
export const LOGIN_MAX_FAILURES = 5;
export const LOGIN_LOCK_MINUTES = 15;
