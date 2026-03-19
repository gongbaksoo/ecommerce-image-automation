'use client';

import { useState } from 'react';
import { saveAs } from 'file-saver';
import { useEditor } from '@/contexts/EditorContext';
import { usePlatforms } from '@/hooks/usePlatforms';
import { captureElement } from '@/lib/export/htmlToImage';
import { showToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';

interface ExportButtonProps {
  renderRef: React.RefObject<HTMLDivElement | null>;
}

export default function ExportButton({ renderRef }: ExportButtonProps) {
  const { state } = useEditor();
  const { platforms } = usePlatforms();
  const [isExporting, setIsExporting] = useState(false);

  const platform = platforms.find((p) => p.id === state.selectedPlatformId);
  const spec = platform?.imageSpecs.find((s) => s.id === state.selectedImageSpecId);

  const handleExport = async () => {
    if (!renderRef.current || !spec || !platform) {
      showToast('쇼핑몰과 이미지 종류를 먼저 선택하세요', 'error');
      return;
    }

    setIsExporting(true);
    try {
      const blob = await captureElement(renderRef.current, {
        width: spec.width,
        height: spec.height,
        format: spec.fileFormat,
      });

      const ext = spec.fileFormat === 'jpg' ? 'jpg' : 'png';
      const fileName = `${platform.name}_${spec.name}_${spec.width}x${spec.height}.${ext}`;
      saveAs(blob, fileName);
      showToast(`'${fileName}' 다운로드 완료!`, 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast('이미지 생성에 실패했습니다', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const isReady = !!spec && (state.heroTitle || state.products.length > 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <Button
        onClick={handleExport}
        disabled={!isReady || isExporting}
        size="lg"
        className="w-full"
      >
        {isExporting ? '이미지 생성 중...' : '이미지 생성 & 다운로드'}
      </Button>
      {!isReady && (
        <p className="mt-2 text-center text-xs text-gray-400">
          규격 선택 + 콘텐츠 입력 후 생성할 수 있습니다
        </p>
      )}
    </div>
  );
}
