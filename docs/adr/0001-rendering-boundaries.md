# ADR 0001: 공개 콘텐츠와 개인 상태의 렌더링 경계

- 상태: Accepted
- 날짜: 2026-09-14

## Context

StageLog는 검색 엔진과 공유 링크로 유입되는 공개 콘텐츠와 브라우저에서 빠르게 반응해야 하는 개인 상태를 함께 다룹니다. 모든 화면을 Client Component로 만들면 초기 JavaScript와 hydration 범위가 커지고, 모든 상호작용을 서버 요청으로 처리하면 탐색 경험이 느려집니다.

## Decision

- 콘텐츠 목록, 상세 정보와 메타데이터는 Server Component에서 준비합니다.
- 검색, 카테고리 필터, 저장 버튼, 현지 시간과 라이브 반응만 Client Component로 둡니다.
- 서버 데이터를 Client Component로 전달할 때 직렬화 가능한 최소 필드만 사용합니다.
- 저장 기능은 MVP에서 localStorage를 사용하되 저장소 접근을 adapter에 가둬 서버 저장으로 교체할 수 있게 합니다.

## Consequences

- 공개 콘텐츠는 HTML에 포함되어 최초 표시와 공유에 유리합니다.
- hydration 범위와 클라이언트 번들 책임을 상호작용 영역으로 제한할 수 있습니다.
- localStorage 기반 저장은 기기 간 동기화되지 않습니다. Week 2에서 인증과 서버 저장을 추가할 때 병합 정책이 필요합니다.
