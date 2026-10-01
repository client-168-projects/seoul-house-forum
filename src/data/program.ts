import type { AgendaRow, Speaker, SpeakerSection } from "@/types/program";

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
    slots: [
      {
        timeRange: "13:05~13:10",
        duration: "5분",
        content: { kind: "people", people: [{ name: "김성보", affiliation: "서울특별시 행정2부시장" }] },
      },
    ],
  },
  {
    label: "축사",
    highlighted: true,
    slots: [
      {
        timeRange: "13:10~13:20",
        duration: "10분",
        content: {
          kind: "people",
          people: [
            { name: "이재순", affiliation: "한국부동산분석학회장" },
            { name: "김지엽", affiliation: "한국도시부동산학회장" },
          ],
        },
      },
    ],
  },
  {
    label: "사진촬영",
    highlighted: false,
    slots: [{ timeRange: "13:20~13:30", duration: "10분" }],
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
          title: "매매시장 규제강화와 전월세시장의 불안",
          presenter: { name: "이창무", affiliation: "서울특별시 총괄건축가" },
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
          category: "민간임대",
          title: "기업형 민간임대 국내외 사례 및 활성화 방안",
          presenter: { name: "이상영", affiliation: "명지대학교 교수" },
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
          badge: "주제",
          category: "민간개발사례",
          title: "커지는 임대수요, 따라가지 못하는 공급체계",
          presenter: { name: "조강태", affiliation: "MGRV 대표" },
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
          badge: "주제",
          category: "공공임대",
          title: "장기전세주택의 성과 그리고 미래",
          presenter: { name: "김준형", affiliation: "명지대학교 교수" },
        },
      },
    ],
  },
  {
    label: "휴식",
    highlighted: false,
    slots: [{ timeRange: "14:25~14:35", duration: "10분" }],
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
          moderatorLabel: "사회",
          moderator: { name: "김인만", affiliation: "김인만부동산경제연구소 대표" },
          discussionLabel: "패널",
          panelists: [
            { name: "정재훈", affiliation: "단국대학교 교수" },
            { name: "남원석", affiliation: "서울연구원 선임연구위원" },
            { name: "이태현", affiliation: "홈즈컴퍼니 대표" },
            { name: "이종아", affiliation: "서울시부동산정책개발센터장" },
            { name: "김동현", affiliation: "서울신문 부장" },
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
    slots: [{ timeRange: "16:00~" }],
  },
];

