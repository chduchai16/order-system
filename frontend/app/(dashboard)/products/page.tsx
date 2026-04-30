'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { productService } from '@/lib/api/productService';
import { Product } from '@/lib/utils/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to load products';
        setError(errorMsg);
        console.error('Fetch products error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-8 text-white tracking-tight">Products Catalog</h1>
      
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="text-gray-400 font-light tracking-wide">Loading catalog...</div>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm backdrop-blur-sm flex items-start gap-2">
          <span className="mt-0.5">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {!loading && products.length === 0 && !error && (
        <div className="text-center py-20 text-gray-400 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm font-light">
          No products available
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
