'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { loadApiSettings, saveApiSettings, GEMINI_MODELS } from '@/lib/storage/apiKeyStorage';
import { showToast } from '@/components/ui/Toast';

export default function ApiKeyManager() {
  const [geminiKey, setGeminiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash-exp');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const settings = loadApiSettings();
    setGeminiKey(settings.geminiApiKey);
    setSelectedModel(settings.geminiModel);
    setIsLoaded(true);
  }, []);

  const handleSave = () => {
    saveApiSettings({ geminiApiKey: geminiKey.trim(), geminiModel: selectedModel });
    showToast('API 설정이 저장되었습니다', 'success');
  };

  const handleClear = () => {
    setGeminiKey('');
    saveApiSettings({ geminiApiKey: '', geminiModel: selectedModel });
    showToast('API 키가 삭제되었습니다', 'info');
  };

  if (!isLoaded) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h3 className="text-lg font-semibold text-gray-900">API 설정</h3>
        <p className="mt-1 text-sm text-gray-500">
          AI 배경 생성에 필요한 API 키와 모델을 설정하세요. 브라우저에만 저장됩니다.
        </p>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* API 키 입력 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Gemini API Key
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-16 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="AIza..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? '숨기기' : '보기'}
              </button>
            </div>
            {geminiKey && (
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-red-500">
                삭제
              </Button>
            )}
          </div>
          <p className="mt-1.5 text-xs text-gray-400">
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Google AI Studio
            </a>
            에서 무료로 API 키를 발급받을 수 있습니다.
          </p>
        </div>

        {/* 모델 선택 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            이미지 생성 모델
          </label>
          <div className="flex flex-col gap-2">
            {GEMINI_MODELS.map((model) => (
              <label
                key={model.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                  selectedModel === model.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="geminiModel"
                  value={model.id}
                  checked={selectedModel === model.id}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{model.name}</p>
                  <p className="text-xs text-gray-500">{model.description}</p>
                  <p className="mt-0.5 text-xs font-mono text-gray-400">{model.id}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 저장 버튼 + 상태 */}
        <div className="flex flex-col gap-3">
          <Button onClick={handleSave} disabled={!geminiKey.trim()} className="w-full">
            설정 저장
          </Button>

          {geminiKey ? (
            <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
              Gemini API 설정 완료 — {GEMINI_MODELS.find((m) => m.id === selectedModel)?.name}
            </div>
          ) : (
            <div className="rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-700">
              API 키가 설정되지 않았습니다. AI 배경 생성을 사용하려면 키를 입력하세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
