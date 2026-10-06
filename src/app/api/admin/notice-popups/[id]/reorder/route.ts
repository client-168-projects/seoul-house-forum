import { NextResponse, type NextRequest } from "next/server";
import { guardAdminApi } from "@/lib/server/auth/dal";
import { jsonError, parseId, readJson } from "@/lib/server/http";
import { moveNoticePopup } from "@/lib/server/repositories/noticePopups";

/** body: { direction: "up" | "down" } */
export async function PATCH(request: NextRequest, context: RouteContext<"/api/admin/notice-popups/[id]/reorder">) {
  const guard = await guardAdminApi(request);
  if (guard.error) return guard.error;

  const id = parseId((await context.params).id);
  if (!id) return jsonError("잘못된 팝업 번호입니다.", 400);

  const body = await readJson(request);
  const direction = body?.direction;
  if (direction !== "up" && direction !== "down") return jsonError("이동 방향이 올바르지 않습니다.", 400);

  if (!(await moveNoticePopup(id, direction))) return jsonError("팝업을 찾을 수 없습니다.", 404);
  return NextResponse.json({ id });
}
