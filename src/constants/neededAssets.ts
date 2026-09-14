import type { NeededAsset } from "@/types/asset";

/**
 * temp/ 목업에는 있지만 실제 파일이 없어 사각형 placeholder로 대체한 에셋 목록.
 * 각 항목의 id는 AssetPlaceholder 컴포넌트의 assetId prop과 대응한다.
 */
export const NEEDED_ASSETS: NeededAsset[] = [
  {
    id: "event-poster",
    name: "행사 포스터 이미지",
    description: "포럼 공식 포스터 썸네일",
    usedIn: "행사 개요 (/forum/overview)",
    spec: "PNG/JPG, 세로형(A4 비율), 2x 해상도",
  },
  {
    id: "speaker-photo",
    name: "연사 프로필 사진",
    description: "이창무, 김준형, 이상영, 조강태 등 연사별 증명사진",
    usedIn: "프로그램 (/program), 연사 소개 (/program/speakers)",
    spec: "정방형 1:1, 최소 480x480px, JPG",
  },
  {
    id: "static-map",
    name: "오시는 길 지도",
    description: "행사장 위치 지도 (카카오맵/네이버지도 연동 또는 정적 지도 이미지)",
    usedIn: "오시는 길 (/forum/location)",
    spec: "지도 API 연동 권장, 대체 시 16:9 정적 이미지",
  },
  {
    id: "program-brochure",
    name: "포럼 자료집 PDF",
    description: "'2026 서울주거포럼 자료집 다운로드' 버튼이 연결할 실제 파일",
    usedIn: "프로그램 (/program)",
    spec: "PDF",
  },
  {
    id: "og-image",
    name: "OG/공유 대표 이미지",
    description: "SNS·메신저 공유 시 노출되는 대표 썸네일, 파비콘",
    usedIn: "전 페이지 메타데이터 (generateMetadata)",
    spec: "OG 1200x630px, 파비콘 512x512px",
  },
];
