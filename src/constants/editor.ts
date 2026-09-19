/** 에디터 글자 크기 단계(px). sanitize.ts의 허용 범위(10~72px) 안에 있어야 한다. */
export const EDITOR_FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 40, 48] as const;

/** 포럼 브랜드 색. 팔레트 첫 줄에 두어 가장 먼저 고를 수 있게 한다. */
export const BRAND_COLORS = [
  { name: "딥 퍼플", value: "#330c53" },
  { name: "퍼플", value: "#6c4e9d" },
  { name: "라벤더", value: "#8971b1" },
  { name: "라임", value: "#c8ea3d" },
  { name: "핑크", value: "#a14879" },
  { name: "올리브", value: "#6e6a0c" },
  { name: "그린", value: "#5b7f1f" },
  { name: "잉크", value: "#181818" },
];

const GRAYS = ["#000000", "#262626", "#434343", "#666666", "#8c8c8c", "#b3b3b3", "#d4d4d4", "#e8e8e8", "#f3f3f3", "#ffffff"];

/** 10개 색상 계열 x 6단계(진함 -> 옅음) */
const HUES: string[][] = [
  ["#7f1d1d", "#b91c1c", "#ef4444", "#f87171", "#fca5a5", "#fee2e2"],
  ["#7c2d12", "#c2410c", "#f97316", "#fb923c", "#fdba74", "#ffedd5"],
  ["#713f12", "#a16207", "#eab308", "#facc15", "#fde047", "#fef9c3"],
  ["#365314", "#4d7c0f", "#84cc16", "#a3e635", "#bef264", "#ecfccb"],
  ["#14532d", "#15803d", "#22c55e", "#4ade80", "#86efac", "#dcfce7"],
  ["#134e4a", "#0f766e", "#14b8a6", "#2dd4bf", "#5eead4", "#ccfbf1"],
  ["#1e3a8a", "#1d4ed8", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"],
  ["#312e81", "#4338ca", "#6366f1", "#818cf8", "#a5b4fc", "#e0e7ff"],
  ["#581c87", "#7e22ce", "#a855f7", "#c084fc", "#d8b4fe", "#f3e8ff"],
  ["#831843", "#be185d", "#ec4899", "#f472b6", "#f9a8d4", "#fce7f3"],
];

/** 행 단위로 그리기 위해 [단계][계열]로 전치한다. */
export const TEXT_COLOR_ROWS: string[][] = [
  GRAYS,
  ...HUES[0].map((_, shade) => HUES.map((hue) => hue[shade])),
];

export const HIGHLIGHT_COLORS = [
  "#fff3a3",
  "#fde68a",
  "#fed7aa",
  "#fecaca",
  "#fbcfe8",
  "#f5d0fe",
  "#e9d5ff",
  "#ddd6fe",
  "#c7d2fe",
  "#bfdbfe",
  "#a5f3fc",
  "#99f6e4",
  "#bbf7d0",
  "#d9f99d",
  "#ecf5b8",
  "#e7defa",
  "#f3eefd",
  "#fff3fb",
  "#e5e5e5",
  "#c8ea3d",
];
