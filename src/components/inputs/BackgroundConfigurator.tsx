'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useEditor } from '@/contexts/EditorContext';
import type { HeroContentLayout } from '@/types';
import { TEXT_POSITION_PRODUCT_GUIDE } from '@/types';
import { getGeminiApiKey, getGeminiModel, loadApiSettings, saveApiSettings } from '@/lib/storage/apiKeyStorage';
import { usePlatforms } from '@/hooks/usePlatforms';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
import { showToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import ImageUploader from './ImageUploader';
import BackgroundCropSelector from './BackgroundCropSelector';

export default function BackgroundConfigurator() {
  const { state, dispatch } = useEditor();
  const { platforms } = usePlatforms();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentModel, setCurrentModel] = useState(() => getGeminiModel());

  // 선택된 규격의 실제 크기
  const platform = platforms.find((p) => p.id === state.selectedPlatformId);
  const spec = platform?.imageSpecs.find((s) => s.id === state.selectedImageSpecId);
  const specWidth = spec?.width ?? 1200;
  const specHeight = spec?.height ?? 800;

  const handleGenerate = async () => {
    if (!state.aiPrompt.trim()) return;

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      showToast('설정 페이지에서 API 키를 먼저 입력해주세요', 'error');
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      let productImageBase64: string | undefined;
      if (state.bgProductImage) {
        productImageBase64 = await fileToBase64(state.bgProductImage);
      }

      const subImages: (string | null)[] = await Promise.all(
        state.bgSubImages.map((f) => (f ? fileToBase64(f) : Promise.resolve(null)))
      );

      let referenceImageBase64: string | undefined;
      if (state.bgReferenceImage) {
        referenceImageBase64 = await fileToBase64(state.bgReferenceImage);
      }

      const res = await fetch('/api/generate-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: state.aiPrompt,
          apiKey,
          model: currentModel,
          width: specWidth,
          height: specHeight,
          productImage: productImageBase64,
          subImage1: subImages[0] ?? undefined,
          subImage2: subImages[1] ?? undefined,
          subImage3: subImages[2] ?? undefined,
          referenceImage: referenceImageBase64,
          textPosition: state.heroContentLayout,
          textPositionGuide: TEXT_POSITION_PRODUCT_GUIDE[state.heroContentLayout],
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        dispatch({ type: 'SET_BACKGROUND_IMAGE', url: data.imageUrl });
        showToast('배경 이미지가 생성되었습니다', 'success');
        setError(null);
      } else {
        setError(data.error || 'AI 배경 생성에 실패했습니다');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const presets: { id: HeroContentLayout; label: string; icon: React.ReactNode }[] = [
    {
      id: 'text-top',
      label: '상단 문구',
      icon: (
        <svg viewBox="0 0 48 48" className="w-full h-full">
          <rect x="4" y="4" width="40" height="40" rx="4" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1.5" />
          <rect x="10" y="8" width="28" height="4" rx="1" fill="#6b7280" />
          <rect x="14" y="14" width="20" height="3" rx="1" fill="#9ca3af" />
          <circle cx="24" cy="32" r="8" fill="#93c5fd" opacity="0.5" />
        </svg>
      ),
    },
    {
      id: 'text-center',
      label: '중앙 문구',
      icon: (
        <svg viewBox="0 0 48 48" className="w-full h-full">
          <rect x="4" y="4" width="40" height="40" rx="4" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1.5" />
          <rect x="12" y="20" width="24" height="4" rx="1" fill="#6b7280" />
          <rect x="16" y="26" width="16" height="3" rx="1" fill="#9ca3af" />
          <circle cx="24" cy="38" r="5" fill="#93c5fd" opacity="0.5" />
        </svg>
      ),
    },
    {
      id: 'text-bottom',
      label: '하단 문구',
      icon: (
        <svg viewBox="0 0 48 48" className="w-full h-full">
          <rect x="4" y="4" width="40" height="40" rx="4" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1.5" />
          <circle cx="24" cy="18" r="8" fill="#93c5fd" opacity="0.5" />
          <rect x="10" y="32" width="28" height="4" rx="1" fill="#6b7280" />
          <rect x="14" y="38" width="20" height="3" rx="1" fill="#9ca3af" />
        </svg>
      ),
    },
    {
      id: 'text-left',
      label: '좌측 문구',
      icon: (
        <svg viewBox="0 0 48 48" className="w-full h-full">
          <rect x="4" y="4" width="40" height="40" rx="4" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1.5" />
          <rect x="8" y="16" width="16" height="4" rx="1" fill="#6b7280" />
          <rect x="8" y="22" width="14" height="3" rx="1" fill="#9ca3af" />
          <rect x="8" y="27" width="12" height="3" rx="1" fill="#9ca3af" />
          <circle cx="35" cy="24" r="8" fill="#93c5fd" opacity="0.5" />
        </svg>
      ),
    },
  ];

  const showPresets = state.layoutType === 'hero-only' || state.layoutType === 'hero-products';

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">3. 배경 & 레이아웃 설정</h3>

      {/* 레이아웃 프리셋 */}
      {showPresets && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium text-gray-700">콘텐츠 배치</p>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => dispatch({ type: 'SET_HERO_CONTENT_LAYOUT', layout: p.id })}
                className={`flex flex-col items-center gap-1 rounded-lg border-2 p-2 transition-colors ${
                  state.heroContentLayout === p.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10">{p.icon}</div>
                <span className="text-[10px] text-gray-600 leading-tight text-center">{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 배경 타입 선택 */}
      <p className="mb-2 text-xs font-medium text-gray-700">배경</p>
      <div className="mb-3 flex gap-3">
        {(['color', 'upload', 'ai'] as const).map((t) => (
          <label key={t} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="bgType"
              checked={state.backgroundType === t}
              onChange={() => dispatch({ type: 'SET_BACKGROUND_TYPE', bgType: t })}
              className="text-blue-600"
            />
            <span className="text-sm text-gray-700">
              {t === 'color' ? '단색' : t === 'upload' ? '업로드' : 'AI 생성'}
            </span>
          </label>
        ))}
      </div>

      {state.backgroundType === 'color' && (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={state.backgroundColor}
            onChange={(e) =>
              dispatch({ type: 'SET_BACKGROUND_COLOR', color: e.target.value })
            }
            className="h-10 w-14 cursor-pointer rounded border border-gray-300"
          />
          <span className="text-sm text-gray-500">{state.backgroundColor}</span>
        </div>
      )}

      {state.backgroundType === 'upload' && (
        <ImageUploader
          label="배경 이미지"
          preview={state.backgroundImage ?? ''}
          onUpload={(file, preview) =>
            dispatch({ type: 'SET_BACKGROUND_IMAGE', url: preview })
          }
          onRemove={() => dispatch({ type: 'SET_BACKGROUND_IMAGE', url: null })}
        />
      )}

      {state.backgroundType === 'ai' && (
        <div className="flex flex-col gap-3">
          {/* 메인 상품 이미지 */}
          <div>
            <p className="mb-1 text-xs font-medium text-gray-700">
              메인 상품 이미지 <span className="text-red-500">*</span>
            </p>
            <p className="mb-2 text-[11px] text-gray-500">
              상품의 형태/색상/디자인은 원본 그대로 유지됩니다.
            </p>
            <ImageUploader
              label="상품 이미지"
              preview={state.bgProductImagePreview}
              onUpload={(file, preview) =>
                dispatch({ type: 'SET_BG_PRODUCT_IMAGE', file, preview })
              }
              onRemove={() =>
                dispatch({ type: 'SET_BG_PRODUCT_IMAGE', file: null, preview: '' })
              }
            />
          </div>

          {/* 서브 이미지 1~3 */}
          <div>
            <p className="mb-1 text-xs font-medium text-gray-700">서브 이미지 (선택, 최대 3개)</p>
            <p className="mb-2 text-[11px] text-gray-500">
              함께 배치할 추가 상품/소품 이미지를 등록하세요.
            </p>
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((i) => (
                <ImageUploader
                  key={i}
                  label={`서브 이미지 ${i + 1}`}
                  preview={state.bgSubImagePreviews[i]}
                  onUpload={(file, preview) =>
                    dispatch({ type: 'SET_BG_SUB_IMAGE', index: i, file, preview })
                  }
                  onRemove={() =>
                    dispatch({ type: 'SET_BG_SUB_IMAGE', index: i, file: null, preview: '' })
                  }
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">모델</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none"
                value={currentModel}
                onChange={(e) => {
                  setCurrentModel(e.target.value);
                  const settings = loadApiSettings();
                  saveApiSettings({ ...settings, geminiModel: e.target.value });
                  setError(null);
                }}
                placeholder="모델 ID"
              />
              <Link href="/settings" className="shrink-0 text-xs text-blue-600 hover:underline">
                모델 조회
              </Link>
            </div>
          </div>
          <textarea
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            rows={3}
            placeholder="예: 봄 분위기의 밝은 파스텔톤 행사 배경, 꽃잎과 리본 장식"
            value={state.aiPrompt}
            onChange={(e) => dispatch({ type: 'SET_AI_PROMPT', prompt: e.target.value })}
          />
          <ImageUploader
            label="레퍼런스 이미지 (선택)"
            preview={state.bgReferenceImagePreview}
            onUpload={(file, preview) =>
              dispatch({ type: 'SET_BG_REFERENCE_IMAGE', file, preview })
            }
            onRemove={() => dispatch({ type: 'SET_BG_REFERENCE_IMAGE', file: null, preview: '' })}
          />
          {!getGeminiApiKey() && (
            <div className="rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-700">
              API 키가 필요합니다.{' '}
              <Link href="/settings" className="font-medium text-blue-600 hover:underline">
                설정 페이지에서 입력
              </Link>
            </div>
          )}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !state.aiPrompt.trim()}
            size="sm"
          >
            {isGenerating ? '생성 중...' : '배경 생성하기'}
          </Button>
          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
              <p className="mt-1 text-xs text-red-500">
                다른 모델로 변경하거나{' '}
                <Link href="/settings" className="font-medium underline">설정</Link>
                에서 API 키를 확인해주세요.
              </p>
            </div>
          )}
          {state.backgroundImage && state.backgroundType === 'ai' && (
            <BackgroundCropSelector />
          )}
        </div>
      )}
    </div>
  );
}
