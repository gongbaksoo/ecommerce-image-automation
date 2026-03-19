'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { ImageSpec } from '@/types';

interface ImageSpecFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (spec: Omit<ImageSpec, 'id'>) => void;
  initialData?: ImageSpec;
  title: string;
}

export default function ImageSpecFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: ImageSpecFormModalProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [width, setWidth] = useState(initialData?.width?.toString() ?? '');
  const [height, setHeight] = useState(initialData?.height?.toString() ?? '');
  const [fileFormat, setFileFormat] = useState<'png' | 'jpg'>(initialData?.fileFormat ?? 'jpg');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [maxFileSize, setMaxFileSize] = useState(initialData?.maxFileSize?.toString() ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !width || !height) return;
    onSubmit({
      name: name.trim(),
      width: parseInt(width),
      height: parseInt(height),
      fileFormat,
      description: description.trim(),
      ...(maxFileSize ? { maxFileSize: parseInt(maxFileSize) } : {}),
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    if (!initialData) {
      setName('');
      setWidth('');
      setHeight('');
      setFileFormat('jpg');
      setDescription('');
      setMaxFileSize('');
    }
  };

  const isValid = name.trim() && width && height && parseInt(width) > 0 && parseInt(height) > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          label="이미지 이름"
          placeholder="예: 메인 배너, 상품 썸네일..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="너비 (px)"
            type="number"
            placeholder="1240"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            min={1}
          />
          <Input
            label="높이 (px)"
            type="number"
            placeholder="400"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min={1}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">출력 형식</label>
          <div className="flex gap-4">
            {(['jpg', 'png'] as const).map((fmt) => (
              <label key={fmt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="fileFormat"
                  checked={fileFormat === fmt}
                  onChange={() => setFileFormat(fmt)}
                  className="text-blue-600"
                />
                <span className="text-sm uppercase">{fmt}</span>
              </label>
            ))}
          </div>
        </div>
        <Input
          label="설명 (선택)"
          placeholder="예: 기획전 메인 배너 이미지"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label="최대 파일 크기 KB (선택)"
          type="number"
          placeholder="1000"
          value={maxFileSize}
          onChange={(e) => setMaxFileSize(e.target.value)}
          min={1}
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" disabled={!isValid}>
            저장
          </Button>
        </div>
      </form>
    </Modal>
  );
}
