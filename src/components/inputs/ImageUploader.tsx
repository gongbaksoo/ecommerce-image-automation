'use client';

import { useRef, useState, DragEvent } from 'react';

interface ImageUploaderProps {
  label: string;
  preview: string;
  onUpload: (file: File, preview: string) => void;
  onRemove: () => void;
  accept?: string;
}

export default function ImageUploader({
  label,
  preview,
  onUpload,
  onRemove,
  accept = 'image/jpeg,image/png,image/webp',
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('이미지 크기는 10MB 이하만 가능합니다');
      return;
    }
    const url = URL.createObjectURL(file);
    onUpload(file, url);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  if (preview) {
    return (
      <div className="relative">
        <label className="mb-1 block text-xs font-medium text-gray-500">{label}</label>
        <div className="relative overflow-hidden rounded-lg border border-gray-200">
          <img src={preview} alt={label} className="h-32 w-full object-cover" />
          <button
            onClick={() => {
              onRemove();
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500">{label}</label>
      <div
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <p className="text-sm text-gray-500">클릭 또는 드래그하여 업로드</p>
        <p className="mt-1 text-xs text-gray-400">JPG, PNG, WebP (최대 10MB)</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
