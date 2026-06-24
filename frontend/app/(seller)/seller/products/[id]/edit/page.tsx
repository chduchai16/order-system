'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/features/product/components/ProductForm';
import { productService } from '@/features/product/api';
import { Product, ProductFormPayload } from '@/features/product/types';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: productId } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product for editing', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleSave = async (payload: ProductFormPayload) => {
    await productService.updateProduct(productId, payload);
    router.push('/seller/products');
  };

  const handleCancel = () => {
    router.push('/seller/products');
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-sm font-semibold text-gray-500 bg-white border border-[#EAE3D2]/50 rounded-2xl">
        Đang tải thông tin sản phẩm...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-left space-y-1">
        <h1 className="font-serif text-2xl font-black text-gray-900">Chỉnh sửa tác phẩm</h1>
        <p className="text-xs text-gray-500">Cập nhật thông tin chi tiết, giá bán, tồn kho hoặc thuộc tính của tác phẩm này.</p>
      </div>

      <ProductForm 
        product={product} 
        onSave={handleSave} 
        onCancel={handleCancel} 
      />
    </div>
  );
}
