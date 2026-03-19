'use client';

import { useEditor } from '@/contexts/EditorContext';

export default function HeroSection() {
  const { state } = useEditor();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: state.layoutType === 'hero-only' ? 1 : 'none',
        padding: '15px 20px',
      }}
    >
      {/* 메인 문구 */}
      {state.heroTitle && (
        <h1
          style={{
            fontFamily: state.heroTitleStyle.fontFamily,
            fontSize: `${state.heroTitleStyle.fontSize}px`,
            fontWeight: state.heroTitleStyle.fontWeight,
            color: state.heroTitleStyle.color,
            textAlign: state.heroTitleStyle.textAlign,
            lineHeight: 1.3,
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            wordBreak: 'keep-all',
          }}
        >
          {state.heroTitle}
        </h1>
      )}

      {/* 메인 연출 이미지 */}
      {state.heroImagePreview && (
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={state.heroImagePreview}
            alt="연출 이미지"
            style={{ maxWidth: '60%', maxHeight: '150px', objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  );
}
