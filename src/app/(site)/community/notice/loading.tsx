import { Container } from "@/components/common/Container";
import { Skeleton } from "@/components/common/Skeleton";

export default function NoticeListLoading() {
  return (
    <Container className="pt-12 pb-24 lg:pt-[80px] lg:pb-[240px]">
      <span className="sr-only" role="status">
        공지사항을 불러오는 중입니다.
      </span>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-6 w-[140px]" />
        <Skeleton className="h-12 w-full rounded-full md:w-[420px]" />
      </div>
      <div className="mt-8 border-t-2 border-[#707070] lg:mt-[40px]">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex flex-col gap-3 border-b border-line py-7 lg:h-[110px] lg:justify-center">
            <Skeleton className="h-5 w-[70%] max-w-[520px]" />
            <Skeleton className="h-4 w-[110px]" />
          </div>
        ))}
      </div>
    </Container>
  );
}
