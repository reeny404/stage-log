# StageLog

> 라이브 콘텐츠를 발견하고, 현지 시간으로 일정을 확인하고, 함께 반응하는 글로벌 팬 웹앱

StageLog는 Mnet Plus Frontend Engineer 지원을 위해 만드는 Next.js 사이드 프로젝트입니다. 화면 개수보다 **렌더링 전략, 공용 패키지, 사용자 행동 측정, 점진 배포와 테스트**를 실제 코드로 설명하는 데 목적이 있습니다.

## 제품 가설

글로벌 팬에게 가장 큰 탐색 비용은 콘텐츠가 여러 채널에 흩어져 있고, 라이브 시작 시각을 자신의 시간대로 다시 계산해야 한다는 점입니다. StageLog는 공개 콘텐츠 탐색부터 관심 등록, 라이브 참여까지 한 흐름으로 연결합니다.

### 핵심 사용자 흐름

1. 장르와 키워드로 라이브·VOD 콘텐츠를 탐색한다.
2. 콘텐츠 상세에서 편성 시각을 자신의 시간대로 확인한다.
3. 보고 싶은 콘텐츠를 저장한다.
4. 라이브에 입장해 이모지로 반응한다.
5. 저장한 콘텐츠를 개인 목록에서 다시 찾는다.

## 현재 구현

- Next.js App Router 기반 공개 홈·상세 페이지
- 서버에서 준비한 콘텐츠 데이터와 클라이언트 탐색 상태 분리
- 검색·카테고리 필터, 현지 시간 표시, 로컬 저장 목록
- 라이브 상태와 반응 UI
- `apps/web`, `packages/ui`, `packages/analytics`로 구성한 pnpm/Turborepo 모노레포
- 타입이 보장되는 분석 이벤트 계약
- 환경변수 기반 Discovery Rail Feature Flag
- Vitest 단위 테스트, Playwright E2E 골격, GitHub Actions CI
- 렌더링 전략 ADR

## 렌더링 전략

| 영역 | 방식 | 선택 이유 |
| --- | --- | --- |
| 홈·콘텐츠 상세 | Server Component | 최초 콘텐츠와 메타데이터를 서버에서 제공해 공유·검색·초기 표시를 안정적으로 처리 |
| 검색·필터 | Client Component | 입력과 필터 변경에 즉각 반응하고 서버 왕복을 만들지 않음 |
| 저장 목록 | Client Component | 초기 단계에서는 개인정보를 서버에 저장하지 않고 브라우저에 보관 |
| 현지 시간 | Client Component | 브라우저의 실제 시간대를 기준으로 표시 |
| 라이브 반응 | Client Component | 사용자 상호작용과 추후 WebSocket 연결 경계를 분리 |

자세한 결정 배경은 [`docs/adr/0001-rendering-boundaries.md`](docs/adr/0001-rendering-boundaries.md)에 기록했습니다.

## 기술 구성

- Next.js 16, React 19, TypeScript
- pnpm workspace, Turborepo
- CSS Modules 대신 토큰 기반 Global CSS — 초기 디자인 탐색 속도와 런타임 의존성 최소화
- Vitest, Playwright, ESLint

```text
stagelog/
├── apps/
│   └── web/                 # Next.js 애플리케이션
├── packages/
│   ├── analytics/           # 이벤트 이름·속성 계약
│   └── ui/                  # 공유 UI primitives
├── docs/adr/                # 기술 의사결정 기록
├── .github/workflows/       # CI
└── TODO.md                  # 4주 실행 계획
```

## 로컬 실행

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 검증

```bash
pnpm lint
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

## 측정 계획

배포 전 수치를 임의로 작성하지 않습니다. 배포 후 아래 기준으로 baseline과 개선 결과를 같은 환경에서 기록합니다.

| 범주 | 지표 | 목표 |
| --- | --- | --- |
| 사용자 경험 | 모바일 LCP | 2.5초 이하 |
| 사용자 경험 | CLS | 0.1 이하 |
| 사용자 경험 | INP | 200ms 이하 |
| 자산 | 홈 초기 JS | baseline 대비 지속 추적 |
| 신뢰성 | 핵심 E2E | 3개 흐름 100% 통과 |
| 제품 | `content_view → favorite_added` | 퍼널 정의 및 이벤트 누락 0건 |

실측값은 배포 URL, 측정 일자, 기기/네트워크 조건과 함께 이 표에 추가합니다.

## 주요 분석 이벤트

- `content_impression`: 콘텐츠 카드 노출
- `content_view`: 콘텐츠 상세 진입
- `favorite_added`, `favorite_removed`: 저장 상태 변경
- `live_entered`: 라이브 화면 진입
- `reaction_sent`: 라이브 반응 전송
- `filter_changed`, `search_submitted`: 탐색 행동

## 로드맵

구체적인 주차별 작업과 완료 조건은 [`TODO.md`](TODO.md)를 확인해주세요.

## License

Portfolio project. All artist names, programs, schedules, artwork, and metrics are fictional.
