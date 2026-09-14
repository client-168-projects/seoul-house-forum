/** temp/오시는길.png 기준 교통편 안내 데이터. 경로는 ">" 화살표로 이어 붙여 렌더링한다. */

export interface RouteRow {
  label: string;
  /** 화살표로 연결되는 경로 구간 */
  steps: string[];
}

export const SUBWAY_ROUTES: RouteRow[] = [
  { label: "1호선", steps: ["시청역 4번 출구", "프레스센터 방향"] },
  { label: "2호선", steps: ["시청역", "프레스센터 방향"] },
  { label: "5호선", steps: ["광화문역 5번 출구", "프레스센터 방향 약 300m"] },
];

export interface BusStop {
  stop: string;
  /** 두 정류장을 구분하기 위해 목업에서 배지 색을 달리 사용한다. */
  tone: "accent" | "pink";
  groups: { type: string; routes: string[] }[];
}

export const BUS_STOPS: BusStop[] = [
  {
    stop: "서울신문사 하차",
    tone: "accent",
    groups: [
      { type: "간선", routes: ["101", "150", "402", "405", "501", "506", "N40"] },
      { type: "지선", routes: ["1711", "7016"] },
      { type: "순환", routes: ["915투어"] },
    ],
  },
  {
    stop: "광화문빌딩 하차",
    tone: "pink",
    groups: [
      { type: "간선", routes: ["700", "707"] },
      { type: "지선", routes: ["1711", "7016"] },
      { type: "광역", routes: ["9703", "9714", "M7106", "M7111", "M7119"] },
    ],
  },
];

export const CAR_ROUTES: RouteRow[] = [
  {
    label: "강남 방면",
    steps: ["한남대교", "남산1호터널", "세종대로", "시청 방면", "프레스센터"],
  },
  { label: "용산 방면", steps: ["남산3호터널", "세종대로", "시청 방면", "프레스센터"] },
  { label: "종로 방면", steps: ["종로", "광화문 사거리", "세종대로", "프레스센터"] },
  { label: "서대문 방면", steps: ["통일로", "서대문 사거리", "새문안로", "광화문", "프레스센터"] },
];
