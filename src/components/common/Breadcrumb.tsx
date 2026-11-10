import Link from "next/link";
import { Container } from "@/components/common/Container";
import { cn } from "@/utils/cn";

interface BreadcrumbProps {
  items: string[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="border-b border-line-faint bg-white">
      <Container>
        <ol className="flex h-[52px] flex-wrap items-center justify-end gap-[10px] text-caption text-ink-muted lg:h-[70px]">
          <li>
            <Link href="/" className="hover:text-primary-600">
              HOME
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-center gap-[10px]">
              <ChevronIcon />
              <span
                className={cn(
                  index === items.length - 1 && "text-body font-bold text-[#434343]",
                )}
              >
                {item}
              </span>
            </li>
          ))}
        </ol>
      </Container>
    </nav>
  );
}

function ChevronIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
