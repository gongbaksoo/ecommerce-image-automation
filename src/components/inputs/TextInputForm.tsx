'use client';

import { useEditor } from '@/contexts/EditorContext';
import Input from '@/components/ui/Input';

export default function TextInputForm() {
  const { state, dispatch } = useEditor();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">4. 메인 문구</h3>
      <div className="flex flex-col gap-3">
        <Input
          label="행사 문구"
          placeholder="예: 봄맞이 특가 세일!"
          value={state.heroTitle}
          onChange={(e) => dispatch({ type: 'SET_HERO_TITLE', title: e.target.value })}
        />
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">크기 (px)</label>
            <input
              type="number"
              className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              value={state.heroTitleStyle.fontSize}
              onChange={(e) =>
                dispatch({
                  type: 'SET_HERO_TITLE_STYLE',
                  style: { fontSize: parseInt(e.target.value) || 32 },
                })
              }
              min={8}
              max={200}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">굵기</label>
            <select
              className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              value={state.heroTitleStyle.fontWeight}
              onChange={(e) =>
                dispatch({
                  type: 'SET_HERO_TITLE_STYLE',
                  style: { fontWeight: parseInt(e.target.value) },
                })
              }
            >
              <option value={400}>보통</option>
              <option value={600}>굵게</option>
              <option value={700}>더 굵게</option>
              <option value={900}>최대 굵기</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">색상</label>
            <input
              type="color"
              className="h-[34px] w-full cursor-pointer rounded-lg border border-gray-300"
              value={state.heroTitleStyle.color}
              onChange={(e) =>
                dispatch({ type: 'SET_HERO_TITLE_STYLE', style: { color: e.target.value } })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
