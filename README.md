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

## 화면
디자인: Figma `점주 웹` 페이지 (OWN-01 ~ OWN-11)

| 경로 | 화면 | 디자인 |
|---|---|---|
| `/login` | 로그인 | OWN-01 |
| `/orders` | 주문판 (신규 팝업, 접수, 거절, 조리, 픽업, 영업 상태, 로그아웃) | OWN-02 ~ OWN-11 |

주문판 상태 탭과 백엔드 `OrderStatus` 매핑은 `src/constants/order.ts`에 있다.
지금은 `src/mocks/` 목업 데이터로 동작한다. 백엔드 연동 시 `hooks/order/useOrderBoard.ts`의 각 동작을 `api/order` 호출로 바꾼다.

## 폴더 규칙
백엔드처럼 계층 먼저, 그 안에서 기능 폴더로 나눈다.
기능: `auth`(로그인), `order`(주문판), `store`(가게·영업 상태), `menu`, `review`, `image`

```
src/
├── api/        서버 호출 함수            api/order/orderApi.ts
├── hooks/      화면에서 쓰는 훅           hooks/order/useOrderBoard.ts
├── pages/      라우트 하나당 화면 하나     pages/order/OrderBoardPage.tsx
├── components/ 화면 조각                 components/order/OrderDetail.tsx
│   ├── common/   버튼·상태 칩·모달·토스트 등 공통 부품
│   └── layout/   상단 바, 띠 배너, 로그아웃 모달
├── constants/  상태 탭, 거절 사유 등 고정 값
├── mocks/      백엔드 연동 전 목업 데이터
├── types/      요청·응답 타입              types/order.ts, common.ts(백엔드 enum)
├── router/     라우트 목록
├── styles/     전역 CSS (색상 변수 포함)
└── utils/      금액·시간 포맷 등
```
- 타입 이름·enum 값은 백엔드 DTO와 맞춘다 (`types/common.ts`의 `OrderStatus`, `Role`).
- 새 화면은 `pages/기능/`에 만들고 `router/index.tsx`에 등록한다.
- 컴포넌트 이름은 Figma `Components(점주)`의 이름을 따른다 (예: `점주/주문서 상세` → `OrderDetail`).

## 브랜치
`main`에는 PR로만 반영한다. 작업 브랜치 이름은 `feature/번호-설명` 또는 `feature/설명` (예: `feature/33-order-list`, `feature/order-list`).

## 커밋 메시지
`종류: 내용` 형식으로 쓴다. Jira 번호는 붙이지 않거나, 붙일 때는 `DUDU-` 없이 번호만 쓴다.
예: `feat: 주문 목록 화면`, `feat: 주문 목록 화면 (#33)`, `fix: 메뉴 가격 입력 검증`
종류: `feat`(기능), `fix`(수정), `refactor`(구조 개선), `docs`(문서), `test`(테스트), `chore`(설정·빌드)
