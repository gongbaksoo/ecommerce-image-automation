'use client';

import { useMemo, useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { usePlatforms } from '@/hooks/usePlatforms';
import { formatPrice } from '@/lib/utils/formatPrice';
import type { TextStyle, TextBg } from '@/types';

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

function textBgCss(bg: TextBg): string {
  if (bg.type === 'none') return '';
  const lines: string[] = [
    `padding: ${bg.padding}px;`,
    `border-radius: ${bg.borderRadius}px;`,
  ];
  if (bg.type === 'solid') {
    lines.push(`background-color: ${hexToRgba(bg.color, bg.opacity)};`);
  } else if (bg.type === 'gradient') {
    lines.push(`background: linear-gradient(${bg.gradientDirection}, ${hexToRgba(bg.color, bg.opacity)}, ${hexToRgba(bg.gradientEndColor, bg.opacity)});`);
  } else if (bg.type === 'blur') {
    lines.push(`background-color: ${hexToRgba(bg.color, bg.opacity * 0.5)};`);
    lines.push(`backdrop-filter: blur(${bg.blurAmount}px);`);
    lines.push(`-webkit-backdrop-filter: blur(${bg.blurAmount}px);`);
  }
  return lines.join('\n      ');
}

function textCss(style: TextStyle, layout: string, isTitle?: boolean): string {
  const align = layout === 'text-left' ? 'left' : style.textAlign;
  return [
    `font-family: ${style.fontFamily};`,
    `font-size: ${style.fontSize}px;`,
    `font-weight: ${style.fontWeight};`,
    `color: ${style.color};`,
    `text-align: ${align};`,
    `line-height: ${isTitle ? 1.3 : 1.4};`,
    `text-shadow: ${isTitle ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.2)'};`,
    `word-break: keep-all;`,
    `margin: 0;`,
  ].join('\n        ');
}

function indent(str: string, level: number): string {
  const pad = '  '.repeat(level);
  return str.split('\n').map(l => pad + l).join('\n');
}

export default function CodePanel() {
  const { state } = useEditor();
  const { platforms } = usePlatforms();
  const [copied, setCopied] = useState(false);

  const platform = platforms.find((p) => p.id === state.selectedPlatformId);
  const spec = platform?.imageSpecs.find((s) => s.id === state.selectedImageSpecId);

  const html = useMemo(() => {
    if (!spec) return '';

    const layout = state.heroContentLayout;
    const showHero = state.layoutType === 'hero-only' || state.layoutType === 'hero-products';
    const showProducts = state.layoutType === 'products-only' || state.layoutType === 'hero-products';

    // 배경 스타일
    let bgCss = '';
    if (state.backgroundType === 'color') {
      bgCss = `background-color: ${state.backgroundColor};`;
    } else if (state.backgroundImage) {
      const bgSize = state.bgCropZoom > 1 ? `${state.bgCropZoom * 100}%` : 'cover';
      bgCss = [
        `background-image: url('배경이미지.jpg');`,
        `background-size: ${bgSize};`,
        `background-position: ${state.bgCropX}% ${state.bgCropY}%;`,
      ].join('\n    ');
    }

    // 히어로 위치
    const posMap: Record<string, string> = {
      'text-top': 'justify-content: flex-start; align-items: center; padding-top: 8%;',
      'text-center': 'justify-content: center; align-items: center;',
      'text-bottom': 'justify-content: flex-end; align-items: center; padding-bottom: 8%;',
      'text-left': 'justify-content: center; align-items: flex-start; padding-left: 5%;',
    };

    const lines: string[] = [];

    lines.push(`<div class="banner" style="`);
    lines.push(`    width: ${spec.width}px;`);
    lines.push(`    height: ${spec.height}px;`);
    lines.push(`    position: relative;`);
    lines.push(`    overflow: hidden;`);
    lines.push(`    ${bgCss}`);
    lines.push(`">`);

    lines.push(`  <div style="display: flex; flex-direction: column; height: 100%;">`);

    // 히어로
    if (showHero) {
      const hasText = state.heroTitle || state.heroSubText1 || state.heroSubText2 || state.heroSubText3;
      if (hasText) {
        lines.push(`    <!-- 히어로 영역 -->`);
        lines.push(`    <div style="display: flex; flex-direction: column; flex: 1; padding: 15px 20px; ${posMap[layout] || ''}">`);

        const bgStyleStr = textBgCss(state.heroTextBg);
        const maxW = layout === 'text-left' ? '40%' : '90%';
        lines.push(`      <div style="max-width: ${maxW}; display: flex; flex-direction: column; gap: 6px;${bgStyleStr ? '\n      ' + bgStyleStr : ''}">`);

        if (state.heroSubText1) {
          lines.push(`        <p style="${textCss(state.heroSubText1Style, layout)}">`);
          lines.push(`          ${state.heroSubText1}`);
          lines.push(`        </p>`);
        }
        if (state.heroTitle) {
          lines.push(`        <h1 style="${textCss(state.heroTitleStyle, layout, true)}">`);
          lines.push(`          ${state.heroTitle}`);
          lines.push(`        </h1>`);
        }
        if (state.heroSubText2) {
          lines.push(`        <p style="${textCss(state.heroSubText2Style, layout)}">`);
          lines.push(`          ${state.heroSubText2}`);
          lines.push(`        </p>`);
        }
        if (state.heroSubText3) {
          lines.push(`        <p style="${textCss(state.heroSubText3Style, layout)}">`);
          lines.push(`          ${state.heroSubText3}`);
          lines.push(`        </p>`);
        }

        lines.push(`      </div>`);
        lines.push(`    </div>`);
      }
    }

    // 상품 그리드
    if (showProducts && state.products.length > 0) {
      lines.push(`    <!-- 상품 그리드 -->`);
      lines.push(`    <div style="flex: 1; display: grid; grid-template-columns: repeat(${state.productColumns}, 1fr); gap: 8px; padding: 10px; align-content: end;">`);

      for (const product of state.products) {
        lines.push(`      <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px; background-color: rgba(255,255,255,0.9); border-radius: 8px;">`);

        if (product.imagePreview) {
          lines.push(`        <img src="${product.name || '상품'}.jpg" alt="${product.name}" style="width: 100%; max-height: 120px; object-fit: contain; border-radius: 6px;" />`);
        }
        if (product.name) {
          lines.push(`        <p style="${textCss(state.productNameStyle, 'center')}">${product.name}</p>`);
        }
        if (product.description) {
          lines.push(`        <p style="${textCss(state.productDescStyle, 'center')}">${product.description}</p>`);
        }
        if (product.originalPrice > 0 && product.originalPrice !== product.salePrice) {
          lines.push(`        <p style="font-size: ${state.productPriceStyle.fontSize - 4}px; color: #999; text-decoration: line-through; margin: 0;">${formatPrice(product.originalPrice)}</p>`);
        }
        if (product.salePrice > 0) {
          lines.push(`        <p style="font-family: ${state.productPriceStyle.fontFamily}; font-size: ${state.productPriceStyle.fontSize}px; font-weight: ${state.productPriceStyle.fontWeight}; color: ${state.productPriceStyle.color}; margin: 0;">${formatPrice(product.salePrice)}</p>`);
        }

        lines.push(`      </div>`);
      }

      lines.push(`    </div>`);
    }

    lines.push(`  </div>`);
    lines.push(`</div>`);

    return lines.join('\n');
  }, [state, spec]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!spec) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">HTML 코드</span>
        <button
          onClick={handleCopy}
          className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {copied ? '복사됨!' : '복사'}
        </button>
      </div>
      <div className="overflow-auto rounded-lg border border-gray-200 bg-gray-900 p-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <pre className="text-xs leading-relaxed">
          <code className="text-green-400 whitespace-pre">{html}</code>
        </pre>
      </div>
    </div>
  );
}
