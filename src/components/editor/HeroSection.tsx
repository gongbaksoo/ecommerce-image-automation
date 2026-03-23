'use client';

import { useEditor } from '@/contexts/EditorContext';
import type { TextStyle, TextBg } from '@/types';

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

function getTextBgStyle(bg: TextBg): React.CSSProperties {
  if (bg.type === 'none') return {};

  const base: React.CSSProperties = {
    padding: `${bg.padding}px`,
    borderRadius: `${bg.borderRadius}px`,
  };

  if (bg.type === 'solid') {
    return { ...base, backgroundColor: hexToRgba(bg.color, bg.opacity) };
  }

  if (bg.type === 'gradient') {
    return {
      ...base,
      background: `linear-gradient(${bg.gradientDirection}, ${hexToRgba(bg.color, bg.opacity)}, ${hexToRgba(bg.gradientEndColor, bg.opacity)})`,
    };
  }

  if (bg.type === 'blur') {
    return {
      ...base,
      backgroundColor: hexToRgba(bg.color, bg.opacity * 0.5),
      backdropFilter: `blur(${bg.blurAmount}px)`,
      WebkitBackdropFilter: `blur(${bg.blurAmount}px)`,
    };
  }

  return {};
}

function TextBlock({ text, style, layout, isTitle }: { text: string; style: TextStyle; layout: string; isTitle?: boolean }) {
  if (!text) return null;
  const Tag = isTitle ? 'h1' : 'p';

  return (
    <Tag
      style={{
        fontFamily: style.fontFamily,
        fontSize: `${style.fontSize}px`,
        fontWeight: style.fontWeight,
        color: style.color,
        textAlign: layout === 'text-left' ? 'left' : style.textAlign,
        lineHeight: isTitle ? 1.3 : 1.4,
        textShadow: isTitle ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.2)',
        wordBreak: 'keep-all',
        margin: 0,
      }}
    >
      {text}
    </Tag>
  );
}

export default function HeroSection() {
  const { state } = useEditor();
  const layout = state.heroContentLayout;

  const hasAnyText = state.heroTitle || state.heroSubText1 || state.heroSubText2 || state.heroSubText3;
  if (!hasAnyText) return null;

  const positionStyle: React.CSSProperties = (() => {
    switch (layout) {
      case 'text-top':
        return { justifyContent: 'flex-start', alignItems: 'center', paddingTop: '8%' };
      case 'text-center':
        return { justifyContent: 'center', alignItems: 'center' };
      case 'text-bottom':
        return { justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '8%' };
      case 'text-left':
        return { justifyContent: 'center', alignItems: 'flex-start', paddingLeft: '5%' };
      default:
        return { justifyContent: 'flex-start', alignItems: 'center', paddingTop: '8%' };
    }
  })();

  const bgStyle = getTextBgStyle(state.heroTextBg);

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
      <div
        style={{
          maxWidth: layout === 'text-left' ? '40%' : '90%',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          ...bgStyle,
        }}
      >
        <TextBlock text={state.heroSubText1} style={state.heroSubText1Style} layout={layout} />
        <TextBlock text={state.heroTitle} style={state.heroTitleStyle} layout={layout} isTitle />
        <TextBlock text={state.heroSubText2} style={state.heroSubText2Style} layout={layout} />
        <TextBlock text={state.heroSubText3} style={state.heroSubText3Style} layout={layout} />
      </div>
    </div>
  );
}
