'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import PlatformFormModal from './PlatformFormModal';
import ImageSpecFormModal from './ImageSpecFormModal';
import { usePlatforms } from '@/hooks/usePlatforms';
import { showToast } from '@/components/ui/Toast';
import type { ImageSpec } from '@/types';

export default function PlatformManager() {
  const {
    platforms,
    isLoaded,
    addPlatform,
    updatePlatform,
    deletePlatform,
    addImageSpec,
    updateImageSpec,
    deleteImageSpec,
  } = usePlatforms();

  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [editingPlatformId, setEditingPlatformId] = useState<string | null>(null);
  const [showSpecModal, setShowSpecModal] = useState<string | null>(null); // platformId
  const [editingSpec, setEditingSpec] = useState<{
    platformId: string;
    spec: ImageSpec;
  } | null>(null);

  if (!isLoaded) {
    return <div className="py-8 text-center text-gray-500">로딩 중...</div>;
  }

  const handleAddPlatform = (name: string) => {
    addPlatform(name);
    showToast(`'${name}' 쇼핑몰이 추가되었습니다`, 'success');
  };

  const handleEditPlatform = (id: string, name: string) => {
    updatePlatform(id, { name });
    setEditingPlatformId(null);
    showToast('쇼핑몰 이름이 수정되었습니다', 'success');
  };

  const handleDeletePlatform = (id: string, name: string) => {
    if (!confirm(`'${name}' 쇼핑몰과 모든 이미지 규격을 삭제할까요?`)) return;
    deletePlatform(id);
    showToast(`'${name}'이(가) 삭제되었습니다`, 'info');
  };

  const handleAddSpec = (platformId: string, spec: Omit<ImageSpec, 'id'>) => {
    addImageSpec(platformId, spec);
    showToast(`'${spec.name}' 이미지 종류가 추가되었습니다`, 'success');
  };

  const handleEditSpec = (platformId: string, specId: string, data: Partial<Omit<ImageSpec, 'id'>>) => {
    updateImageSpec(platformId, specId, data);
    setEditingSpec(null);
    showToast('이미지 규격이 수정되었습니다', 'success');
  };

  const handleDeleteSpec = (platformId: string, specId: string, specName: string) => {
    if (!confirm(`'${specName}' 이미지 종류를 삭제할까요?`)) return;
    deleteImageSpec(platformId, specId);
    showToast(`'${specName}'이(가) 삭제되었습니다`, 'info');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          등록한 규격은 브라우저에 자동 저장됩니다
        </p>
        <Button onClick={() => setShowPlatformModal(true)}>+ 쇼핑몰 추가</Button>
      </div>

      {platforms.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-lg font-medium text-gray-500">등록된 쇼핑몰이 없습니다</p>
          <p className="mt-1 text-sm text-gray-400">
            위의 &quot;+ 쇼핑몰 추가&quot; 버튼을 눌러 시작하세요
          </p>
        </div>
      ) : (
        platforms.map((platform) => (
          <div
            key={platform.id}
            className="rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            {/* 쇼핑몰 헤더 */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingPlatformId(platform.id)}
                >
                  수정
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => handleDeletePlatform(platform.id, platform.name)}
                >
                  삭제
                </Button>
              </div>
            </div>

            {/* 이미지 종류 목록 */}
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">이미지 종류</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowSpecModal(platform.id)}
                >
                  + 이미지 종류 추가
                </Button>
              </div>

              {platform.imageSpecs.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-400">
                  등록된 이미지 종류가 없습니다
                </p>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">이름</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">규격</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">형식</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">설명</th>
                        <th className="px-4 py-2 text-right font-medium text-gray-600">작업</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {platform.imageSpecs.map((spec) => (
                        <tr key={spec.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 font-medium text-gray-900">{spec.name}</td>
                          <td className="px-4 py-2.5 text-gray-600">
                            {spec.width} × {spec.height}
                          </td>
                          <td className="px-4 py-2.5 uppercase text-gray-600">{spec.fileFormat}</td>
                          <td className="px-4 py-2.5 text-gray-500">{spec.description || '-'}</td>
                          <td className="px-4 py-2.5 text-right">
                            <button
                              className="mr-2 text-blue-600 hover:text-blue-800"
                              onClick={() => setEditingSpec({ platformId: platform.id, spec })}
                            >
                              수정
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteSpec(platform.id, spec.id, spec.name)}
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* 쇼핑몰 추가 모달 */}
      <PlatformFormModal
        isOpen={showPlatformModal}
        onClose={() => setShowPlatformModal(false)}
        onSubmit={handleAddPlatform}
        title="쇼핑몰 추가"
      />

      {/* 쇼핑몰 수정 모달 */}
      {editingPlatformId && (
        <PlatformFormModal
          isOpen={true}
          onClose={() => setEditingPlatformId(null)}
          onSubmit={(name) => handleEditPlatform(editingPlatformId, name)}
          initialName={platforms.find((p) => p.id === editingPlatformId)?.name}
          title="쇼핑몰 수정"
        />
      )}

      {/* 이미지 종류 추가 모달 */}
      {showSpecModal && (
        <ImageSpecFormModal
          isOpen={true}
          onClose={() => setShowSpecModal(null)}
          onSubmit={(spec) => handleAddSpec(showSpecModal, spec)}
          title="이미지 종류 추가"
        />
      )}

      {/* 이미지 종류 수정 모달 */}
      {editingSpec && (
        <ImageSpecFormModal
          isOpen={true}
          onClose={() => setEditingSpec(null)}
          onSubmit={(data) =>
            handleEditSpec(editingSpec.platformId, editingSpec.spec.id, data)
          }
          initialData={editingSpec.spec}
          title="이미지 규격 수정"
        />
      )}
    </div>
  );
}
