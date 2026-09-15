import type { AgendaGroup, Speaker } from "@/types/program";

/**
 * temp/프로그램.png 기준. "주제발표2"는 원본 목업에 "주제발표1"과 동일한
 * 13:40~13:55로 표기되어 있어(오기로 추정) 뒤 순서(주제발표3 14:10 시작)에
 * 맞춰 13:55~14:10으로 보정했다.
 */
export const AGENDA_GROUPS: AgendaGroup[] = [
  {
    start: "12:30~",
    end: "13:00",
    entries: [{ label: "참가자 등록" }],
  },
  {
    start: "13:00~",
    end: "13:30",
    entries: [
      { label: "환영사", presenters: [{ name: "오세훈", affiliation: "서울특별시장" }] },
      {
        label: "축사1",
        presenters: [
          { name: "길지엽", affiliation: "한국도시부동산학회장" },
          { name: "이재순", affiliation: "한국도시부동산학회장" },
        ],
      },
      {
        label: "축사2",
        presenters: [
          { name: "OOO", affiliation: "oooooo" },
          { name: "OOO", affiliation: "oooooo" },
        ],
      },
      { label: "기념촬영" },
    ],
  },
  {
    start: "13:30~",
    end: "13:40",
    entries: [
      {
        label: "기조발제",
        title: "전월세제도 및 동향, 불안정 원인 진단",
        presenters: [{ name: "이창무", affiliation: "서울특별시 총괄 건축가" }],
      },
    ],
  },
  {
    start: "13:40~",
    end: "13:55",
    entries: [
      {
        label: "주제발표1",
        title: "OOOOOOOOOO",
        presenters: [{ name: "김준형", affiliation: "명지대학교 교수" }],
      },
    ],
  },
  {
    start: "13:55~",
    end: "14:10",
    entries: [
      {
        label: "주제발표2",
        title: "기업형 민간임대 국내·외 사례 및 활성화 방안",
        presenters: [{ name: "이상영", affiliation: "명지대학교 교수" }],
      },
    ],
  },
  {
    start: "14:10~",
    end: "14:25",
    entries: [
      {
        label: "주제발표3",
        title: "민간임대 공급 운영 현실과 제언",
        presenters: [{ name: "조강태", affiliation: "MGRV 대표" }],
      },
    ],
  },
  { start: "14:25~", end: "14:35", entries: [{ label: "휴식" }] },
  {
    start: "14:35~",
    end: "15:15",
    entries: [{ label: "종합토론", note: "토론자(5명, 학계3명, 서울시1명, 기자1명)" }],
  },
  {
    start: "15:15~",
    end: "15:45",
    entries: [{ label: "질의응답", note: "온라인 시민의견에 대한 답변 및 현장질의 응답" }],
  },
];

export const SPEAKERS: Speaker[] = [
  {
    id: "lee-changmoo",
    photo: { src: "/images/speakers/lee-changmoo.webp", width: 943, height: 1080 },
    name: "이창무",
    affiliation: "서울특별시 총괄 건축가",
    sessionLabel: "기조발제",
    sessionTitle: "전월세제도 및 동향, 불안정 원인 진단",
    bio: "이창무 제5대 서울총괄건축가는 도시계획 및 부동산경제 분야의 전문성을 바탕으로 서울의 도시 공간 정책을 이끌고 있습니다. 1963년생으로 현재 한양대학교 도시공학과 교수로 재직 중이며, 2026년 7월 6일부터 2028년 7월 5일까지 2년 임기의 비상임 서울총괄건축가로 위촉되었습니다. 국토교통부 정책자문위원, 중앙도시계획위원회 위원 등을 역임했고, 서울특별시 도시계획위원회 위원 및 신속통합기획 자문분과위원으로도 활동해왔습니다.",
    abstract:
      "이번 기조발제에서는 전월세 시장의 최근 동향과 불안정 원인을 진단하고, 서울시 차원의 시장 안정화 방향을 제시합니다.",
  },
  {
    id: "kim-junhyung",
    photo: { src: "/images/speakers/kim-junhyung.webp", width: 1140, height: 1080 },
    name: "김준형",
    affiliation: "명지대학교 교수",
    sessionLabel: "주제발표1",
    sessionTitle: "OOOOOOOOOO",
    bio: "약력 정보는 준비 중입니다.",
    abstract: "발표 소개는 준비 중입니다.",
  },
  {
    id: "lee-sangyoung",
    photo: { src: "/images/speakers/lee-sangyoung.webp", width: 1156, height: 1080 },
    name: "이상영",
    affiliation: "명지대학교 교수",
    sessionLabel: "주제발표2",
    sessionTitle: "기업형 민간임대 국내·외 사례 및 활성화 방안",
    bio: "약력 정보는 준비 중입니다.",
    abstract: "발표 소개는 준비 중입니다.",
  },
  {
    id: "cho-kangtae",
    photo: { src: "/images/speakers/cho-kangtae.webp", width: 1156, height: 1080 },
    name: "조강태",
    affiliation: "MGRV 대표",
    sessionLabel: "주제발표3",
    sessionTitle: "민간임대 공급 운영 현실과 제언",
    bio: "약력 정보는 준비 중입니다.",
    abstract: "발표 소개는 준비 중입니다.",
  },
];
