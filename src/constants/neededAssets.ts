import type { NeededAsset } from "@/types/asset";

/**
 * temp/ 목업에는 있지만 실제 파일이 없어 사각형 placeholder로 대체한 에셋 목록.
 * 각 항목의 id는 AssetPlaceholder 컴포넌트의 assetId prop과 대응한다.
 */
export const NEEDED_ASSETS: NeededAsset[] = [
  {
    id: "og-image",
    name: "OG/공유 대표 이미지",
    description: "SNS·메신저 공유 시 노출되는 대표 썸네일, 파비콘",
    usedIn: "전 페이지 메타데이터 (generateMetadata)",
    spec: "OG 1200x630px, 파비콘 512x512px",
  },
];
