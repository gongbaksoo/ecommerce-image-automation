'use client';

import ApiKeyManager from '@/components/settings/ApiKeyManager';
import PlatformManager from '@/components/settings/PlatformManager';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
        <p className="mt-2 text-gray-500">
          API 키와 쇼핑몰 이미지 규격을 관리하세요
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <ApiKeyManager />

        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">쇼핑몰 이미지 규격</h2>
          <PlatformManager />
        </div>
      </div>
    </div>
  );
}
