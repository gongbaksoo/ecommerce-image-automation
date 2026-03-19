'use client';

import { useEditor } from '@/contexts/EditorContext';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const { state } = useEditor();

  if (state.products.length === 0) return null;

  return (
    <div
      style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: `repeat(${state.productColumns}, 1fr)`,
        gap: '8px',
        padding: '10px',
        alignContent: 'end',
      }}
    >
      {state.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
