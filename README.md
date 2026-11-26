# 디쉬패치 업주 웹

업주(점주)용 웹. React 19, TypeScript, Vite. API는 백엔드 `owner-server`(8082)를 호출한다.

## 실행
1. Node 22 이상 설치
2. `npm install`
3. `cp .env.example .env.local` (기본값 그대로 써도 된다)
4. 백엔드 `owner-server` 실행 (backend 저장소 README 참고)
5. `npm run dev` → http://localhost:5173

| 명령 | 용도 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입 검사 + 배포용 빌드 (`dist/`) |
| `npm run lint` | ESLint 검사 |
| `npm run preview` | 빌드 결과 미리보기 |

## API 호출
- 모든 호출은 `src/api/client.ts`의 `client`(axios)를 쓴다.
- `/api/...` 요청은 vite 프록시가 `OWNER_API_URL`(기본 `http://localhost:8082`)로 넘긴다. 로컬에서 CORS 설정이 필요 없다.

## 로그인 없이 테스트하기
`.env.local`의 `VITE_TEST_USER_ID`, `VITE_TEST_ROLE` 값이 백엔드의 `X-Test-User-Id`, `X-Test-Role` 헤더로 자동으로 붙는다.

## 폴더 규칙
백엔드처럼 계층 먼저, 그 안에서 기능 폴더로 나눈다.
기능: `order`(주문), `menu`(메뉴), `review`(리뷰), `store`(가게), `image`(이미지 업로드)

```
src/
├── api/        서버 호출 함수          api/order/orderApi.ts
├── hooks/      화면에서 쓰는 훅         hooks/order/useOrders.ts
├── pages/      라우트 하나당 화면 하나   pages/order/OrderListPage.tsx
├── components/ 화면 조각               components/order/OrderCard.tsx
│   ├── common/   여러 기능이 함께 쓰는 버튼·모달 등
│   └── layout/   공통 레이아웃(사이드바)
├── types/      요청·응답 타입           types/order.ts, common.ts(백엔드 enum)
├── router/     라우트 목록
├── styles/     전역 CSS
└── utils/      날짜·금액 포맷 등
```
- 타입 이름·enum 값은 백엔드 DTO와 맞춘다 (`types/common.ts`의 `OrderStatus`, `Role`).
- 새 화면은 `pages/기능/`에 만들고 `router/index.tsx`에 등록한다.

## 브랜치
`main`에는 PR로만 반영한다. 작업 브랜치 이름은 `feature/번호-설명` 또는 `feature/설명` (예: `feature/33-order-list`, `feature/order-list`).

## 커밋 메시지
`종류: 내용` 형식으로 쓴다. Jira 번호는 붙이지 않거나, 붙일 때는 `DUDU-` 없이 번호만 쓴다.
예: `feat: 주문 목록 화면`, `feat: 주문 목록 화면 (#33)`, `fix: 메뉴 가격 입력 검증`
종류: `feat`(기능), `fix`(수정), `refactor`(구조 개선), `docs`(문서), `test`(테스트), `chore`(설정·빌드)
