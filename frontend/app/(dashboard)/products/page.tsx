'use client';

import { useEffect, useState } from 'react';
import { productService } from '@/lib/api/productService';
import { Product } from '@/lib/utils/types';
import ProductCard from '@/components/ProductCard';

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
        setError('Failed to load products. Please try again later.');
        console.error('Fetch products error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <div className="mb-8 flex justify-between items-center border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Products Catalog</h1>
        <span className="text-gray-500 text-sm">{products.length} products available</span>
      </div>

      {loading && (
        <div className="text-center py-12 text-gray-600">
          Loading products...
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-md shadow-sm">
          <p className="text-gray-600">No products available at the moment.</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
