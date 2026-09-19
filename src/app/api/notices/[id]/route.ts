import { NextResponse, type NextRequest } from "next/server";
import { guardAdminApi } from "@/lib/server/auth/dal";
import { jsonError, parseId, readJson } from "@/lib/server/http";
import { parseNoticeInput } from "@/lib/server/noticeInput";
import { deleteNotice, getNotice, updateNotice } from "@/lib/server/repositories/notices";

export async function GET(_request: NextRequest, context: RouteContext<"/api/notices/[id]">) {
  const id = parseId((await context.params).id);
  const notice = id ? await getNotice(id) : null;
  if (!notice) return jsonError("공지사항을 찾을 수 없습니다.", 404);
  return NextResponse.json(notice);
}

export async function PATCH(request: NextRequest, context: RouteContext<"/api/notices/[id]">) {
  const guard = await guardAdminApi(request);
  if (guard.error) return guard.error;

  const id = parseId((await context.params).id);
  if (!id) return jsonError("잘못된 공지 번호입니다.", 400);

  const body = await readJson(request);
  if (!body) return jsonError("요청 형식이 올바르지 않습니다.", 400);

  const parsed = await parseNoticeInput(body);
  if (!parsed.ok) return jsonError(parsed.message, 422);

  const updated = await updateNotice(id, parsed.value);
  if (!updated) return jsonError("공지사항을 찾을 수 없습니다.", 404);
  return NextResponse.json({ id });
}

export async function DELETE(request: NextRequest, context: RouteContext<"/api/notices/[id]">) {
  const guard = await guardAdminApi(request);
  if (guard.error) return guard.error;

  const id = parseId((await context.params).id);
  if (!id || !(await deleteNotice(id))) return jsonError("공지사항을 찾을 수 없습니다.", 404);
  return new NextResponse(null, { status: 204 });
}
