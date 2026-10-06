import { NextResponse, type NextRequest } from "next/server";
import { guardAdminApi } from "@/lib/server/auth/dal";
import { jsonError, readJson } from "@/lib/server/http";
import { parseNoticePopupInput } from "@/lib/server/noticePopupInput";
import { createNoticePopup, listNoticePopups } from "@/lib/server/repositories/noticePopups";

export async function GET(request: NextRequest) {
  const guard = await guardAdminApi(request);
  if (guard.error) return guard.error;

  return NextResponse.json({ popups: await listNoticePopups() });
}

export async function POST(request: NextRequest) {
  const guard = await guardAdminApi(request);
  if (guard.error) return guard.error;

  const body = await readJson(request);
  if (!body) return jsonError("요청 형식이 올바르지 않습니다.", 400);

  const parsed = await parseNoticePopupInput(body);
  if (!parsed.ok) return jsonError(parsed.message, 422);

  const id = await createNoticePopup(parsed.value);
  return NextResponse.json({ id }, { status: 201 });
}
