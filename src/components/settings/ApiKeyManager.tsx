'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { loadApiKeys, saveApiKeys } from '@/lib/storage/apiKeyStorage';
import { showToast } from '@/components/ui/Toast';

export default function ApiKeyManager() {
  const [geminiKey, setGeminiKey] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const keys = loadApiKeys();
    setGeminiKey(keys.geminiApiKey);
    setIsLoaded(true);
  }, []);

  const handleSave = () => {
    saveApiKeys({ geminiApiKey: geminiKey.trim() });
    showToast('API 키가 저장되었습니다', 'success');
  };

  const handleClear = () => {
    setGeminiKey('');
    saveApiKeys({ geminiApiKey: '' });
    showToast('API 키가 삭제되었습니다', 'info');
  };

  if (!isLoaded) return null;

  const maskedKey = geminiKey
    ? showKey
      ? geminiKey
      : geminiKey.slice(0, 8) + '••••••••' + geminiKey.slice(-4)
    : '';

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h3 className="text-lg font-semibold text-gray-900">API 설정</h3>
        <p className="mt-1 text-sm text-gray-500">
          AI 배경 생성에 필요한 API 키를 설정하세요. 키는 브라우저에만 저장됩니다.
        </p>
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
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
              <Button onClick={handleSave} disabled={!geminiKey.trim()}>
                저장
              </Button>
              {geminiKey && (
                <Button variant="ghost" onClick={handleClear} className="text-red-500">
                  삭제
                </Button>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-400">
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

          {geminiKey && (
            <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
              Gemini API 키가 설정되어 있습니다
            </div>
          )}
          {!geminiKey && (
            <div className="rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-700">
              API 키가 설정되지 않았습니다. AI 배경 생성을 사용하려면 키를 입력하세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
