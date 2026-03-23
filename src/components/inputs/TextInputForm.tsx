'use client';

import { useEditor } from '@/contexts/EditorContext';
import Input from '@/components/ui/Input';
import type { TextStyle, TextBg } from '@/types';

interface TextStyleControlProps {
  style: TextStyle;
  onChangeStyle: (style: Partial<TextStyle>) => void;
}

function TextStyleControl({ style, onChangeStyle }: TextStyleControlProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">크기 (px)</label>
        <input
          type="number"
          className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          value={style.fontSize}
          onChange={(e) => onChangeStyle({ fontSize: parseInt(e.target.value) || 16 })}
          min={8}
          max={200}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">굵기</label>
        <select
          className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          value={style.fontWeight}
          onChange={(e) => onChangeStyle({ fontWeight: parseInt(e.target.value) })}
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
          value={style.color}
          onChange={(e) => onChangeStyle({ color: e.target.value })}
        />
      </div>
    </div>
  );
}

function TextBgControl({ bg, onChange }: { bg: TextBg; onChange: (partial: Partial<TextBg>) => void }) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-gray-100 bg-gray-50 p-2">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-500 shrink-0">문구 배경</label>
        <select
          className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
          value={bg.type}
          onChange={(e) => onChange({ type: e.target.value as TextBg['type'] })}
        >
          <option value="none">없음</option>
          <option value="solid">단색</option>
          <option value="gradient">그라데이션</option>
          <option value="blur">블러 (유리)</option>
        </select>
      </div>

      {bg.type !== 'none' && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] text-gray-400">배경색</label>
              <input
                type="color"
                className="h-7 w-full cursor-pointer rounded border border-gray-300"
                value={bg.color}
                onChange={(e) => onChange({ color: e.target.value })}
              />
            </div>
            {bg.type === 'gradient' && (
              <div className="flex flex-col gap-0.5">
                <label className="text-[10px] text-gray-400">끝 색상</label>
                <input
                  type="color"
                  className="h-7 w-full cursor-pointer rounded border border-gray-300"
                  value={bg.gradientEndColor}
                  onChange={(e) => onChange({ gradientEndColor: e.target.value })}
                />
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] text-gray-400">투명도 {Math.round(bg.opacity * 100)}%</label>
              <input
                type="range"
                min={0} max={1} step={0.05}
                value={bg.opacity}
                onChange={(e) => onChange({ opacity: parseFloat(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>

          {bg.type === 'gradient' && (
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] text-gray-400">방향</label>
              <select
                className="rounded border border-gray-300 px-2 py-1 text-xs"
                value={bg.gradientDirection}
                onChange={(e) => onChange({ gradientDirection: e.target.value as TextBg['gradientDirection'] })}
              >
                <option value="to right">좌 → 우</option>
                <option value="to left">우 → 좌</option>
                <option value="to bottom">위 → 아래</option>
                <option value="to top">아래 → 위</option>
              </select>
            </div>
          )}

          {bg.type === 'blur' && (
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] text-gray-400">블러 강도 {bg.blurAmount}px</label>
              <input
                type="range"
                min={2} max={30} step={1}
                value={bg.blurAmount}
                onChange={(e) => onChange({ blurAmount: parseInt(e.target.value) })}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] text-gray-400">여백 {bg.padding}px</label>
              <input
                type="range"
                min={0} max={40} step={1}
                value={bg.padding}
                onChange={(e) => onChange({ padding: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] text-gray-400">둥글기 {bg.borderRadius}px</label>
              <input
                type="range"
                min={0} max={30} step={1}
                value={bg.borderRadius}
                onChange={(e) => onChange({ borderRadius: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function TextInputForm() {
  const { state, dispatch } = useEditor();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">4. 문구 설정</h3>
      <div className="flex flex-col gap-4">
        {/* 서브 문구 1 */}
        <div className="flex flex-col gap-2">
          <Input
            label="서브 문구 1 (메인 문구 위)"
            placeholder="예: 3월 한정"
            value={state.heroSubText1}
            onChange={(e) => dispatch({ type: 'SET_HERO_SUB_TEXT1', text: e.target.value })}
          />
          {state.heroSubText1 && (
            <TextStyleControl
              style={state.heroSubText1Style}
              onChangeStyle={(s) => dispatch({ type: 'SET_HERO_SUB_TEXT1_STYLE', style: s })}
            />
          )}
        </div>

        <hr className="border-gray-100" />

        {/* 메인 문구 */}
        <div className="flex flex-col gap-2">
          <Input
            label="메인 문구"
            placeholder="예: 봄맞이 특가 세일!"
            value={state.heroTitle}
            onChange={(e) => dispatch({ type: 'SET_HERO_TITLE', title: e.target.value })}
          />
          <TextStyleControl
            style={state.heroTitleStyle}
            onChangeStyle={(s) => dispatch({ type: 'SET_HERO_TITLE_STYLE', style: s })}
          />
        </div>

        <hr className="border-gray-100" />

        {/* 서브 문구 2 */}
        <div className="flex flex-col gap-2">
          <Input
            label="서브 문구 2 (메인 문구 아래)"
            placeholder="예: 최대 50% 할인"
            value={state.heroSubText2}
            onChange={(e) => dispatch({ type: 'SET_HERO_SUB_TEXT2', text: e.target.value })}
          />
          {state.heroSubText2 && (
            <TextStyleControl
              style={state.heroSubText2Style}
              onChangeStyle={(s) => dispatch({ type: 'SET_HERO_SUB_TEXT2_STYLE', style: s })}
            />
          )}
        </div>

        {/* 서브 문구 3 */}
        <div className="flex flex-col gap-2">
          <Input
            label="서브 문구 3 (서브 문구 2 아래)"
            placeholder="예: 3/22 ~ 3/31 기간 한정"
            value={state.heroSubText3}
            onChange={(e) => dispatch({ type: 'SET_HERO_SUB_TEXT3', text: e.target.value })}
          />
          {state.heroSubText3 && (
            <TextStyleControl
              style={state.heroSubText3Style}
              onChangeStyle={(s) => dispatch({ type: 'SET_HERO_SUB_TEXT3_STYLE', style: s })}
            />
          )}
        </div>

        <hr className="border-gray-100" />

        {/* 통합 문구 배경 */}
        <TextBgControl
          bg={state.heroTextBg}
          onChange={(partial) => dispatch({ type: 'SET_HERO_TEXT_BG', bg: partial })}
        />
      </div>
    </div>
  );
}
