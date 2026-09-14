# StageLog — 피크 이벤트 재구성 TODO

각 단계는 사용자에게 보이는 결과 하나와 검증 가능한 기술 결정 하나로 끝낸다.

## Phase 1 — 이벤트와 입장 경계

- [x] 홈을 콘텐츠 탐색에서 피크 이벤트 문제 중심으로 전환
- [x] 정적 이벤트 셸과 현지 시각 경계 구현
- [x] 정상·피크·의존성 장애 Traffic Lab 구현
- [x] 입장 POST와 대기 상태 GET 분리
- [x] idempotency key 기반 요청 계약 구현
- [x] admission 순수 로직 단위 테스트
- [x] 홈 → 대기 → 입장 E2E
- [x] 아키텍처·정직성 경계 문서화

완료 조건: 세 시나리오를 반복 실행할 수 있고, 공개 셸과 개인 입장 상태를 분리한 이유가 README에 명시되어 있다.

## Phase 2 — 실제 측정 가능한 부하 실험

- [x] k6 이벤트 읽기·입장 쓰기 시나리오 작성
- [ ] 격리된 테스트 배포 환경 결정
- [ ] cache header와 CDN 설정 확인
- [ ] baseline 실행 결과 원본 저장
- [ ] event shell과 admission p95·실패율 비교
- [ ] 캐시/요청 전략 개선 후 같은 조건으로 재측정
- [ ] 실행 환경, commit, 날짜가 포함된 결과 문서 작성

완료 조건: “몇 명을 처리했다”가 아니라 어떤 조건에서 어떤 병목을 발견하고 개선했는지 재현할 수 있다.

## Phase 3 — Timed Drop 하나 완성

- [ ] 첫 번째 투표 drop 도메인 모델
- [ ] `pending`, `confirmed`, `unknown`, `failed` 제출 상태
- [ ] 중복 제출 방지 adapter
- [ ] 집계 읽기 장애 시 read-only UI
- [ ] 두 브라우저 간 결과 갱신
- [ ] 투표 중복·실패·복구 단위 테스트와 E2E
- [ ] ADR: 쓰기 확정 상태와 optimistic UI 범위

완료 조건: 네트워크가 끊긴 시점에도 사용자가 자신의 투표가 확정됐는지 정확히 알 수 있다.

## Phase 4 — 운영과 관측

- [ ] 기능별 `normal`, `read-only`, `paused` 운영 모드
- [ ] 운영 상태 변경 사유와 audit log
- [ ] 오류 수집 adapter와 correlation id
- [ ] admission·polling·drop 핵심 지표 대시보드
- [ ] feature flag 점진 노출과 즉시 rollback
- [ ] API 지연·503·연결 끊김 장애 주입 E2E
- [ ] 접근성 자동 검사

완료 조건: 장애를 재현하고, 탐지하고, 기능 하나만 제한하고, 복구하는 흐름을 60초 데모로 보여줄 수 있다.

## Phase 5 — 검증 결과 정리

- [ ] 모바일 360px·390px·430px 실제 확인
- [ ] Lighthouse baseline과 개선 결과 기록
- [ ] 불필요한 Client Component 및 초기 JS 분석
- [ ] 새로운 환경에서 install, lint, test, build, E2E 재현
- [ ] 문제 → 판단 → 구현 → 검증 → 한계 케이스 스터디
- [ ] 정상·피크·장애 60초 데모 영상

## 일정이 밀릴 때 제거 순서

1. 두 번째·세 번째 timed drop 구현
2. 실시간 랭킹 애니메이션
3. 운영 화면 시각화
4. 기존 VOD archive 개선

입장 상태 정확성, 장애 복구, 부하 실험 재현성은 마지막까지 유지한다.

## 회고 템플릿

```text
이번에 검증한 가설:
실행 환경과 commit:
관찰한 수치:
예상과 달랐던 점:
바꾼 설계:
아직 증명하지 못한 것:
```
