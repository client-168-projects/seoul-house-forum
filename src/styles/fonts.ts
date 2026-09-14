import localFont from "next/font/local";

/**
 * 타이틀/헤드라인용. Gmarket Sans는 배포용 무료 라이선스 폰트로,
 * Light/Medium/Bold 3종 정적 웨이트만 제공된다.
 */
export const gmarketSans = localFont({
  variable: "--font-gmarket",
  display: "swap",
  src: [
    {
      path: "../fonts/gmarket-sans/GmarketSansTTFLight.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/gmarket-sans/GmarketSansTTFMedium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/gmarket-sans/GmarketSansTTFBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

/**
 * 본문 텍스트용. SUIT-Variable은 가변 폰트라 100~900 전 구간을 하나의
 * 파일로 커버한다.
 */
export const suit = localFont({
  variable: "--font-suit",
  display: "swap",
  src: [
    {
      path: "../fonts/suit/SUIT-Variable.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
});
