'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useEditor } from '@/contexts/EditorContext';
import { getGeminiApiKey, getGeminiModel } from '@/lib/storage/apiKeyStorage';
import { showToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import ImageUploader from './ImageUploader';

export default function HeroImageConfigurator() {
  const { state, dispatch } = useEditor();
  const [mode, setMode] = useState<'upload' | 'ai'>('upload');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;

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
          prompt: `Create a product staging/lifestyle photo: ${aiPrompt}. Make it look like a professional e-commerce product photo. Do NOT include any text.`,
          apiKey,
          model: getGeminiModel(),
          width: 800,
          height: 600,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        dispatch({ type: 'SET_HERO_IMAGE', file: null, preview: data.imageUrl });
        showToast('연출 이미지가 생성되었습니다', 'success');
        setError(null);
      } else {
        setError(data.error || 'AI 이미지 생성에 실패했습니다');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">5. 메인 연출 이미지</h3>

      <div className="mb-3 flex gap-3">
        {(['upload', 'ai'] as const).map((t) => (
          <label key={t} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="heroImageMode"
              checked={mode === t}
              onChange={() => setMode(t)}
              className="text-blue-600"
            />
            <span className="text-sm text-gray-700">
              {t === 'upload' ? '업로드' : 'AI 생성'}
            </span>
          </label>
        ))}
      </div>

      {mode === 'upload' && (
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
      )}

      {mode === 'ai' && (
        <div className="flex flex-col gap-3">
          <textarea
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            rows={3}
            placeholder="예: 세탁세제 상품들이 세탁기 앞에 놓여있는 연출 이미지"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
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
            disabled={isGenerating || !aiPrompt.trim()}
            size="sm"
          >
            {isGenerating ? '생성 중...' : '연출 이미지 생성하기'}
          </Button>

          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
              <p className="mt-1 text-xs text-red-500">
                <Link href="/settings" className="font-medium underline">설정</Link>
                에서 모델이나 API 키를 확인해주세요.
              </p>
            </div>
          )}

          {state.heroImagePreview && (
            <div className="relative">
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <img
                  src={state.heroImagePreview}
                  alt="AI 생성 연출 이미지"
                  className="h-32 w-full object-cover"
                />
              </div>
              <button
                onClick={() => dispatch({ type: 'SET_HERO_IMAGE', file: null, preview: '' })}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
