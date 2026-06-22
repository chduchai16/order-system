'use client';

import { Product } from '@/features/product/types';
import { X } from 'lucide-react';
import ProductForm from '@/features/product/components/ProductForm';

interface ProductModalProps {
  product: Product | null; // null means adding a new product
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => Promise<void>;
}

export default function ProductModal({ product, isOpen, onClose, onSave }: ProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="bg-[#FDFAF7] border border-[#EAE3D2] rounded-3xl shadow-2xl w-full max-w-2xl h-[90vh] md:h-auto md:max-h-[85vh] flex flex-col overflow-hidden relative z-10 animate-fade-in font-sans">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#EAE3D2]/50 flex items-center justify-between bg-[#F5EFE6]/20">
          <div className="text-left">
            <h3 className="font-serif text-lg md:text-xl font-black text-gray-900">
              {product ? 'Chỉnh sửa sản phẩm' : 'Đăng bán sản phẩm mới'}
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
              {product ? `ID: ${product.id}` : 'Thêm tác phẩm nghệ thuật thủ công'}
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-gray-250 hover:bg-gray-150 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer bg-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reusable Product Form */}
        <div className="overflow-y-auto max-h-[70vh]">
          <ProductForm 
            product={product as any} 
            onSave={onSave} 
            onCancel={onClose} 
          />
        </div>
      </div>
    </div>
  );
}
