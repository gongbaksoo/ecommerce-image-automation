'use client';

import { useRef } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { showToast } from '@/components/ui/Toast';

const DEFAULT_FONTS = [
  { family: 'sans-serif', label: '기본 (고딕)' },
  { family: 'serif', label: '명조' },
  { family: '"Courier New", monospace', label: '고정폭' },
];

export default function FontSelector() {
  const { state, dispatch } = useEditor();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFontUpload = (file: File) => {
    const validExtensions = ['.ttf', '.otf', '.woff2', '.woff'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validExtensions.includes(ext)) {
      showToast('지원하지 않는 폰트 형식입니다 (TTF, OTF, WOFF2)', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('폰트 파일은 5MB 이하만 가능합니다', 'error');
      return;
    }

    const fontName = file.name.replace(/\.[^.]+$/, '');
    const url = URL.createObjectURL(file);

    const fontFace = new FontFace(fontName, `url(${url})`);
    fontFace
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        dispatch({ type: 'ADD_FONT', font: { family: fontName, isCustom: true, file, url } });
        dispatch({ type: 'SELECT_FONT', family: fontName });
        showToast(`'${fontName}' 폰트가 추가되었습니다`, 'success');
      })
      .catch(() => {
        showToast('폰트 로딩에 실패했습니다', 'error');
      });
  };

  const allFonts = [
    ...DEFAULT_FONTS,
    ...state.fonts.map((f) => ({ family: f.family, label: `${f.family} (업로드)` })),
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">폰트 설정</h3>
      <div className="flex items-center gap-2">
        <select
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          value={state.selectedFont}
          onChange={(e) => {
            dispatch({ type: 'SELECT_FONT', family: e.target.value });
            dispatch({ type: 'SET_HERO_TITLE_STYLE', style: { fontFamily: e.target.value } });
            dispatch({ type: 'SET_PRODUCT_NAME_STYLE', style: { fontFamily: e.target.value } });
            dispatch({ type: 'SET_PRODUCT_DESC_STYLE', style: { fontFamily: e.target.value } });
            dispatch({ type: 'SET_PRODUCT_PRICE_STYLE', style: { fontFamily: e.target.value } });
          }}
        >
          {allFonts.map((f) => (
            <option key={f.family} value={f.family}>
              {f.label}
            </option>
          ))}
        </select>
        <button
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          onClick={() => inputRef.current?.click()}
        >
          업로드
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".ttf,.otf,.woff2,.woff"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFontUpload(file);
          }}
        />
      </div>
    </div>
  );
}
