# 2026 서울주거포럼

Next.js(App Router) + Cloudflare Workers(OpenNext) + D1 + R2.

## 로컬 개발

```bash
pnpm install
pnpm db:migrate:local          # D1 스키마 적용 (.wrangler/state 의 로컬 SQLite)
pnpm db:seed:local             # 선택: 샘플 공지/의견
ADMIN_USERNAME=... ADMIN_PASSWORD=... pnpm admin:create --local
pnpm dev
```

로컬 비밀 값은 `.dev.vars`(커밋 금지)에 둔다.

| 이름 | 용도 |
| --- | --- |
| `TURNSTILE_SECRET_KEY` | Turnstile 서버 검증. 로컬은 Cloudflare 테스트 키 `1x0000000000000000000000000000000AA` |
| `GA4_CLIENT_EMAIL` | GA4 Data API 서비스 계정 이메일. 비우면 대시보드가 샘플 데이터로 표시됨 |
| `GA4_PRIVATE_KEY` | 서비스 계정 JSON의 `private_key` (줄바꿈은 `\n` 그대로 넣어도 됨) |
| `BOARD_AUTHOR_KEY` | 자유게시판 작성자 이름 암호화 키(AES-256). `openssl rand -base64 32`로 생성. 바꾸면 기존 이름을 복호화할 수 없음 |

`wrangler.jsonc`의 `vars`에는 공개 값만 둔다: `TURNSTILE_SITE_KEY`, `GA4_PROPERTY_ID`.
바인딩이나 vars를 바꾸면 `pnpm cf-typegen`으로 타입을 다시 만든다.

## 배포 전 준비

1. D1/R2 생성 후 `wrangler.jsonc`의 `database_id` 교체
   ```bash
   pnpm exec wrangler d1 create seoul-house-forum-db
   pnpm exec wrangler r2 bucket create seoul-house-forum-files
   pnpm db:migrate:remote
   ADMIN_USERNAME=... ADMIN_PASSWORD=... pnpm admin:create --remote
   ```
2. Turnstile 위젯 생성(Cloudflare 대시보드) 후 `TURNSTILE_SITE_KEY`를 실제 사이트 키로 교체하고 시크릿 등록
   ```bash
   pnpm exec wrangler secret put TURNSTILE_SECRET_KEY
   pnpm exec wrangler secret put BOARD_AUTHOR_KEY
   ```
3. GA4: 서비스 계정을 만들어 GA4 속성에 **뷰어** 권한으로 추가하고, `GA4_PROPERTY_ID`(숫자)를 vars에 넣은 뒤
   ```bash
   pnpm exec wrangler secret put GA4_CLIENT_EMAIL
   pnpm exec wrangler secret put GA4_PRIVATE_KEY
   ```
4. `NEXT_PUBLIC_SITE_URL`에 운영 도메인 지정 (sitemap/robots)

## 구조 요약

- 공개 페이지: `src/app/(site)/*` / 관리자: `src/app/admin/*` (로그인 제외 `(panel)` 그룹)
- REST API
  - `GET /api/notices`, `GET /api/notices/:id` 공개 / `POST`, `PATCH`, `DELETE` 관리자
  - `GET /api/board` 승인된 의견 / `POST /api/board` 의견 등록(검수 대기)
  - `GET|PATCH|DELETE /api/admin/board` 검수, `POST /api/admin/uploads` R2 업로드, `GET /api/admin/analytics` GA4
  - `GET /api/files/:key` R2 파일 서빙(첨부는 항상 다운로드)
- 인증: D1 세션(쿠키엔 랜덤 토큰, DB엔 SHA-256 해시), PBKDF2 비밀번호, IP 기준 로그인 실패 잠금
  - `src/proxy.ts` 낙관적 검사 -> `src/lib/server/auth/dal.ts`에서 페이지/API마다 재검증
  - 상태 변경 API는 Origin 검사 + `SameSite=Strict` 쿠키로 CSRF 차단
- 자유게시판 등록 방어: 동의 2종 필수, Turnstile, 허니팟, 최소 작성 시간, IP 10초 쿨다운/시간당 20건, 24시간 중복 차단, 링크/연락처/금칙어 차단, 운영자 승인 후 공개. IP/UA는 30일 뒤 자동 파기
- 작성자 이름: 공개용 마스킹 값(김ㅇㅇ)만 평문 저장, 원문은 AES-GCM 암호화 후 관리자 화면에서만 복호화
- 공지 본문: TipTap JSON 저장 -> 서버에서 화이트리스트 정리 후 스키마 기반 HTML 렌더링
