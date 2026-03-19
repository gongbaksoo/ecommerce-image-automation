'use client';

import PlatformManager from '@/components/settings/PlatformManager';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">쇼핑몰 이미지 규격 관리</h1>
        <p className="mt-2 text-gray-500">
          각 쇼핑몰별로 필요한 이미지 종류와 규격(px)을 등록하세요
        </p>
      </div>
      <PlatformManager />
    </div>
  );
}
