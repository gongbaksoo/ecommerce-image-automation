'use client';

import { useRef } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import PlatformSelector from '@/components/platform/PlatformSelector';
import BackgroundConfigurator from '@/components/inputs/BackgroundConfigurator';
import TextInputForm from '@/components/inputs/TextInputForm';
import ProductInputForm from '@/components/inputs/ProductInputForm';
import FontSelector from '@/components/inputs/FontSelector';
import PreviewPanel from './PreviewPanel';
import CodePanel from './CodePanel';
import ExportButton from '@/components/export/ExportButton';

export default function EditorMain() {
  const { state, dispatch } = useEditor();
  const renderRef = useRef<HTMLDivElement>(null);

  const showHeroInputs = state.layoutType === 'hero-only' || state.layoutType === 'hero-products';
  const showProductInputs = state.layoutType === 'products-only' || state.layoutType === 'hero-products';

  return (
    <div className="mx-auto px-4 py-6" style={{ maxWidth: '1600px' }}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr_1fr]">
        {/* 좌측: 설정 패널 */}
        <div className="flex flex-col gap-4 overflow-y-auto lg:max-h-[calc(100vh-120px)]">
          <PlatformSelector />
          <BackgroundConfigurator />
          <FontSelector />

          {showHeroInputs && <TextInputForm />}

          {showProductInputs && <ProductInputForm />}

          <ExportButton renderRef={renderRef} />
        </div>

        {/* 중앙: 미리보기 */}
        <div className="overflow-y-auto lg:max-h-[calc(100vh-120px)]">
          <PreviewPanel renderRef={renderRef} />
        </div>

        {/* 우측: HTML 코드 */}
        <div className="overflow-y-auto lg:max-h-[calc(100vh-120px)]">
          <CodePanel />
        </div>
      </div>
    </div>
  );
}
