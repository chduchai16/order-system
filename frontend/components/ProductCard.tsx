'use client';

import { Product } from '@/lib/utils/types';
import { useCartStore } from '@/lib/store/cartStore';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  variant?: 'compact' | 'standard';
}

export default function ProductCard({ product, variant = 'standard' }: ProductCardProps) {
  const addToCart = useCartStore(state => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product.id,
      quantity: 1,
      name: product.name,
      price: product.price,
    });
  };

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
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.stock > 0 && (
                <span className="text-xs text-gray-500">
                  {product.stock} left
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-3 pt-0">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-md hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {product.stock === 0 ? 'Out of Stock' : 'Add'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Image Container */}
      {product.image && (
        <div className="relative bg-gray-100 aspect-video">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate" title={product.name}>
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="flex justify-between items-end mt-auto">
          <span className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full border ${product.stock > 0
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
            }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
