import type { ReactNode } from "react";
import { Container } from "@/components/common/Container";
import { cn } from "@/utils/cn";

interface StatusScreenProps {
  code?: string;
  title: string;
  description: ReactNode;
  actions?: ReactNode;
  /** admin: 관리자 콘솔 배경 위에 올릴 때 쓰는 밝은 변형 */
  tone?: "site" | "admin";
}

/** 404, 오류 화면처럼 "상황 설명 + 다음 행동"만 보여 주는 공통 화면. */
export function StatusScreen({ code, title, description, actions, tone = "site" }: StatusScreenProps) {
  return (
    <section
      className={cn(
        "flex flex-1 items-center justify-center py-24 text-center lg:py-[160px]",
        tone === "site" ? "bg-primary-600 text-white" : "text-ink",
      )}
    >
      <Container className="flex flex-col items-center">
        {code && (
          <p
            className={cn(
              "font-heading text-[56px] leading-none font-bold lg:text-[72px]",
              tone === "site" ? "text-accent" : "text-primary-300",
            )}
          >
            {code}
          </p>
        )}
        <h1 className={cn("font-heading text-section-title", code && "mt-4")}>{title}</h1>
        <div className={cn("mt-4 text-body-lg", tone === "site" ? "text-white/85" : "text-ink-muted")}>{description}</div>
        {actions && <div className="mt-8 flex flex-wrap items-center justify-center gap-2 lg:mt-10">{actions}</div>}
      </Container>
    </section>
  );
}
