export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/**
 * 관리자 REST 호출 공통 처리. 세션이 만료되어 401이 오면 로그인 화면으로 보낸다.
 * 쿠키는 SameSite=Strict라 같은 출처 요청에만 실리고, 서버는 Origin 헤더도 확인한다.
 */
export async function adminFetch<T = unknown>(url: string, init: RequestInit = {}): Promise<T> {
  const isFormData = init.body instanceof FormData;
  const response = await fetch(url, {
    ...init,
    credentials: "same-origin",
    headers: isFormData ? init.headers : { "content-type": "application/json", ...init.headers },
  });

  if (response.status === 401) {
    // 세션 만료 시 클라이언트 상태를 모두 버리도록 의도적으로 전체 페이지 이동을 한다.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`/admin/login?next=${encodeURIComponent(window.location.pathname)}`);
    throw new AdminApiError("로그인이 만료되었습니다. 다시 로그인해 주세요.", 401);
  }
  if (response.status === 204) return undefined as T;

  const data = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) {
    throw new AdminApiError(data.message ?? "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.", response.status);
  }
  return data as T;
}
