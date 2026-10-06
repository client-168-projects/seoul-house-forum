import { NextResponse } from "next/server";
import { listActiveNoticePopups } from "@/lib/server/repositories/noticePopups";

export const dynamic = "force-dynamic";

/** 공개 사이트 팝업. 조회에 실패해도 페이지 이용에는 지장이 없도록 빈 목록을 돌려준다. */
export async function GET() {
  try {
    return NextResponse.json({ popups: await listActiveNoticePopups() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[popups/active]", error);
    return NextResponse.json({ popups: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
