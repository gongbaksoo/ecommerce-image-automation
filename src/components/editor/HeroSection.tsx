'use client';

import { useEditor } from '@/contexts/EditorContext';
import type { TextStyle } from '@/types';

function SubText({ text, style, layout }: { text: string; style: TextStyle; layout: string }) {
  if (!text) return null;
  return (
    <p
      style={{
        fontFamily: style.fontFamily,
        fontSize: `${style.fontSize}px`,
        fontWeight: style.fontWeight,
        color: style.color,
        textAlign: layout === 'text-left' ? 'left' : style.textAlign,
        lineHeight: 1.4,
        textShadow: '0 1px 4px rgba(0,0,0,0.2)',
        wordBreak: 'keep-all',
        margin: 0,
      }}
    >
      {text}
    </p>
  );
}

export default function HeroSection() {
  const { state } = useEditor();
  const layout = state.heroContentLayout;

  const hasAnyText = state.heroTitle || state.heroSubText1 || state.heroSubText2 || state.heroSubText3;
  if (!hasAnyText) return null;

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
      <div style={{ maxWidth: layout === 'text-left' ? '40%' : '90%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* 서브 문구 1 (메인 문구 위) */}
        <SubText text={state.heroSubText1} style={state.heroSubText1Style} layout={layout} />

        {/* 메인 문구 */}
        {state.heroTitle && (
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
            }}
          >
            {state.heroTitle}
          </h1>
        )}

        {/* 서브 문구 2 (메인 문구 아래) */}
        <SubText text={state.heroSubText2} style={state.heroSubText2Style} layout={layout} />

        {/* 서브 문구 3 (서브 문구 2 아래) */}
        <SubText text={state.heroSubText3} style={state.heroSubText3Style} layout={layout} />
      </div>
    </div>
  );
}
