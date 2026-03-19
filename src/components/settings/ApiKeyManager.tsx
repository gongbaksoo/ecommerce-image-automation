'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { loadApiSettings, saveApiSettings } from '@/lib/storage/apiKeyStorage';
import { showToast } from '@/components/ui/Toast';

interface FetchedModel {
  id: string;
  name: string;
  description: string;
}

export default function ApiKeyManager() {
  const [geminiKey, setGeminiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash-exp');
  const [customModel, setCustomModel] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [fetchedModels, setFetchedModels] = useState<FetchedModel[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const settings = loadApiSettings();
    setGeminiKey(settings.geminiApiKey);
    setSelectedModel(settings.geminiModel);
    setIsLoaded(true);
  }, []);

  const handleSave = () => {
    const modelToSave = customModel.trim() || selectedModel;
    saveApiSettings({ geminiApiKey: geminiKey.trim(), geminiModel: modelToSave });
    showToast(`API 설정 저장 완료 (모델: ${modelToSave})`, 'success');
  };

  const handleClear = () => {
    setGeminiKey('');
    saveApiSettings({ geminiApiKey: '', geminiModel: selectedModel });
    showToast('API 키가 삭제되었습니다', 'info');
  };

  const handleFetchModels = async () => {
    if (!geminiKey.trim()) {
      showToast('API 키를 먼저 입력하세요', 'error');
      return;
    }
    setIsFetching(true);
    try {
      const res = await fetch('/api/list-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: geminiKey.trim() }),
      });
      const data = await res.json();
      if (data.models) {
        setFetchedModels(data.models);
        showToast(`${data.models.length}개 모델을 조회했습니다`, 'success');
      } else {
        showToast(data.error || '조회 실패', 'error');
      }
    } catch {
      showToast('모델 목록 조회에 실패했습니다', 'error');
    } finally {
      setIsFetching(false);
    }
  };

  if (!isLoaded) return null;

  const effectiveModel = customModel.trim() || selectedModel;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h3 className="text-lg font-semibold text-gray-900">API 설정</h3>
        <p className="mt-1 text-sm text-gray-500">
          AI 배경 생성에 필요한 API 키와 모델을 설정하세요
        </p>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* API 키 */}
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
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Google AI Studio
            </a>에서 무료로 발급
          </p>
        </div>

        {/* 모델 선택 */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">이미지 생성 모델</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFetchModels}
              disabled={isFetching || !geminiKey.trim()}
            >
              {isFetching ? '조회 중...' : '사용 가능한 모델 조회'}
            </Button>
          </div>

          {/* 조회된 모델 목록 */}
          {fetchedModels.length > 0 ? (
            <div className="flex flex-col gap-1">
              <select
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  setCustomModel('');
                }}
              >
                {fetchedModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.id})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400">
                {fetchedModels.length}개 모델 조회됨. 이미지 생성은 일부 모델만 지원합니다.
              </p>
            </div>
          ) : (
            <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-500">
              &quot;사용 가능한 모델 조회&quot; 버튼을 눌러 API 키로 사용 가능한 모델을 확인하세요
            </p>
          )}

          {/* 직접 입력 */}
          <div className="mt-3">
            <label className="mb-1 block text-xs text-gray-500">또는 모델 ID 직접 입력</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none"
              placeholder="예: gemini-2.0-flash-exp"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
            />
          </div>
        </div>

        {/* 저장 + 상태 */}
        <div className="flex flex-col gap-3">
          <Button onClick={handleSave} disabled={!geminiKey.trim()} className="w-full">
            설정 저장 ({effectiveModel})
          </Button>

          {geminiKey ? (
            <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
              API 설정 완료 — 모델: <span className="font-mono">{effectiveModel}</span>
            </div>
          ) : (
            <div className="rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-700">
              API 키를 입력하세요
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
