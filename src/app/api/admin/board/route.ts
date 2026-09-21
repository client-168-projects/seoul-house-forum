import { NextResponse, type NextRequest } from "next/server";
import { BOARD_ADMIN_PAGE_SIZE } from "@/constants/board";
import { guardAdminApi } from "@/lib/server/auth/dal";
import { jsonError, parseIdList, readJson } from "@/lib/server/http";
import { parsePage } from "@/lib/server/pagination";
import {
  deletePosts,
  listPostsForAdmin,
  purgeExpiredPersonalData,
  updatePostStatus,
} from "@/lib/server/repositories/boardPosts";
import { parseBoardStatus } from "@/utils/boardStatus";

export async function GET(request: NextRequest) {
  const guard = await guardAdminApi(request);
  if (guard.error) return guard.error;

  const params = request.nextUrl.searchParams;
  await purgeExpiredPersonalData();
  const result = await listPostsForAdmin(
    { status: parseBoardStatus(params.get("status")), query: params.get("q") ?? undefined },
    parsePage(params.get("page")),
    BOARD_ADMIN_PAGE_SIZE,
  );
  return NextResponse.json(result);
}

/** 일괄 상태 변경: { ids: number[], status: "approved" | "rejected" | "pending", note?: string } */
export async function PATCH(request: NextRequest) {
  const guard = await guardAdminApi(request);
  if (guard.error) return guard.error;

  const body = await readJson(request, 16 * 1024);
  const ids = parseIdList(body?.ids);
  const status = parseBoardStatus(body?.status);
  if (!ids || !status) return jsonError("변경할 의견과 상태를 확인해 주세요.", 422);

  const note = typeof body?.note === "string" ? body.note : null;
  const updated = await updatePostStatus(ids, status, guard.session.adminId, note);
  return NextResponse.json({ updated });
}

/** 일괄 삭제: { ids: number[] } */
export async function DELETE(request: NextRequest) {
  const guard = await guardAdminApi(request);
  if (guard.error) return guard.error;

  const body = await readJson(request, 16 * 1024);
  const ids = parseIdList(body?.ids);
  if (!ids) return jsonError("삭제할 의견을 선택해 주세요.", 422);

  const deleted = await deletePosts(ids);
  return NextResponse.json({ deleted });
}
