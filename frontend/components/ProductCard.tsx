'use client';

import { useState } from 'react';
import { Product, ProductVariant } from '@/lib/utils/types';
import { useCartStore } from '@/lib/store/cartStore';
import Image from 'next/image';
import VariantSelector from './VariantSelector';
import ProductSpecifications from './ProductSpecifications';

interface ProductCardProps {
  product: Product;
  variant?: 'compact' | 'standard';
}

export default function ProductCard({ product, variant = 'standard' }: ProductCardProps) {
  const addToCart = useCartStore(state => state.addToCart);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product.id,
      quantity: 1,
      productName: selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name,
      unitPrice: selectedVariant ? selectedVariant.price : product.price,
      sku: selectedVariant ? selectedVariant.skuCode : product.sku
    });
  };

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 group cursor-pointer">
        {/* Image Container */}
        <div className="relative bg-gray-100 overflow-hidden aspect-square">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-2xl">📦</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 flex-grow flex flex-col">
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 flex-grow" title={product.name}>
            {product.name}
          </h3>

          <div className="space-y-2">
            {product.categoryName && (
              <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded uppercase font-bold tracking-wider mb-1">
                {product.categoryName}
              </span>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                ${currentPrice.toFixed(2)}
              </span>
              {currentStock > 0 && (
                <span className="text-xs text-gray-500">
                  {currentStock} left
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-3 pt-0">
          <button
            onClick={handleAddToCart}
            disabled={currentStock === 0}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-md hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {currentStock === 0 ? 'Out of Stock' : 'Add'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="relative bg-gray-100 aspect-video">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-4xl">📦</div>
          </div>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate" title={product.name}>
            {product.name}
          </h3>
          {product.categoryName && (
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded uppercase font-bold tracking-wider">
              {product.categoryName}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Dynamic Selectors */}
        {product.variants && (
          <VariantSelector 
            variants={product.variants} 
            selectedVariantId={selectedVariant?.id || null} 
            onSelect={setSelectedVariant} 
          />
        )}
        
        {product.attributes && (
          <ProductSpecifications attributes={product.attributes} />
        )}

        <div className="flex justify-between items-end mt-auto pt-4">
          <span className="text-xl font-bold text-gray-900">
            ${currentPrice.toFixed(2)}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full border ${currentStock > 0
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
            }`}>
            {currentStock > 0 ? `${currentStock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={currentStock === 0}
          className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
