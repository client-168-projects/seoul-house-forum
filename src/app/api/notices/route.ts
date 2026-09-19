import { NextResponse, type NextRequest } from "next/server";
import { guardAdminApi } from "@/lib/server/auth/dal";
import { jsonError, readJson } from "@/lib/server/http";
import { parseNoticeInput } from "@/lib/server/noticeInput";
import { parsePage } from "@/lib/server/pagination";
import { createNotice, listNotices } from "@/lib/server/repositories/notices";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const pageSize = Math.min(50, Math.max(1, Number(params.get("pageSize")) || 10));
  const result = await listNotices({
    page: parsePage(params.get("page")),
    pageSize,
    query: params.get("q") ?? undefined,
    field: params.get("field") === "content" ? "content" : "title",
  });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const guard = await guardAdminApi(request);
  if (guard.error) return guard.error;

  const body = await readJson(request);
  if (!body) return jsonError("요청 형식이 올바르지 않습니다.", 400);

  const parsed = await parseNoticeInput(body);
  if (!parsed.ok) return jsonError(parsed.message, 422);

  const id = await createNotice(parsed.value, guard.session.adminId);
  return NextResponse.json({ id }, { status: 201 });
}
