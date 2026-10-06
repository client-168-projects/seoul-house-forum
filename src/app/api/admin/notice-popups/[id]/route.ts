import { NextResponse, type NextRequest } from "next/server";
import { guardAdminApi } from "@/lib/server/auth/dal";
import { jsonError, parseId, readJson } from "@/lib/server/http";
import { parseNoticePopupInput } from "@/lib/server/noticePopupInput";
import { deleteNoticePopup, updateNoticePopup } from "@/lib/server/repositories/noticePopups";

export async function PATCH(request: NextRequest, context: RouteContext<"/api/admin/notice-popups/[id]">) {
  const guard = await guardAdminApi(request);
  if (guard.error) return guard.error;

  const id = parseId((await context.params).id);
  if (!id) return jsonError("잘못된 팝업 번호입니다.", 400);

  const body = await readJson(request);
  if (!body) return jsonError("요청 형식이 올바르지 않습니다.", 400);

  const parsed = await parseNoticePopupInput(body);
  if (!parsed.ok) return jsonError(parsed.message, 422);

  if (!(await updateNoticePopup(id, parsed.value))) return jsonError("팝업을 찾을 수 없습니다.", 404);
  return NextResponse.json({ id });
}

export async function DELETE(request: NextRequest, context: RouteContext<"/api/admin/notice-popups/[id]">) {
  const guard = await guardAdminApi(request);
  if (guard.error) return guard.error;

  const id = parseId((await context.params).id);
  if (!id || !(await deleteNoticePopup(id))) return jsonError("팝업을 찾을 수 없습니다.", 404);
  return new NextResponse(null, { status: 204 });
}
