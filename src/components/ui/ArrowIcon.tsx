export type ArrowDirection = "right" | "left" | "down";

/** Figma icon/arrow_hover(24x24)의 path 원본. 방향은 회전으로만 파생시킨다. */
const ARROW_PATH =
  "M11.2212 5.1748L17.3462 11.2998H4.39502V12.7002H17.3501L11.2212 18.8281L12.2114 19.8184L20.0288 12.002L12.2114 4.18457L11.2212 5.1748Z";

const ROTATION: Record<ArrowDirection, number> = {
  right: 0,
  down: 90,
  left: 180,
};

interface ArrowIconProps {
  direction?: ArrowDirection;
  className?: string;
}

export function ArrowIcon({ direction = "right", className }: ArrowIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d={ARROW_PATH}
        fill="currentColor"
        transform={`rotate(${ROTATION[direction]} 12 12)`}
      />
    </svg>
  );
}
