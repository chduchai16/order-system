'use client';

import { useEffect, useState } from 'react';
import { productService } from '@/lib/api/productService';
import { Product, Category } from '@/lib/utils/types';
import ProductCard from '@/components/ProductCard';
import BannerCarousel from '@/components/BannerCarousel';
import CategoryGrid from '@/components/CategoryGrid';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err: unknown) {
        setError('Failed to load products. Please try again later.');
        console.error('Fetch products error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (category: Category) => {
    if (selectedCategory === category.slug) {
      setSelectedCategory(null);
      setFilteredProducts(products);
    } else {
      setSelectedCategory(category.slug || null);
      const filtered = products.filter(p => p.category === category.slug);
      setFilteredProducts(filtered.length > 0 ? filtered : products);
    }
  };

  return (
    <div>
      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Category Grid */}
      <CategoryGrid onCategoryClick={handleCategoryClick} />

      {/* Products Section */}
      <div className="mb-8 flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}` : 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {selectedCategory && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setFilteredProducts(products);
                }}
                className="text-blue-600 hover:underline"
              >
                Clear filter
              </button>
            )}
          </p>
        </div>
        <span className="text-gray-500 text-sm">{filteredProducts.length} products available</span>
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

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-md shadow-sm">
          <p className="text-gray-600">No products available at the moment.</p>
        </div>
      )}

      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} variant="compact" />
          ))}
        </div>
      )}
    </div>
  );
}