export const SPEAKERS: Speaker[] = [
  {
    id: "lee-changmoo",
    photo: { src: "/images/speakers/lee-changmoo.webp", width: 943, height: 1080 },
    name: "이창무",
    affiliation: "서울특별시 총괄건축가 · 한양대학교 도시공학과 교수",
    sessionLabel: "기조발제",
    sessionTitle: "매매시장 규제강화와 전월세시장의 불안",
    bioSummary:
      "도시계획과 부동산경제를 아우르는 주택시장 연구자로, 전월세 시장에 대한 계량 분석과 부동산 가격지수 개발 등 실증 연구를 20여 년간 이어왔다. 정부와 서울시의 주요 도시·주택 정책 위원회에 참여해 왔으며, 2026년 서울특별시 총괄건축가로 위촉되었다.",
    bioSections: [
      {
        heading: "학력",
        items: [
          "서울대학교 도시공학과 학사·석사",
          "미국 펜실베이니아대학교(University of Pennsylvania) 도시 및 지역계획학 박사",
        ],
      },
      {
        heading: "주요 경력",
        items: [
          "서울특별시 총괄건축가(2026~현재), G3 서울 기획위원회 공동위원장",
          "한양대학교 도시공학과 교수(2003~현재)",
          "펜실베이니아대학교 와튼스쿨 부동산학과 선임연구원, 서울시정개발연구원(현 서울연구원) 부연구위원, 서울대학교 지구환경시스템공학부 교수 역임",
          "한국주택학회 회장, 한국부동산분석학회 회장, 아시아부동산학회(AsRES) 회장 역임",
          "국토교통부 중앙도시계획위원회·주거정책심의위원회 위원, 서울특별시 도시계획위원회·주택정책심의위원회 위원, 대통령직속 지역발전위원회 위원 등 역임",
        ],
      },
      {
        heading: "주요 저서",
        items: [
          "『한국 주택시장의 새로운 이해』(2015), 『한국 부동산 임대시장의 새로운 해석』(공저, 2008), 『새정부 주택정책의 진단과 과제』(공저, 2008) 등",
        ],
      },
    ],
  },
  {
    id: "lee-sangyoung",
    photo: { src: "/images/speakers/lee-sangyoung.webp", width: 1156, height: 1080 },
    name: "이상영",
    affiliation: "명지대학교 부동산학과 교수",
    sessionLabel: "주제발표1",
    sessionTitle: "기업형 민간임대 국내외 사례 및 활성화 방안",
    bioSummary:
      "임대주택산업, 리츠(REITs), 도시재생을 주로 연구하는 부동산경제학자로, 국내 대표 부동산 정보업체 부동산114를 창업해 10년간 경영한 뒤 학계로 돌아왔다. 민간임대시장의 정상화와 기업형 임대의 제도적 기반 마련을 꾸준히 제안해 왔다.",
    bioSections: [
      {
        heading: "학력",
        items: ["서울대학교 경제학과 학사", "서울대학교 대학원 경제학 박사"],
      },
      {
        heading: "주요 경력",
        items: [
          "명지대학교 부동산학과 교수(2011~현재), 미래융합대학 학장",
          "부동산114 창업자·대표이사(1999~2010)",
          "기아경제연구소 책임연구원, 한국건설산업연구원 부연구위원 역임",
          "한국주택학회 회장 역임(현 고문)",
          "(사)도시재생전략포럼 대표",
        ],
      },
      {
        heading: "주요 저서",
        items: [
          "『아파트의 경제학』(2002), 『서울리츠2030 신주거전략』(공저, 2017), 『임대주택산업론』(공저, 2021), 『인구 감소 시대 새로운 도시재생 전략』(2025) 등",
        ],
      },
    ],
  },
  {
    id: "cho-kangtae",
    photo: { src: "/images/speakers/cho-kangtae.webp", width: 1080, height: 1080 },
    name: "조강태",
    affiliation: "MGRV(맹그로브) 대표",
    sessionLabel: "주제발표2",
    sessionTitle: "커지는 임대수요, 따라가지 못하는 공급체계",
    bioSummary:
      "국내 코리빙(공유주거) 산업을 개척해 온 임팩트 디벨로퍼로, 서울 도심의 청년 임대주택 브랜드 ‘맹그로브’를 기획·개발·운영하고 있다. 경영전략 컨설팅과 임팩트 투자 경험을 바탕으로 1인 가구 시대에 맞는 새로운 임대주택 공급 모델을 실험하고 있다.",
    bioSections: [
      {
        heading: "학력",
        items: ["고려대학교 교육학과 학사"],
      },
      {
        heading: "주요 경력",
        items: [
          "MGRV(㈜엠지알브이) 대표이사(2018~현재)",
          "임팩트 투자회사 HGI 최고운영책임자(COO) 역임 — 부동산팀을 신설해 공유주거 사업 기획",
          "베인앤드컴퍼니(Bain & Company) 이사 역임 — 약 10년간 신사업·M&A·사업전략 컨설팅 수행",
        ],
      },
      {
        heading: "주요 활동",
        items: [
          "맹그로브 숭인(2020)·신설(2021)·동대문(2022)·신촌(2023) 등 서울·강원·제주 6개 지점, 약 1,300명 규모의 코리빙 하우스 개발·운영",
          "캐나다연금투자위원회(CPP Investments)와 약 5,000억 원 규모 임대주택 개발 합작법인 설립(2025)",
          "맹그로브 신촌, 2024 German Design Award 수상",
        ],
      },
    ],
  },
  {
    id: "kim-junhyung",
    photo: { src: "/images/speakers/kim-junhyung.webp", width: 1140, height: 1080 },
    name: "김준형",
    affiliation: "명지대학교 부동산학과 교수",
    sessionLabel: "주제발표3",
    sessionTitle: "장기전세주택의 성과 그리고 미래",
    bioSummary:
      "주택·부동산정책의 효과를 실증적으로 분석하는 주택정책 연구자로, 공공임대·주거복지·고령사회 부동산 문제를 주로 연구해 왔다. 1기 신도시 재정비 총괄기획가와 서울특별시 초대 주택정책수석을 맡아 연구 성과를 정책 현장에 접목해 왔다.",
    bioSections: [
      {
        heading: "학력",
        items: ["서울대학교 건축학과 학사", "서울대학교 환경대학원 도시계획학 석사·박사"],
      },
      {
        heading: "주요 경력",
        items: [
          "명지대학교 부동산학과 교수(2013~현재), 일반대학원 부동산학과 주임교수",
          "서울특별시 초대 주택정책수석(2025.8~)",
          "서울대학교 BK21사업단 조교수, 대구대학교 도시·지역계획학과 조교수 역임",
          "국토교통부 1기 신도시(고양 일산) 재정비 총괄기획가(MP), 서울특별시 도시계획위원회 위원 역임",
          "한국주택학회 학술위원장·운영위원장·주택정비연구위원회 위원장 역임",
        ],
      },
      {
        heading: "주요 저서",
        items: [
          "『임대주택산업론』(공저, 2021), 『고령사회와 부동산』(2024) 등 주택·부동산정책 관련 학술논문 60여 편",
        ],
      },
    ],
  },
  {
    id: "kim-inman",
    photo: { src: "/images/speakers/kim-inman.webp", width: 1080, height: 1080 },
    name: "김인만",
    affiliation: "김인만부동산경제연구소 대표",
    role: "사회",
    bioSummary:
      "부동산 시장 분석과 대중 소통에 주력해 온 부동산 평론가·칼럼니스트로, 방송·칼럼·강연·저술을 통해 주택시장 흐름을 알기 쉽게 전달해 왔다. 15권의 부동산 저서를 집필했으며, 다수의 연구기관과 금융사에서 부동산 자문위원으로 활동해 왔다.",
    bioSections: [
      {
        heading: "주요 경력",
        items: [
          "김인만부동산경제연구소 대표(현재)",
          "부동산중개법인 부다방 대표, 유튜브 ‘김인만의 부다방TV’ 운영",
          "LG정보통신 연구원 출신",
          "KDI(한국개발연구원) 부동산 자문위원, 부동산R114 VIP상담위원, KB국민은행 상담위원 등 역임",
          "SBS라디오·KBS라디오·JTBC 등 고정 출연, 조선일보·아시아경제 등 다수 매체 칼럼 연재",
        ],
      },
      {
        heading: "주요 저서",
        items: [
          "『한 권으로 끝내는 서울 아파트 투자지도』, 『한 권으로 끝내는 서울 재개발 투자지도』, 『대한민국 부동산은 언제까지 오를 것인가』, 『앞으로 3년, 무조건 올라가는 곳 알려드립니다』(2023) 등",
        ],
      },
    ],
  },
  {
    id: "jung-jaehoon",
    photo: { src: "/images/speakers/jung-jaehoon.webp", width: 1080, height: 1080 },
    name: "정재훈",
    affiliation: "단국대학교 도시계획부동산학부 교수",
    role: "토론",
    bioSummary:
      "부동산 데이터·통계 분석과 AI 기반 가격추정 모형을 연구하는 부동산시장 분석 전문가로, 금융권 부동산 연구 실무와 학계 연구를 두루 경험했다. 부동산 거래정책의 변화가 시장에 미치는 파급효과를 실증적으로 분석하고 있다.",
    bioSections: [
      {
        heading: "학력",
        items: ["서울대학교 건축학과 학사", "서울대학교 도시계획학 석사·박사"],
      },
      {
        heading: "주요 경력",
        items: [
          "단국대학교 도시계획부동산학부 교수(2024~현재)",
          "KB국민은행 부동산사업부 수석차장, KB부동산TV 진행 역임",
          "명지대학교 부동산학과 겸임교수 역임",
          "한국주택학회 이사, 한국부동산분석학회 이사, 한국부동산정책학회 편집위원",
        ],
      },
      {
        heading: "주요 활동",
        items: [
          "2026 한국부동산분석학회 상반기 학술대회 「부동산 거래정책 변화와 시장 파급효과」 발표",
          "부동산 가격지수 개발, 딥러닝 기반 주택가격 추정, 공간분석(GIS) 등 부동산 데이터 분석 연구 다수",
        ],
      },
    ],
  },
  {
    id: "nam-wonseok",
    photo: { src: "/images/speakers/nam-wonseok.webp", width: 1080, height: 1080 },
    name: "남원석",
    affiliation: "서울연구원 미래공간연구실 선임연구위원",
    role: "토론",
    bioSummary:
      "주거정책·주거복지를 중심으로 공공임대주택, 주거취약계층과 고령자 주거 등을 연구해 온 도시계획 연구자다. 저소득층의 주거문제와 지방정부 및 동아시아의 주거정책을 지속적으로 연구해 왔으며, 최근에는 인구·가구구조 변화에 대응한 서울의 주거정책을 중점적으로 다루고 있다.",
    bioSections: [
      {
        heading: "학력",
        items: ["서울대학교 환경대학원 도시계획학 석사·박사"],
      },
      {
        heading: "주요 경력",
        items: [
          "서울연구원(2014~현재), 현 미래공간연구실 선임연구위원·인구변화대응연구단장",
          "경기연구원 연구위원(2012~2014)",
          "한국토지주택공사(LH) 토지주택연구원 책임연구원(2007~2011)",
          "한국도시연구소 연구원 역임",
        ],
      },
      {
        heading: "주요 활동/저서",
        items: [
          "『2030 담대한 주거복지』(공저, 2023), 『주거공익법제연구』(공저, 2023), 『주거복지의 새로운 패러다임』(공저, 2011) 등",
          "「초고령사회 일본의 노인 대상 주거정책과 시사점」(2026), 「통합공공임대주택 도입에 따른 서울형 소득 연동 임대료체계 구상」(2024) 등 주거정책 연구 다수",
        ],
      },
    ],
  },
  {
    id: "lee-taehyun",
    photo: { src: "/images/speakers/lee-taehyun.webp", width: 1080, height: 1080 },
    name: "이태현",
    affiliation: "홈즈컴퍼니 대표",
    role: "토론",
    bioSummary:
      "도시계획과 부동산 개발을 기반으로 다양한 주거상품과 서비스를 기획·운영해 온 부동산 개발 전문가다. 1인 가구 증가와 라이프스타일 변화에 대응한 새로운 주거 모델을 개발하고 있으며, 국내외로 주거서비스 사업 영역을 확장하고 있다.",
    bioSections: [
      {
        heading: "학력",
        items: ["연세대학교 도시공학과 학사", "일본 규슈대학교 도시 및 지역계획학 석사·박사"],
      },
      {
        heading: "주요 경력",
        items: [
          "홈즈컴퍼니 대표이사·공동창업자(2015~현재)",
          "트리니티홀딩스 대표이사(2009~2015)",
          "삼성물산(2006~2009) — 용산국제업무지구 개발사업 담당",
          "대한주택공사(현 LH)(2002~2006) — 신도시 개발 및 주택·도시 연구 수행",
        ],
      },
      {
        heading: "주요 활동/저서",
        items: [
          "코리빙 ‘홈즈스튜디오’, 레지던스 ‘홈즈스테이’, 부동산 중개 네트워크 ‘미스터홈즈’ 등 개발·운영·중개를 결합한 주거서비스 사업 전개",
          "『코로나 시대, 부동산의 앞날』(공저, 2020)",
        ],
      },
    ],
  },
  {
    id: "lee-jonga",
    photo: { src: "/images/speakers/lee-jonga.webp", width: 1080, height: 1080 },
    name: "이종아",
    affiliation: "서울특별시 주택실 부동산정책개발센터장",
    role: "토론",
    bioSummary:
      "KB시세 개발 운영을 맡았던 부동산 데이터 전문가이자, 부동산 시장 분석과 부동산 금융 분야 연구위원을 지낸 부동산 전문가다. 2026년 7월부터 서울시 주택실 부동산정책개발센터장으로 부동산 안정 대책 연구, 정책수립에 따른 시장영향분석, 부동산 금융 세제분석과 제도개선 방안 등 부동산정책개발센터 업무를 총괄하고 있다.",
    bioSections: [
      {
        heading: "학력",
        items: ["강원대학교 부동산학과 박사", "건국대학교 부동산대학원 석사"],
      },
      {
        heading: "주요 경력",
        items: ["前 KB국민은행 KB부동산 빅데이터센터장", "前 KB 금융지주 경영연구소 부장"],
      },
    ],
  },
  {
    id: "kim-donghyun",
    photo: { src: "/images/speakers/kim-donghyun.webp", width: 1108, height: 1080 },
    name: "김동현",
    affiliation: "서울신문 부장",
    role: "토론",
    bioSummary:
      "서울신문에서 경제부와 사회2부 기자로 활동하며 부동산 시장과 주거정책, 서울시 행정과 지역사회 현안을 취재해 온 언론인이다. 주택 공급과 전월세 시장, 부동산 대책이 시민 생활에 미치는 영향을 기사와 칼럼을 통해 다뤄 왔다. 사회2부 시청팀장과 서울시청 출입기자단 간사를 역임했으며, 2025년에는 「대한민국 정신건강리포트–당신의 마음은 안녕하십니까」로 제1회 정신건강 우수보도 기자상을 수상했다.",
    bioSections: [
      {
        heading: "학력",
        items: ["한국외국어대학교 사회과학대학 행정학과 졸업(2006)"],
      },
      {
        heading: "주요 경력",
        items: ["서울신문 사회2부 시청팀장(2024)", "한국기자협회 제1회 정신건강 우수보도 기자상(2025)"],
      },
    ],
  },
];

const VISIBLE_SPEAKERS = SPEAKERS.filter((speaker) => !speaker.hidden);

/** 연사 소개 페이지의 구분. 토론자는 섭외가 끝나는 대로 이 목록에 추가한다. */
export const SPEAKER_SECTIONS: SpeakerSection[] = [
  {
    title: "기조발제",
    groups: [{ speakers: VISIBLE_SPEAKERS.filter((speaker) => speaker.sessionLabel === "기조발제") }],
  },
  {
    title: "주제발표",
    groups: [
      { speakers: VISIBLE_SPEAKERS.filter((speaker) => speaker.sessionLabel?.startsWith("주제발표")) },
    ],
  },
  {
    title: "패널토론",
    groups: [
      { label: "사회", speakers: VISIBLE_SPEAKERS.filter((speaker) => speaker.role === "사회") },
      { label: "토론", speakers: VISIBLE_SPEAKERS.filter((speaker) => speaker.role === "토론") },
    ],
  },
];
