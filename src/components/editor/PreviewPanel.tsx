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

  const containerStyle: React.CSSProperties = {
    width: `${spec.width}px`,
    height: `${spec.height}px`,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: state.backgroundColor,
  };

  // 배경 이미지 레이어 (크롭 선택기와 동일한 계산)
  const hasBgImage = state.backgroundType !== 'color' && state.backgroundImage && state.bgImageNatW > 0;

  let bgImageStyle: React.CSSProperties | null = null;
  if (hasBgImage) {
    const natW = state.bgImageNatW;
    const natH = state.bgImageNatH;
    // cover 방식: 규격 영역을 완전히 채우는 최소 스케일
    const baseScale = Math.max(spec.width / natW, spec.height / natH);
    const imgScale = baseScale * state.bgCropZoom;
    const imgW = natW * imgScale;
    const imgH = natH * imgScale;
    // 이동 가능 범위
    const maxOffsetX = imgW - spec.width;
    const maxOffsetY = imgH - spec.height;
    const offsetX = (state.bgCropX / 100) * maxOffsetX;
    const offsetY = (state.bgCropY / 100) * maxOffsetY;

    bgImageStyle = {
      position: 'absolute',
      left: `${-offsetX}px`,
      top: `${-offsetY}px`,
      width: `${imgW}px`,
      height: `${imgH}px`,
      zIndex: 0,
    };
  }

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
        <div
          style={{
            width: `${spec.width * scale}px`,
            height: `${spec.height * scale}px`,
          }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            {/* html2canvas 캡처 대상 */}
            <div ref={renderRef} style={containerStyle}>
              {/* 배경 이미지 레이어 (absolute) */}
              {bgImageStyle && (
                <img
                  src={state.backgroundImage!}
                  alt=""
                  style={bgImageStyle}
                  draggable={false}
                />
              )}
              {/* 콘텐츠 레이어 (relative, 항상 규격 기준 고정) */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
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
