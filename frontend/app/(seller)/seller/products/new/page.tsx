'use client';

import { useRouter } from 'next/navigation';
import ProductForm from '@/features/product/components/ProductForm';
import { productService } from '@/features/product/api';
import { ProductFormPayload } from '@/features/product/types';

export default function NewProductPage() {
  const router = useRouter();

  const handleSave = async (payload: ProductFormPayload) => {
    await productService.createProduct(payload);
    router.push('/seller/products');
  };

  const handleCancel = () => {
    router.push('/seller/products');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-left space-y-1">
        <h1 className="font-serif text-2xl font-black text-gray-900">Đăng bán tác phẩm mới</h1>
        <p className="text-xs text-gray-500">Thêm một tác phẩm độc bản hoặc sản phẩm chế tác thủ công vào gian hàng của bạn.</p>
      </div>
      
      <ProductForm 
        product={null} 
        onSave={handleSave} 
        onCancel={handleCancel} 
      />
    </div>
  );
}
