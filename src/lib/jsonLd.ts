import { OG_IMAGE, SITE_URL } from "@/constants/site";
import { EVENT_INFO } from "@/data/event";

/** EVENT_INFO의 표시용 날짜/시간(2026.10.07, 13:00-16:00)을 KST ISO 문자열로 바꾼다. */
function toIso(time: string): string {
  const [hour, minute] = time.split(":");
  return `${EVENT_INFO.date.replaceAll(".", "-")}T${hour.padStart(2, "0")}:${minute}:00+09:00`;
}

const [startTime, endTime] = EVENT_INFO.time.split("-");

const ORGANIZATION = {
  "@type": "GovernmentOrganization",
  name: EVENT_INFO.host,
  url: EVENT_INFO.hostUrl,
} as const;

/** 사이트 자체를 알리는 구조화 데이터. 검색 결과의 사이트 이름 표기에 쓰인다. */
export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: EVENT_INFO.name,
    alternateName: "서울주거포럼",
    url: SITE_URL,
    inLanguage: "ko",
    description: `${EVENT_INFO.theme} - ${EVENT_INFO.themeSubtitle}`,
    publisher: ORGANIZATION,
  };
}

/** 행사 구조화 데이터. 검색 결과에 일시·장소가 함께 표시되도록 홈에 넣는다. */
export function buildEventJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: EVENT_INFO.name,
    description: `${EVENT_INFO.theme} - ${EVENT_INFO.themeSubtitle}`,
    image: [`${SITE_URL}${OG_IMAGE.url}`],
    startDate: toIso(startTime),
    endDate: toIso(endTime),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: "ko",
    url: SITE_URL,
    location: {
      "@type": "Place",
      name: EVENT_INFO.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: EVENT_INFO.address,
        addressLocality: "서울",
        addressCountry: "KR",
      },
    },
    organizer: ORGANIZATION,
    performer: EVENT_INFO.organizers.map((organizer) => ({
      "@type": "Organization",
      name: organizer.name,
      url: organizer.url,
    })),
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "KRW",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/register`,
    },
  };
}

export function buildNoticeJsonLd(notice: { id: number; title: string; contentText: string; createdAt: string; updatedAt: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: notice.title,
    description: notice.contentText.slice(0, 200),
    datePublished: notice.createdAt,
    dateModified: notice.updatedAt,
    inLanguage: "ko",
    mainEntityOfPage: `${SITE_URL}/community/notice/${notice.id}`,
    publisher: ORGANIZATION,
    author: ORGANIZATION,
  };
}

/** HOME > 그룹 > 현재 페이지 구조를 검색엔진에도 동일하게 알려 준다. */
export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "홈", path: "/" }, ...items].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
