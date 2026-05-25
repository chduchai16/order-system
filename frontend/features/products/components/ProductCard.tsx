'use client';

import { useState } from 'react';
import { Product, ProductVariant } from '@/features/shared/types';
import { useCartStore } from '@/features/cart/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  variant?: 'compact' | 'standard';
}

export default function ProductCard({ product, variant = 'standard' }: ProductCardProps) {
  const addToCart = useCartStore(state => state.addToCart);
  const [selectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
  const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}đ`;
  
  // Mock data for UI to match the image
  const discount = Math.floor(Math.random() * 40) + 15;
  const oldPrice = currentPrice * (1 + discount / 100);
  const ratingCount = Math.floor(Math.random() * 500) + 50;

  return (
    <Link 
      href={`/products/${product.id}`}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 group cursor-pointer relative"
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 bg-[#ff3333] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
        -{discount}%
      </div>
      <button className="absolute top-2 right-2 z-10 bg-white p-1.5 rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors">
        <Heart className="w-4 h-4" />
      </button>

      {/* Image Container */}
      <div className="relative bg-[#f4f6fb] overflow-hidden aspect-square flex items-center justify-center p-4">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-20 h-20 text-blue-400 opacity-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
              <path d="M21 19a2 2 0 0 1-2 2h-1c-1.657 0-3-1.343-3-3v-2c0-1.657 1.343-3 3-3h3v8z"></path>
              <path d="M3 19a2 2 0 0 0 2 2h1c1.657 0 3-1.343 3-3v-2c0-1.657-1.343-3-3-3H3v8z"></path>
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex-grow flex flex-col bg-white">
        <h3 className="text-[13px] font-medium text-gray-800 mb-1.5 line-clamp-2 h-10 leading-tight" title={product.name}>
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-[#ffb800]">
            <Star className="w-3 h-3 fill-current" />
          </div>
          <span className="text-[11px] text-gray-500">({ratingCount})</span>
        </div>

        <div className="flex items-baseline gap-1.5 mt-auto">
          <span className="text-[15px] font-bold text-[#ff6600]">
            {formatVnd(currentPrice)}
          </span>
          <span className="text-[11px] text-gray-400 line-through">
            {formatVnd(oldPrice)}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-3 pt-0 bg-white mt-auto">
        <button
          onClick={handleAddToCart}
          disabled={currentStock === 0}
          className="w-full py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:border-gray-400 hover:text-black disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          {currentStock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
        </button>
      </div>
    </Link>
  );
}
