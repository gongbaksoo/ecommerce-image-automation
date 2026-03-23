'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { usePlatforms } from '@/hooks/usePlatforms';

export default function BackgroundCropSelector() {
  const { state, dispatch } = useEditor();
  const { platforms } = usePlatforms();
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });

  const platform = platforms.find((p) => p.id === state.selectedPlatformId);
  const spec = platform?.imageSpecs.find((s) => s.id === state.selectedImageSpecId);

  const containerWidth = 340;

  useEffect(() => {
    if (!state.backgroundImage) return;
    const img = new Image();
    img.onload = () => {
      setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
      dispatch({ type: 'SET_BG_IMAGE_SIZE', w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = state.backgroundImage;
  }, [state.backgroundImage, dispatch]);

  const layout = useMemo(() => {
    if (!spec || imgNatural.w === 0) return null;

    const specRatio = spec.width / spec.height;
    const imgRatio = imgNatural.w / imgNatural.h;

    // 크롭 영역: 컨테이너 안에서 규격 비율로 고정
    let cropW: number, cropH: number;
    if (specRatio >= 1) {
      cropW = containerWidth;
      cropH = containerWidth / specRatio;
    } else {
      cropH = containerWidth;
      cropW = containerWidth * specRatio;
    }
    // 높이 제한
    if (cropH > 400) {
      cropH = 400;
      cropW = 400 * specRatio;
    }

    // 이미지: 크롭 영역을 항상 채울 수 있도록 스케일 + 줌 적용
    const scaleX = cropW / imgNatural.w;
    const scaleY = cropH / imgNatural.h;
    const baseScale = Math.max(scaleX, scaleY);
    const imgScale = baseScale * state.bgCropZoom;
    const imgW = imgNatural.w * imgScale;
    const imgH = imgNatural.h * imgScale;

    // 이동 가능 범위 (이미지가 크롭보다 큰 부분만큼)
    const maxOffsetX = imgW - cropW;
    const maxOffsetY = imgH - cropH;

    return { cropW, cropH, imgW, imgH, maxOffsetX, maxOffsetY };
  }, [spec, imgNatural, state.bgCropZoom]);

  // 현재 오프셋 (% → px)
  const offsetX = layout ? (state.bgCropX / 100) * layout.maxOffsetX : 0;
  const offsetY = layout ? (state.bgCropY / 100) * layout.maxOffsetY : 0;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!layout) return;
    e.preventDefault();
    setDragging(true);
    setDragStart({ x: e.clientX + offsetX, y: e.clientY + offsetY });
  }, [layout, offsetX, offsetY]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging || !layout) return;
    // 이미지를 반대로 이동 (드래그 방향 반대로 오프셋)
    let newOffX = dragStart.x - e.clientX;
    let newOffY = dragStart.y - e.clientY;
    newOffX = Math.max(0, Math.min(layout.maxOffsetX, newOffX));
    newOffY = Math.max(0, Math.min(layout.maxOffsetY, newOffY));
    const pctX = layout.maxOffsetX > 0 ? (newOffX / layout.maxOffsetX) * 100 : 50;
    const pctY = layout.maxOffsetY > 0 ? (newOffY / layout.maxOffsetY) * 100 : 50;
    dispatch({ type: 'SET_BG_CROP', x: pctX, y: pctY });
  }, [dragging, dragStart, layout, dispatch]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  if (!state.backgroundImage || !spec || !layout) return null;

  const { cropW, cropH, imgW, imgH } = layout;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-gray-700">배경 영역 선택</p>
      <p className="text-[11px] text-gray-500">
        드래그하여 사용할 영역을 조정하세요
      </p>
      {/* 크롭 뷰포트 (규격 비율로 고정) */}
      <div
        style={{
          position: 'relative',
          width: `${cropW}px`,
          height: `${cropH}px`,
          overflow: 'hidden',
          borderRadius: '8px',
          border: '2px solid #3b82f6',
          cursor: dragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        onMouseDown={handleMouseDown}
      >
        {/* 이미지 (크롭 영역보다 크게, 오프셋으로 이동) */}
        <img
          src={state.backgroundImage}
          alt="AI 생성 배경"
          style={{
            position: 'absolute',
            left: `${-offsetX}px`,
            top: `${-offsetY}px`,
            width: `${imgW}px`,
            height: `${imgH}px`,
            display: 'block',
            pointerEvents: 'none',
          }}
          draggable={false}
        />
        {/* 규격 라벨 */}
        <span
          style={{
            position: 'absolute',
            bottom: '4px',
            right: '6px',
            fontSize: '10px',
            color: '#fff',
            backgroundColor: 'rgba(59,130,246,0.8)',
            padding: '1px 5px',
            borderRadius: '3px',
            pointerEvents: 'none',
          }}
        >
          {spec.width}×{spec.height}
        </span>
      </div>
      {/* 줌 컨트롤 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_BG_CROP_ZOOM', zoom: Math.max(1, state.bgCropZoom - 0.1) })}
          className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-sm font-bold text-gray-600 hover:bg-gray-100"
        >
          −
        </button>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={state.bgCropZoom}
          onChange={(e) => dispatch({ type: 'SET_BG_CROP_ZOOM', zoom: parseFloat(e.target.value) })}
          className="flex-1"
        />
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_BG_CROP_ZOOM', zoom: Math.min(3, state.bgCropZoom + 0.1) })}
          className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-sm font-bold text-gray-600 hover:bg-gray-100"
        >
          +
        </button>
        <span className="w-12 text-right text-xs text-gray-500">{Math.round(state.bgCropZoom * 100)}%</span>
      </div>
    </div>
  );
}
