import type { AgendaRow, Speaker } from "@/types/program";

export const AGENDA_ROWS: AgendaRow[] = [
  {
    label: "등록 및 접수",
    highlighted: false,
    slots: [{ timeRange: "12:30~13:00", duration: "30분", content: { kind: "text", lines: ["접수 및 등록"] } }],
  },
  {
    label: "포럼 안내",
    highlighted: false,
    slots: [
      {
        timeRange: "13:00~13:05",
        duration: "5분",
        content: { kind: "text", lines: ["포럼 개최 안내, 참석자 소개"] },
      },
    ],
  },
  {
    label: "환영사",
    highlighted: true,
    slots: [{ timeRange: "13:05~13:10", duration: "5분", content: { kind: "text", lines: ["서울특별시장"] } }],
  },
  {
    label: "축사 1",
    highlighted: true,
    slots: [
      {
        timeRange: "13:10~13:15",
        duration: "5분",
        content: { kind: "text", lines: ["서울시의회", "(의장/부의장/주택공간위원회 위원장 등)"] },
      },
    ],
  },
  {
    label: "축사 2",
    highlighted: true,
    slots: [
      {
        timeRange: "13:15~13:20",
        duration: "5분",
        content: {
          kind: "text",
          lines: ["한국도시부동산학회 김지엽 회장", "한국부동산분석학회 이재순 회장 등"],
        },
      },
    ],
  },
  {
    label: "사진촬영",
    highlighted: false,
    slots: [
      {
        timeRange: "13:20~13:30",
        duration: "10분",
        content: { kind: "text", lines: ["단체사진 촬영 및 세팅 변경"] },
      },
    ],
  },
  {
    label: "기조발제",
    highlighted: true,
    slots: [
      {
        timeRange: "13:30~13:40",
        duration: "10분",
        content: {
          kind: "session",
          badge: "주제",
          title: "전월세 시장 불안정 원인 진단",
          presenter: { name: "이창무", affiliation: "서울특별시 총괄 건축가" },
        },
      },
    ],
  },
  {
    label: "주제발표1",
    highlighted: true,
    slots: [
      {
        timeRange: "13:40~13:55",
        duration: "15분",
        content: {
          kind: "session",
          badge: "주제",
          title: "장기전세주택의 성과 그리고 미래",
          presenter: { category: "공공임대", name: "김준형", affiliation: "명지대학교 교수" },
        },
      },
    ],
  },
  {
    label: "주제발표2",
    highlighted: true,
    slots: [
      {
        timeRange: "13:55~14:10",
        duration: "15분",
        content: {
          kind: "session",
          badge: "주제(안)",
          title: "기업형 민간임대 국내외 사례 및 활성화 방안",
          presenter: { category: "민간임대", name: "이상영", affiliation: "명지대학교 교수" },
        },
      },
    ],
  },
  {
    label: "주제발표3",
    highlighted: true,
    slots: [
      {
        timeRange: "14:10~14:25",
        duration: "15분",
        content: {
          kind: "session",
          badge: "주제(안)",
          title: "민간임대 공급 운영 현실과 제언",
          presenter: { category: "민간개발사례", name: "조강태", affiliation: "MGRV 대표" },
        },
      },
    ],
  },
  {
    label: "휴식",
    highlighted: false,
    slots: [{ timeRange: "14:25~14:35", duration: "10분", content: { kind: "text", lines: ["세팅 변경 및 휴식"] } }],
  },
  {
    label: "토론 및 질의",
    highlighted: true,
    slots: [
      {
        timeRange: "14:35~15:15",
        duration: "40분",
        subLabel: "패널토론",
        content: {
          kind: "panel",
          moderatorRole: "전문사회자 섭외",
          moderator: "김인만 소장",
          discussionLabel: "종합토론",
          discussionSummary: "토론자(5명, 학계3, 서울시1, 기자1)",
          panelists: [
            { name: "정재훈", affiliation: "단국대학교 교수" },
            { name: "남원석", affiliation: "서울연구원 선임연구위원" },
            { name: "이태현", affiliation: "홈즈컴퍼니 대표" },
          ],
        },
      },
      {
        timeRange: "15:15~15:45",
        duration: "30분",
        subLabel: "질의 응답",
        content: { kind: "text", lines: ["온라인 시민의견에 대한 답변 및 현장질의 응답"] },
      },
    ],
  },
  {
    label: "폐 회",
    highlighted: false,
    slots: [{ timeRange: "16:00~", content: { kind: "text", lines: ["폐회 및 마무리"] } }],
  },
];

export const SPEAKERS: Speaker[] = [
  {
    id: "lee-changmoo",
    photo: { src: "/images/speakers/lee-changmoo.webp", width: 943, height: 1080 },
    name: "이창무",
    affiliation: "서울특별시 총괄건축가",
    sessionLabel: "기조발제",
    sessionTitle: "전월세 시장 불안정 원인 진단",
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
    sessionTitle: "장기전세주택의 성과 그리고 미래",
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
