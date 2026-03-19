'use client';

import { useEditor } from '@/contexts/EditorContext';

export default function HeroSection() {
  const { state } = useEditor();

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ minHeight: '50%' }}>
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
            padding: '0 20px',
            wordBreak: 'keep-all',
          }}
        >
          {state.heroTitle}
        </h1>
      )}

      {/* 메인 연출 이미지 */}
      {state.heroImagePreview && (
        <div className="mt-3 flex justify-center" style={{ maxHeight: '40%' }}>
          <img
            src={state.heroImagePreview}
            alt="연출 이미지"
            style={{ maxWidth: '80%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  );
}
