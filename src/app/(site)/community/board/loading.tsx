import { Container } from "@/components/common/Container";
import { Skeleton } from "@/components/common/Skeleton";

export default function BoardLoading() {
  return (
    <div className="bg-primary-600 pt-[130px] pb-24 sm:pt-[160px] lg:min-h-[2180px] lg:pt-[213px]">
      <Container>
        <span className="sr-only" role="status">
          의견을 불러오는 중입니다.
        </span>
        <div className="flex flex-col items-center gap-4">
          <Skeleton tone="onPurple" className="h-10 w-[180px]" />
          <Skeleton tone="onPurple" className="h-10 w-[220px] rounded-full" />
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_600px]">
          <div className="flex flex-col items-center gap-3 lg:items-start">
            <Skeleton tone="onPurple" className="h-9 w-[80%] max-w-[420px]" />
            <Skeleton tone="onPurple" className="h-9 w-[60%] max-w-[320px]" />
          </div>
          <Skeleton tone="onPurple" className="h-[200px] w-full rounded-[16px] bg-white/70" />
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:mt-[100px] lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <li key={index}>
              <Skeleton tone="onPurple" className="mx-auto h-[150px] w-full max-w-[280px] rounded-[16px] sm:h-[190px] lg:h-[220px] lg:rounded-[24px]" />
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
