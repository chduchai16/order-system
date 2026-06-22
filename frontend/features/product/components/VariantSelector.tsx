'use client';

import { ProductVariant } from '../types';
import { formatVnd } from '@/lib/utils';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: number | null;
  onSelect: (variant: ProductVariant) => void;
}

export default function VariantSelector({ variants, selectedVariantId, onSelect }: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3 my-4">
      <h4 className="text-sm font-semibold text-gray-700">Lựa chọn:</h4>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onSelect(variant)}
            className={`px-4 py-2 text-sm border rounded-md transition-all ${
              selectedVariantId === variant.id
                ? 'border-orange-500 bg-orange-55 text-[#F1641E] font-medium'
                : 'border-gray-200 bg-white text-gray-605 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-start">
              <span>{variant.name}</span>
              <span className="text-xs text-gray-500">{formatVnd(variant.price)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
