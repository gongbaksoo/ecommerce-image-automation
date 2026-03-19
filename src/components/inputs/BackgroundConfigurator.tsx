'use client';

import { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { getGeminiApiKey } from '@/lib/storage/apiKeyStorage';
import Button from '@/components/ui/Button';
import ImageUploader from './ImageUploader';

export default function BackgroundConfigurator() {
  const { state, dispatch } = useEditor();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!state.aiPrompt.trim()) return;

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      alert('Gemini API 키가 설정되지 않았습니다.\n설정 페이지에서 API 키를 먼저 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: state.aiPrompt,
          apiKey,
          width: 1200,
          height: 800,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        dispatch({ type: 'SET_BACKGROUND_IMAGE', url: data.imageUrl });
      } else {
        alert(data.error || 'AI 배경 생성에 실패했습니다');
      }
    } catch {
      alert('AI 배경 생성에 실패했습니다. 직접 업로드를 이용해주세요.');
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
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !state.aiPrompt.trim()}
            size="sm"
          >
            {isGenerating ? '생성 중...' : '배경 생성하기'}
          </Button>
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
