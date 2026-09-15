import { NEEDED_ASSETS } from "@/constants/neededAssets";
import { cn } from "@/utils/cn";

interface AssetPlaceholderProps {
  assetId: string;
  className?: string;
  aspectClassName?: string;
  /** dark: 어두운 배경(푸터 등) 위에 올릴 때 사용하는 반전 스타일 */
  tone?: "light" | "dark";
}

export function AssetPlaceholder({
  assetId,
  className,
  aspectClassName = "aspect-square",
  tone = "light",
}: AssetPlaceholderProps) {
  const asset = NEEDED_ASSETS.find((item) => item.id === assetId);

  return (
    <div
      className={cn(
        "flex items-center justify-center border border-dashed p-3 text-center",
        tone === "dark"
          ? "border-white/30 bg-white/5 text-white/60"
          : "border-primary-300 bg-primary-50 text-primary-500",
        aspectClassName,
        className,
      )}
      role="img"
      aria-label={asset ? `${asset.name} 준비 중` : "이미지 준비 중"}
    >
      <span className="text-[11px] leading-tight font-medium sm:text-[13px]">
        {asset ? asset.name : "에셋 준비 중"}
      </span>
    </div>
  );
}
