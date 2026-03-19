'use client';

import Link from 'next/link';
import { useEditor } from '@/contexts/EditorContext';
import { usePlatforms } from '@/hooks/usePlatforms';
import type { LayoutType } from '@/types';
import { LAYOUT_LABELS } from '@/types';

export default function PlatformSelector() {
  const { state, dispatch } = useEditor();
  const { platforms, isLoaded } = usePlatforms();

  if (!isLoaded) return null;

  const selectedPlatform = platforms.find((p) => p.id === state.selectedPlatformId);
  const selectedSpec = selectedPlatform?.imageSpecs.find(
    (s) => s.id === state.selectedImageSpecId
  );

  if (platforms.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
        <p className="text-sm text-gray-500">등록된 쇼핑몰이 없습니다</p>
        <Link
          href="/settings"
          className="mt-2 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          쇼핑몰 규격 등록하기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 규격 선택 */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">1. 규격 선택</h3>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">쇼핑몰</label>
            <select
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              value={state.selectedPlatformId ?? ''}
              onChange={(e) =>
                dispatch({ type: 'SELECT_PLATFORM', platformId: e.target.value || null })
              }
            >
              <option value="">선택하세요</option>
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {selectedPlatform && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">이미지 종류</label>
              {selectedPlatform.imageSpecs.length === 0 ? (
                <p className="text-xs text-gray-400">
                  등록된 이미지 종류가 없습니다.{' '}
                  <Link href="/settings" className="text-blue-600 hover:underline">
                    설정에서 추가
                  </Link>
                </p>
              ) : (
                <select
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  value={state.selectedImageSpecId ?? ''}
                  onChange={(e) =>
                    dispatch({ type: 'SELECT_IMAGE_SPEC', specId: e.target.value || null })
                  }
                >
                  <option value="">선택하세요</option>
                  {selectedPlatform.imageSpecs.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.width}×{s.height})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {selectedSpec && (
            <div className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">
              {selectedSpec.width} × {selectedSpec.height} px · {selectedSpec.fileFormat.toUpperCase()}
              {selectedSpec.description && ` · ${selectedSpec.description}`}
            </div>
          )}
        </div>
      </div>

      {/* 레이아웃 유형 */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">2. 레이아웃 유형</h3>
        <div className="flex flex-col gap-2">
          {(Object.entries(LAYOUT_LABELS) as [LayoutType, string][]).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="layoutType"
                checked={state.layoutType === key}
                onChange={() => dispatch({ type: 'SET_LAYOUT_TYPE', layoutType: key })}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
