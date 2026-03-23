# Error Log

## ERR-001: React Hooks 호출 순서 위반 (BackgroundCropSelector)

- **발생일**: 2026-03-23
- **컴포넌트**: `BackgroundCropSelector.tsx`
- **증상**: `React has detected a change in the order of Hooks called by BackgroundCropSelector`
- **원인**: 조건부 early return (`if (!state.backgroundImage || !spec || imgSize.w === 0) return null`) 이후에 `useCallback`, `useEffect` hooks가 호출됨. 렌더 조건에 따라 hooks 호출 개수가 달라져 React Rules of Hooks 위반.
- **해결**: 모든 hooks를 early return 전에 배치. 조건부 계산은 `useMemo` 내부에서 null 반환으로 처리하고, `useCallback` 내부에서 null 체크로 실행만 조건부 처리.
- **분류**: 근본적 해결 (hooks 호출 순서가 매 렌더에서 동일하게 보장됨)
- **교훈**: 컴포넌트에서 early return을 사용할 때는 반드시 모든 hooks 호출 이후에 배치해야 함.

## ERR-002: Turbopack Permission denied (Next.js 캐시)

- **발생일**: 2026-03-22
- **증상**: `Error [TurbopackInternalError]: Permission denied (os error 13)` — dev 서버 시작 실패
- **원인**: `.next` 캐시 디렉토리 권한 문제
- **해결**: `rm -rf .next` 후 dev 서버 재시작
- **분류**: 환경 문제 (일시적)

## ERR-003: AI 배경 생성 시 텍스트 영역이 비어있음

- **발생일**: 2026-03-23
- **컴포넌트**: `route.ts` (generate-background API)
- **증상**: 문구 위치를 "상단"으로 설정하면 AI가 이미지 상단 30%를 아예 비워버림 (빈 공간/흰색 영역)
- **원인**: 프롬프트에 "Keep the top 30% clear for text overlay"라고 지시 → AI가 배경 자체를 비운 것으로 해석
- **해결**: 프롬프트를 "배경은 전체를 빈틈 없이 채우되, 메인 상품 위치만 텍스트 영역을 피해 배치하라"로 변경. `[TEXT OVERLAY ZONE]` → `[PRODUCT PLACEMENT]` 태그 변경. `[BACKGROUND RULE]` 추가하여 배경 전체 채움 강제.
- **분류**: 근본적 해결 (프롬프트 의도 명확화)
- **교훈**: AI 프롬프트에서 "clear" / "keep empty" 표현은 배경 자체를 비우는 것으로 해석될 수 있음. "상품 위치만 조절"과 "배경 전체 채움"을 분리하여 지시해야 함.
