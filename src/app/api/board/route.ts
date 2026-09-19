import { NextResponse, type NextRequest } from "next/server";
import { BOARD_MIN_FILL_MS, BOARD_PUBLIC_PAGE_SIZE } from "@/constants/board";
import { validateOpinion } from "@/lib/server/boardModeration";
import { jsonError, readJson } from "@/lib/server/http";
import { parsePage } from "@/lib/server/pagination";
import {
  checkSubmissionLimit,
  createPendingPost,
  listApprovedPosts,
  purgeExpiredPersonalData,
} from "@/lib/server/repositories/boardPosts";
import { getClientIp, getUserAgent, isSameOrigin } from "@/lib/server/request";
import { verifyTurnstile } from "@/lib/server/turnstile";

/** 승인된 의견만 반환한다. IP 등 수집 정보는 응답에 포함하지 않는다. */
export async function GET(request: NextRequest) {
  const page = parsePage(request.nextUrl.searchParams.get("page"));
  return NextResponse.json(await listApprovedPosts(page, BOARD_PUBLIC_PAGE_SIZE));
}

const LIMIT_MESSAGES = {
  cooldown: "잠시 후 다시 등록해 주세요.",
  hourly: "짧은 시간에 너무 많은 의견이 등록되었습니다. 1시간 후 다시 시도해 주세요.",
  duplicate: "이미 같은 내용의 의견을 등록하셨습니다.",
} as const;

/**
 * 의견 등록. 방어 순서:
 * 출처 확인 -> 동의 여부 -> 허니팟/작성 시간 -> 입력 검증 -> Turnstile -> IP 레이트리밋/중복 -> 대기(pending) 저장
 */
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return jsonError("허용되지 않은 요청 출처입니다.", 403);

  const body = await readJson(request, 8 * 1024);
  if (!body) return jsonError("요청 형식이 올바르지 않습니다.", 400);

  if (body.agreePrivacy !== true || body.agreeRules !== true) {
    return jsonError("개인정보 수집 및 이용 수칙에 모두 동의해야 등록할 수 있습니다.", 422);
  }

  // 허니팟 필드가 채워졌거나 사람이 쓸 수 없는 속도로 제출되면 봇으로 보고 성공처럼 응답해 재시도를 유도하지 않는다.
  const elapsedMs = Number(body.elapsedMs);
  if (body.website || !Number.isFinite(elapsedMs) || elapsedMs < BOARD_MIN_FILL_MS) {
    return NextResponse.json({ status: "pending" }, { status: 202 });
  }

  const validation = validateOpinion(body);
  if (!validation.ok) return jsonError(validation.message, 422);

  const ip = getClientIp(request.headers);
  if (!(await verifyTurnstile(String(body.turnstileToken ?? ""), ip))) {
    return jsonError("자동 입력 방지 확인에 실패했습니다. 확인을 다시 진행해 주세요.", 400, {
      extra: { code: "turnstile" },
    });
  }

  const limit = await checkSubmissionLimit(ip, validation.value.content);
  if (!limit.allowed) {
    return jsonError(LIMIT_MESSAGES[limit.reason], 429, {
      headers: { "Retry-After": String(limit.retryAfterSeconds) },
      extra: { retryAfterSeconds: limit.retryAfterSeconds },
    });
  }

  await createPendingPost(validation.value, {
    ip,
    userAgent: getUserAgent(request.headers),
    contentHash: limit.contentHash,
  });
  await purgeExpiredPersonalData();

  return NextResponse.json({ status: "pending" }, { status: 202 });
}
