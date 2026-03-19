'use client';

import { useEditor } from '@/contexts/EditorContext';
import Button from '@/components/ui/Button';
import ImageUploader from './ImageUploader';

export default function ProductInputForm() {
  const { state, dispatch } = useEditor();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">6. 행사 상품 목록</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">열 수:</span>
            {([1, 2, 3] as const).map((col) => (
              <button
                key={col}
                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                  state.productColumns === col
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => dispatch({ type: 'SET_PRODUCT_COLUMNS', columns: col })}
              >
                {col}열
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {state.products.map((product, index) => (
          <div key={product.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">상품 {index + 1}</span>
              <button
                className="text-xs text-red-500 hover:text-red-700"
                onClick={() => dispatch({ type: 'REMOVE_PRODUCT', id: product.id })}
              >
                삭제
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <ImageUploader
                label="상품 이미지"
                preview={product.imagePreview}
                onUpload={(file, preview) =>
                  dispatch({
                    type: 'UPDATE_PRODUCT',
                    id: product.id,
                    data: { image: file, imagePreview: preview },
                  })
                }
                onRemove={() =>
                  dispatch({
                    type: 'UPDATE_PRODUCT',
                    id: product.id,
                    data: { image: null, imagePreview: '' },
                  })
                }
              />
              <input
                className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="상품명"
                value={product.name}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_PRODUCT',
                    id: product.id,
                    data: { name: e.target.value },
                  })
                }
              />
              <input
                className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="구성 설명 (예: 500ml × 6입)"
                value={product.description}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_PRODUCT',
                    id: product.id,
                    data: { description: e.target.value },
                  })
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5">
                  <label className="text-xs text-gray-400">원가</label>
                  <input
                    type="number"
                    className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="30000"
                    value={product.originalPrice || ''}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_PRODUCT',
                        id: product.id,
                        data: { originalPrice: parseInt(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-xs text-gray-400">할인가</label>
                  <input
                    type="number"
                    className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="19900"
                    value={product.salePrice || ''}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_PRODUCT',
                        id: product.id,
                        data: { salePrice: parseInt(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => dispatch({ type: 'ADD_PRODUCT' })}
        >
          + 상품 추가
        </Button>
      </div>
    </div>
  );
}
