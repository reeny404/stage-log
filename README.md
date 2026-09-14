# StageLog

> 모든 팬이 한꺼번에 도착하는 순간에도 안정적인 글로벌 이벤트 입장 경험

StageLog는 Mnet Plus Frontend Engineer 지원을 위해 만드는 Next.js 포트폴리오 프로젝트입니다. 실제 라이브 영상을 중계하는 대신, 시상식·콘서트 오픈 직후 발생하는 **읽기 트래픽 급증, 개인 입장 요청, 실시간 기능 장애를 서로 격리하는 프론트엔드 경험**에 집중합니다.

실제 대규모 사용자를 운영했다고 주장하지 않습니다. 정상·피크·의존성 장애를 같은 코드에서 재현하고, 별도 부하 시나리오로 기술 가설을 검증합니다. 상세 범위는 [`docs/PRD.md`](docs/PRD.md), 실행 순서는 [`TODO.md`](TODO.md)에 있습니다.

## 핵심 사용자 흐름

1. 사용자는 캐시 가능한 이벤트 페이지에서 일정과 참여 규칙을 확인한다.
2. 입장 요청 시 현재 용량에 따라 즉시 입장하거나 대기열에 배치된다.
3. 대기 중 상태만 조회하며 최초 요청을 중복 제출하지 않는다.
4. 일부 기능이 실패해도 이벤트 정보와 안전한 재시도 경로는 유지된다.
5. 입장 후 투표·콘텐츠 드롭·미션이 독립적으로 열린다.

## 현재 구현

- Next.js App Router 기반 정적 이벤트 셸과 작은 Client Component 경계
- 정상, 피크 유입, 의존성 장애를 선택할 수 있는 입장 계약 시뮬레이션
- idempotency key를 사용한 입장 요청과 상태 조회 분리
- 503, `Retry-After`, `no-store`를 포함한 데모 Route Handler 계약
- 공개 이벤트 셸과 개인화 쓰기를 분리한 k6 부하 시나리오
- 타입이 보장되는 입장 분석 이벤트
- Vitest 단위 테스트, Playwright E2E, GitHub Actions CI
- 기존 콘텐츠/VOD 탐색 코드는 후속 경험을 위한 archive로 유지

## 중요한 정직성 경계

`/api/demo/*`는 UI 상태와 네트워크 계약을 반복해서 보여주는 stateless simulation입니다. 분산 대기열, 영속 저장소, 봇 방어 또는 실제 동시 접속자를 구현하지 않습니다. 공개할 수 있는 결과는 다음처럼 표현합니다.

> 지정한 테스트 환경에서 가상 요청을 재현해 이벤트 셸과 입장 쓰기의 응답 시간·실패율을 비교했다.

“수만 명의 실제 사용자를 처리했다”는 표현은 사용하지 않습니다.

## 시스템 경계

| 경로 | 성격 | 실패 시 사용자 경험 |
| --- | --- | --- |
| 이벤트 셸 | 공개·읽기 중심·캐시 가능 | 일정과 규칙을 계속 확인 가능 |
| 입장 요청 | 개인화·쓰기·중복 방지 | 대기열 전환 또는 안전한 재시도 |
| 대기 상태 | 짧은 폴링·읽기 | 마지막 위치를 유지하고 갱신 재시도 |
| 투표·랭킹 | 선택적 실시간 기능 | 해당 기능만 일시 중단, 이벤트는 유지 |

자세한 결정 배경은 [`docs/adr/0001-rendering-boundaries.md`](docs/adr/0001-rendering-boundaries.md)와 새 ADR에 기록합니다.

## 기술 구성

- Next.js 16, React 19, TypeScript
- pnpm workspace, Turborepo
- CSS Modules 대신 토큰 기반 Global CSS — 초기 디자인 탐색 속도와 런타임 의존성 최소화
- Vitest, Playwright, ESLint

```text
stagelog/
├── apps/
│   ├── web/                 # 이벤트 웹앱과 데모 API 계약
│   └── load-tests/          # 재현 가능한 k6 피크 시나리오
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

## 검증 계획

부하 결과를 기록할 때 배포 URL, commit, 측정 일자, 실행 환경과 원본 요약을 함께 남깁니다. 수치는 실행 전 가정일 뿐 성과처럼 쓰지 않습니다.

| 범주 | 지표 | 목표 |
| --- | --- | --- |
| 사용자 경험 | 모바일 LCP | 2.5초 이하 |
| 사용자 경험 | CLS | 0.1 이하 |
| 사용자 경험 | INP | 200ms 이하 |
| 자산 | 홈 초기 JS | baseline 대비 지속 추적 |
| 신뢰성 | 핵심 E2E | 입장·저장·기존 라이브 데모 100% 통과 |
| 부하 실험 | 이벤트 셸 p95 | 동일 테스트 환경에서 500ms 미만 가설 |
| 부하 실험 | 입장 요청 p95 | 동일 테스트 환경에서 800ms 미만 가설 |

실측값은 배포 URL, 측정 일자, 기기/네트워크 조건과 함께 이 표에 추가합니다.

## 부하 시나리오

k6가 설치된 환경에서 웹앱을 실행한 뒤 테스트합니다.

```bash
k6 run apps/load-tests/event-spike.js
```

기본 시나리오는 캐시 친화적인 이벤트 읽기와 개인화된 입장 쓰기를 별도 태그로 측정합니다. 운영 서비스가 아닌 격리된 테스트 환경에서만 실행합니다.

## 로드맵

구체적인 주차별 작업과 완료 조건은 [`TODO.md`](TODO.md)를 확인해주세요.

## License

Portfolio project. All artist names, programs, schedules, artwork, and metrics are fictional.
