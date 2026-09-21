import { StatusLink } from "@/components/common/StatusLink";
import { StatusScreen } from "@/components/common/StatusScreen";

/** 관리자 영역에서 없는 주소나 없는 공지 번호로 들어왔을 때. */
export default function AdminNotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <StatusScreen
        tone="admin"
        code="404"
        title="찾을 수 없는 페이지입니다"
        description="주소가 바뀌었거나 삭제된 항목입니다."
        actions={
          <>
            <StatusLink href="/admin" variant="primary">
              대시보드로
            </StatusLink>
            <StatusLink href="/admin/notices" variant="quiet">
              공지사항 관리
            </StatusLink>
          </>
        }
      />
    </div>
  );
}
