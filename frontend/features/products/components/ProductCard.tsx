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

function getStableVisualMetrics(product: Product) {
  const source = `${product.id}:${product.name}`;
  const seed = source.split('').reduce((total, char) => total + char.charCodeAt(0), 0);

  return {
    discount: 15 + (seed % 40),
    ratingCount: 50 + (seed % 500),
  };
}

function getProductImage(product: Product) {
  const primaryImage = product.images?.find((image) => image.isPrimary && image.url);
  const firstImage = product.images?.find((image) => image.url);
  return primaryImage?.url ?? firstImage?.url ?? product.image ?? null;
}

export default function ProductCard({ product, variant = 'standard' }: ProductCardProps) {
  const addToCart = useCartStore(state => state.addToCart);
  const [selectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart({
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
  
  const { discount, ratingCount } = getStableVisualMetrics(product);
  const oldPrice = currentPrice * (1 + discount / 100);
  const cardPadding = variant === 'compact' ? 'p-3' : 'p-4';
  const titleClassName = variant === 'compact' ? 'text-xs h-8' : 'text-xs md:text-sm h-10';
  const productImage = getProductImage(product);

  return (
    <Link 
      href={`/products/${product.id}`}
      className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden flex flex-col h-full hover:shadow-md hover:border-[#F1641E]/20 transition-all duration-300 group cursor-pointer relative"
    >
      {/* Discount Badge - Etsy Forest Green Style */}
      <div className="absolute top-2.5 left-2.5 z-10 bg-[#EBF2EE] text-[#1E5C3F] text-[10px] font-bold px-2 py-0.5 rounded-sm">
        Giảm {discount}%
      </div>

      {/* Wishlist Heart Button */}
      <button className="absolute top-2.5 right-2.5 z-10 bg-white p-1.5 rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:scale-105 transition-all duration-200 cursor-pointer" aria-label="Yêu thích">
        <Heart className="w-4 h-4" />
      </button>

      {/* Image Container */}
      <div className="relative bg-[#FDFAF7]/40 overflow-hidden aspect-square flex items-center justify-center p-4 border-b border-[#EAE3D2]/30">
        {productImage ? (
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-20 h-20 text-[#F1641E] opacity-50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`${cardPadding} flex-grow flex flex-col bg-white`}>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 line-clamp-1">
          {product.categoryName || 'ShopVN Tuyển chọn'}
        </span>
        <h3 className={`${titleClassName} font-semibold text-[#222222] mb-1.5 line-clamp-2 leading-tight group-hover:text-[#F1641E] transition-colors`} title={product.name}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-[#ffb800]">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-[10.5px] text-gray-500 font-semibold">4.8 ({ratingCount})</span>
        </div>

        {/* Prices */}
        <div className="flex items-baseline gap-1.5 mt-auto mb-3">
          <span className="text-[15px] font-bold text-[#F1641E]">
            {formatVnd(currentPrice)}
          </span>
          <span className="text-[11px] text-gray-400 line-through">
            {formatVnd(oldPrice)}
          </span>
        </div>

        {/* Action Button - Pill Shaped */}
        <button
          onClick={handleAddToCart}
          disabled={currentStock === 0}
          className="w-full py-2 bg-white border border-[#222222] text-[#222222] hover:bg-[#222222] hover:text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-1.5 text-xs font-bold rounded-full cursor-pointer mt-1"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {currentStock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
        </button>
      </div>
    </Link>
  );
}
