'use client';

import { useRef } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { usePlatforms } from '@/hooks/usePlatforms';
import HeroSection from './HeroSection';
import ProductGrid from './ProductGrid';

interface PreviewPanelProps {
  renderRef: React.RefObject<HTMLDivElement | null>;
}

export default function PreviewPanel({ renderRef }: PreviewPanelProps) {
  const { state } = useEditor();
  const { platforms } = usePlatforms();
  const containerRef = useRef<HTMLDivElement>(null);

  const platform = platforms.find((p) => p.id === state.selectedPlatformId);
  const spec = platform?.imageSpecs.find((s) => s.id === state.selectedImageSpecId);

  if (!spec) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
        <p className="text-gray-400">쇼핑몰과 이미지 종류를 선택하세요</p>
      </div>
    );
  }

  // 미리보기 스케일 계산 (컨테이너에 맞춤)
  const maxPreviewWidth = 600;
  const scale = Math.min(1, maxPreviewWidth / spec.width);

  const backgroundStyle: React.CSSProperties = {
    width: `${spec.width}px`,
    height: `${spec.height}px`,
    position: 'relative',
    overflow: 'hidden',
    ...(state.backgroundType === 'color'
      ? { backgroundColor: state.backgroundColor }
      : state.backgroundImage
        ? {
            backgroundImage: `url(${state.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }
        : { backgroundColor: state.backgroundColor }),
  };

  const showHero = state.layoutType === 'hero-only' || state.layoutType === 'hero-products';
  const showProducts = state.layoutType === 'products-only' || state.layoutType === 'hero-products';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {platform?.name} — {spec.name}
        </span>
        <span className="text-xs text-gray-400">
          {spec.width}×{spec.height} · {scale < 1 ? `${Math.round(scale * 100)}% 축소` : '원본 크기'}
        </span>
      </div>

      <div ref={containerRef} className="overflow-auto rounded-lg border border-gray-200 bg-gray-100 p-4">
        {/* 외부 wrapper: scale 후 실제 표시 영역 크기 확보 */}
        <div
          style={{
            width: `${spec.width * scale}px`,
            height: `${spec.height * scale}px`,
          }}
        >
          {/* scale 적용 컨테이너 */}
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            {/* html2canvas 캡처 대상 (원본 크기) */}
            <div ref={renderRef} style={backgroundStyle}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              {showHero && <HeroSection />}
              {showProducts && <ProductGrid />}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
