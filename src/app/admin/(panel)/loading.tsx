import { Skeleton } from "@/components/common/Skeleton";

/** 관리자 공통 로딩. 대시보드/목록 모두 상단 제목 + 큰 패널 구조라 같은 뼈대를 쓴다. */
export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-[1280px]">
      <span className="sr-only" role="status">
        불러오는 중입니다.
      </span>
      <Skeleton className="h-4 w-[120px]" />
      <Skeleton className="mt-3 h-8 w-[220px]" />
      <Skeleton className="mt-8 h-[220px] w-full rounded-[24px]" />
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Skeleton className="h-[320px] w-full rounded-[24px]" />
        <Skeleton className="h-[320px] w-full rounded-[24px]" />
      </div>
    </div>
  );
}
