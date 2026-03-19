'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useEditor } from '@/contexts/EditorContext';
import { getGeminiApiKey, getGeminiModel, loadApiSettings, saveApiSettings } from '@/lib/storage/apiKeyStorage';
import { showToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import ImageUploader from './ImageUploader';

export default function BackgroundConfigurator() {
  const { state, dispatch } = useEditor();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentModel, setCurrentModel] = useState(() => getGeminiModel());

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
      const res = await fetch('/api/generate-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: state.aiPrompt,
          apiKey,
          model: currentModel,
          width: 1200,
          height: 800,
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

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">3. 배경 설정</h3>

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
            preview={state.referenceImage ? URL.createObjectURL(state.referenceImage) : ''}
            onUpload={(file) =>
              dispatch({ type: 'SET_REFERENCE_IMAGE', file })
            }
            onRemove={() => dispatch({ type: 'SET_REFERENCE_IMAGE', file: null })}
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
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <img
                src={state.backgroundImage}
                alt="AI 생성 배경"
                className="h-24 w-full object-cover"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
