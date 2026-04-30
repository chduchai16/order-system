'use client';

import { Product } from '@/lib/utils/types';
import { useCartStore } from '@/lib/store/cartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore(state => state.addToCart);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity: 1,
      name: product.name,
      price: product.price,
    });
  };

  return (
    <div className="group relative bg-[#111111]/80 border border-white/10 rounded-2xl p-6 hover:bg-[#1a1a1a]/90 transition-all duration-500 backdrop-blur-xl hover:-translate-y-1 hover:border-blue-500/30 overflow-hidden flex flex-col h-full shadow-lg">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500 pointer-events-none"></div>
      
      <div className="flex-grow z-10 relative">
        <h3 className="text-xl font-bold mb-3 text-gray-100 group-hover:text-blue-300 transition-colors">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-400 mb-6 h-12 overflow-hidden font-light leading-relaxed">{product.description}</p>
        )}
      </div>

      <div className="mt-auto z-10 relative">
        <div className="mb-6 flex justify-between items-end">
          <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
            ${product.price.toFixed(2)}
          </p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
            <p className="text-sm text-gray-400 font-medium">
              {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
            </p>
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full px-4 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 disabled:bg-white/5 disabled:text-white/30 disabled:border disabled:border-white/5 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:shadow-none"
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
