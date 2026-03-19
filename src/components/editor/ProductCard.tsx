'use client';

import { useEditor } from '@/contexts/EditorContext';
import { formatPrice } from '@/lib/utils/formatPrice';
import type { ProductItem } from '@/types';

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { state } = useEditor();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '10px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: '8px',
      }}
    >
      {/* 상품 이미지 */}
      {product.imagePreview ? (
        <img
          src={product.imagePreview}
          alt={product.name}
          style={{
            width: '80%',
            aspectRatio: '1',
            objectFit: 'cover',
            borderRadius: '6px',
          }}
        />
      ) : (
        <div
          style={{
            width: '80%',
            aspectRatio: '1',
            backgroundColor: '#e5e7eb',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#9ca3af',
          }}
        >
          이미지
        </div>
      )}

      {/* 상품명 */}
      {product.name && (
        <p
          style={{
            fontFamily: state.productNameStyle.fontFamily,
            fontSize: `${state.productNameStyle.fontSize}px`,
            fontWeight: state.productNameStyle.fontWeight,
            color: state.productNameStyle.color,
            textAlign: state.productNameStyle.textAlign,
            lineHeight: 1.3,
            width: '100%',
          }}
        >
          {product.name}
        </p>
      )}

      {/* 구성 설명 */}
      {product.description && (
        <p
          style={{
            fontFamily: state.productDescStyle.fontFamily,
            fontSize: `${state.productDescStyle.fontSize}px`,
            fontWeight: state.productDescStyle.fontWeight,
            color: state.productDescStyle.color,
            textAlign: state.productDescStyle.textAlign,
            lineHeight: 1.3,
            width: '100%',
          }}
        >
          {product.description}
        </p>
      )}

      {/* 가격 */}
      <div style={{ width: '100%', textAlign: 'center' }}>
        {product.originalPrice > 0 && product.originalPrice !== product.salePrice && (
          <p
            style={{
              fontSize: `${state.productPriceStyle.fontSize - 4}px`,
              color: '#999',
              textDecoration: 'line-through',
              lineHeight: 1.2,
            }}
          >
            {formatPrice(product.originalPrice)}
          </p>
        )}
        {product.salePrice > 0 && (
          <p
            style={{
              fontFamily: state.productPriceStyle.fontFamily,
              fontSize: `${state.productPriceStyle.fontSize}px`,
              fontWeight: state.productPriceStyle.fontWeight,
              color: state.productPriceStyle.color,
              lineHeight: 1.3,
            }}
          >
            {formatPrice(product.salePrice)}
          </p>
        )}
      </div>
    </div>
  );
}
