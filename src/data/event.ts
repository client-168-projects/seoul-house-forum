export const EVENT_INFO = {
  name: "2026 서울주거포럼",
  theme: "전월세시장 현황 진단 및 안정화 방안 모색",
  /** 홈 히어로에서 목업과 동일하게 두 줄로 끊어 노출한다. */
  themeLines: ["전월세시장 현황 진단 및", "안정화 방안 모색"],
  date: "2026.10.07",
  day: "수",
  dateLabel: "2026.10.07 (수)",
  dateLong: "2026년 10월 7일(수)",
  time: "12:30-16:00",
  timeRange: "12:30~16:00",
  venue: "한국프레스센터 20층 국제회의장",
  address: "서울특별시 중구 세종대로 124",
  host: "서울특별시",
  hostUrl: "https://www.seoul.go.kr/main/index.jsp",
  /** displayHeight: 로고마다 글자 비중이 달라 시각적으로 같은 크기로 보이도록 맞춘 표시 높이(px) */
  organizers: [
    {
      name: "한국도시부동산학회",
      url: "https://www.kura.kr/",
      logo: { src: "/images/logos/organizers/korea-urban-and-real-estate-association-logo.svg", width: 228, height: 39, displayHeight: 32 },
    },
    {
      name: "한국부동산분석학회",
      url: "http://www.kreaa.or.kr/",
      logo: { src: "/images/logos/organizers/korea-real-estate-analysis-association-logo.png", width: 322, height: 65, displayHeight: 42 },
    },
    {
      name: "서울연구원",
      url: "https://www.si.re.kr/",
      logo: { src: "/images/logos/organizers/the-seoul-institute-logo.svg", width: 203, height: 51, displayHeight: 40 },
    },
  ],
  inquiryPhone: "00",
  inquiryEmail: "00",
} as const;
