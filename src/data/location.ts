/** 행사장(한국프레스센터 20층 국제회의장) 구글 지도 임베드 */
export const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m5!3m3!1m2!1s0x357ca2ed73c2c1a5%3A0x8c2811ce2a42e30!2z7ZWc6rWt7ZSE66CI7Iqk7IS87YSwIOq1reygnO2ajOydmOyepQ!5e0!3m2!1sko!2skr!4v1789446395686!5m2!1sko!2skr";

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
  /** 두 정류장을 구분하기 위해 배지 색을 달리 쓴다. */
  tone: "accent" | "pink";
  groups: { type: string; routes: string[] }[];
}

export const BUS_STOPS: BusStop[] = [
  {
    stop: "시청역1호선.서울시청 하차",
    tone: "accent",
    groups: [
      { type: "간선", routes: ["402", "709"] },
      { type: "지선", routes: ["7011"] },
      { type: "마을", routes: ["종로09", "종로11"] },
      { type: "일반", routes: ["799"] },
    ],
  },
  {
    stop: "서울신문사 하차",
    tone: "accent",
    groups: [
      { type: "간선", routes: ["101", "150", "501", "506", "708"] },
      { type: "지선", routes: ["1711", "7016"] },
    ],
  },
  {
    stop: "광화문역6번출구.광화문빌딩 하차",
    tone: "pink",
    groups: [
      { type: "간선", routes: ["700", "703"] },
      { type: "광역", routes: ["1000", "1200", "1900", "7111", "M7111", "M7119", "M7154"] },
      { type: "일반", routes: ["799"] },
    ],
  },
];

export const CAR_ROUTES: RouteRow[] = [
  {
    label: "강남 방면",
    steps: ["한남대교", "남산1호터널", "세종대로", "시청 방면", "프레스센터"],
  },
  { label: "용산 방면", steps: ["새창로", "숭례문오거리", "세종대로"] },
  { label: "종로 방면", steps: ["종로", "광화문 사거리", "세종대로", "프레스센터"] },
  { label: "서대문 방면", steps: ["통일로", "서대문 사거리", "새문안로", "광화문", "프레스센터"] },
];
