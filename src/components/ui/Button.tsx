import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/**
 * Figma 버튼 디자인 시스템(node 2:595) 기준.
 * - 사이즈는 높이로 고정: small 36 / medium 42 / large 56, 모서리는 전부 직각
 * - 타이포는 사이즈가 아니라 타입이 결정한다. primaryStrong만 SUIT ExtraBold 16px(text-body)이고
 *   나머지 타입은 SUIT Medium 20px + 자간 1px이다.
 * - pill은 디자인 시스템에 없는 형태로, 참가등록 목업(temp/참가등록.png)의 보라색 알약 버튼 전용이다.
 *   자체 높이와 모서리를 가지므로 size를 무시한다.
 */
type Variant =
  | "primaryDefault"
  | "primaryStrong"
  | "primaryMono"
  | "transparentWhite"
  | "transparentDark"
  | "pill";

type Size = "small" | "medium" | "large";

const MONO_TEXT_CLASS = "text-[20px] font-medium leading-none tracking-[1px]";

const VARIANT_CLASS: Record<Variant, string> = {
  primaryDefault: `bg-ink text-white hover:bg-ink-soft focus-visible:outline-ink ${MONO_TEXT_CLASS}`,
  primaryStrong:
    "bg-accent text-accent-ink hover:brightness-95 focus-visible:outline-accent-ink text-body font-extrabold",
  primaryMono: `bg-ink-soft text-white hover:bg-ink focus-visible:outline-ink-soft ${MONO_TEXT_CLASS}`,
  transparentWhite: `border-[1.4px] border-white text-white hover:bg-white/10 focus-visible:outline-white ${MONO_TEXT_CLASS}`,
  transparentDark: `text-ink hover:bg-ink/5 focus-visible:outline-ink ${MONO_TEXT_CLASS}`,
  pill: "h-[52px] rounded-full bg-primary-600 px-8 text-body font-extrabold text-white hover:bg-primary-700 focus-visible:outline-primary-700 lg:h-[62px]",
};

const SIZE_CLASS: Record<Size, string> = {
  small: "h-[36px] px-[8px]",
  medium: "h-[42px] px-[16px]",
  large: "h-[56px] px-[16px]",
};

const BASE_CLASS =
  "inline-flex items-center justify-center gap-[2px] whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primaryStrong",
  size = "medium",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    BASE_CLASS,
    variant !== "pill" && SIZE_CLASS[size],
    VARIANT_CLASS[variant],
    className,
  );

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
