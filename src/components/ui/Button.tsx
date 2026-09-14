import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type Variant = "accent" | "primary" | "outline";

/**
 * 목업에 등장하는 버튼은 두 종류다.
 * - accent: 라임색 사각 버튼, 높이 42px / 좌우 16px (홈 CTA, 자료집 다운로드)
 * - primary: 보라색 알약 버튼, 높이 62px (참가 등록 카드)
 */
const VARIANT_CLASS: Record<Variant, string> = {
  accent:
    "h-[42px] rounded-none bg-accent px-4 text-body text-accent-ink hover:brightness-95 focus-visible:outline-accent-ink",
  primary:
    "h-[52px] rounded-full bg-primary-600 px-8 text-body text-white hover:bg-primary-700 focus-visible:outline-primary-700 lg:h-[62px]",
  outline:
    "h-[42px] rounded-full border border-primary-200 bg-white px-6 text-body text-primary-700 hover:bg-primary-50 focus-visible:outline-primary-600",
};

const BASE_CLASS =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

interface CommonProps {
  variant?: Variant;
  className?: string;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const classes = cn(BASE_CLASS, VARIANT_CLASS[variant], className);

  if (props.href !== undefined) {
    const { href, children, ...anchorProps } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { children, ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
