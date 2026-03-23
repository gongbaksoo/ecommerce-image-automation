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
