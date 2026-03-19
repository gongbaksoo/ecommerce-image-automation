'use client';

import { useRef } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import PlatformSelector from '@/components/platform/PlatformSelector';
import BackgroundConfigurator from '@/components/inputs/BackgroundConfigurator';
import TextInputForm from '@/components/inputs/TextInputForm';
import ImageUploader from '@/components/inputs/ImageUploader';
import ProductInputForm from '@/components/inputs/ProductInputForm';
import FontSelector from '@/components/inputs/FontSelector';
import PreviewPanel from './PreviewPanel';
import ExportButton from '@/components/export/ExportButton';

export default function EditorMain() {
  const { state, dispatch } = useEditor();
  const renderRef = useRef<HTMLDivElement>(null);

  const showHeroInputs = state.layoutType === 'hero-only' || state.layoutType === 'hero-products';
  const showProductInputs = state.layoutType === 'products-only' || state.layoutType === 'hero-products';

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        {/* 좌측: 설정 패널 */}
        <div className="flex flex-col gap-4 overflow-y-auto lg:max-h-[calc(100vh-120px)]">
          <PlatformSelector />
          <BackgroundConfigurator />
          <FontSelector />

          {showHeroInputs && (
            <>
              <TextInputForm />
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">5. 메인 연출 이미지</h3>
                <ImageUploader
                  label="연출 이미지"
                  preview={state.heroImagePreview}
                  onUpload={(file, preview) =>
                    dispatch({ type: 'SET_HERO_IMAGE', file, preview })
                  }
                  onRemove={() =>
                    dispatch({ type: 'SET_HERO_IMAGE', file: null, preview: '' })
                  }
                />
              </div>
            </>
          )}

          {showProductInputs && <ProductInputForm />}

          <ExportButton renderRef={renderRef} />
        </div>

        {/* 우측: 미리보기 */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <PreviewPanel renderRef={renderRef} />
        </div>
      </div>
    </div>
  );
}
