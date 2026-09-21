/**
 * 구조화 데이터(JSON-LD) 삽입. 값은 서버에서 만든 객체만 받고,
 * </script> 로 스크립트가 끊기지 않도록 이스케이프한다.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll("<", "\\u003c") }}
    />
  );
}
