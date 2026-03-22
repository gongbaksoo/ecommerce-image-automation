'use client';

import { useEditor } from '@/contexts/EditorContext';

export default function HeroSection() {
  const { state } = useEditor();
  const layout = state.heroContentLayout;

  if (!state.heroTitle) return null;

  // 레이아웃별 텍스트 위치 스타일
  const positionStyle: React.CSSProperties = (() => {
    switch (layout) {
      case 'text-top':
        return {
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: '8%',
        };
      case 'text-center':
        return {
          justifyContent: 'center',
          alignItems: 'center',
        };
      case 'text-bottom':
        return {
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: '8%',
        };
      case 'text-left':
        return {
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingLeft: '5%',
        };
      default:
        return {
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: '8%',
        };
    }
  })();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '15px 20px',
        ...positionStyle,
      }}
    >
      <h1
        style={{
          fontFamily: state.heroTitleStyle.fontFamily,
          fontSize: `${state.heroTitleStyle.fontSize}px`,
          fontWeight: state.heroTitleStyle.fontWeight,
          color: state.heroTitleStyle.color,
          textAlign: layout === 'text-left' ? 'left' : state.heroTitleStyle.textAlign,
          lineHeight: 1.3,
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          wordBreak: 'keep-all',
          margin: 0,
          maxWidth: layout === 'text-left' ? '40%' : '90%',
        }}
      >
        {state.heroTitle}
      </h1>
    </div>
  );
}
