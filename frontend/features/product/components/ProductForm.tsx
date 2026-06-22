'use client';

import { useState, useEffect } from 'react';
import { Product, ProductVariant, ProductAttribute } from '../types';
import { Plus, Trash2, Settings, FileText, Layers } from 'lucide-react';

interface ProductFormProps {
  product: Product | null; // null means adding a new product
  onSave: (product: any) => Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
}

const CATEGORIES = [
  { id: 1, name: 'Food - Bakery' },
  { id: 2, name: 'Food - Drinks' },
  { id: 3, name: 'Food - Pantry' },
  { id: 4, name: 'Food - Snacks' },
  { id: 5, name: 'Craft - Jewelry' },
  { id: 6, name: 'Craft - Home Decor' },
  { id: 7, name: 'Craft - Accessories' },
  { id: 8, name: 'Craft - Stationery' },
];

export default function ProductForm({ product, onSave, onCancel, submitting: externalSubmitting }: ProductFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'attributes' | 'variants'>('basic');

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(6); // default to Craft - Home Decor
  const [price, setPrice] = useState(150000);
  const [stock, setStock] = useState(50);
  const [imageUrl, setImageUrl] = useState('');
  const [attributes, setAttributes] = useState<Omit<ProductAttribute, 'id'>[]>([]);
  const [variants, setVariants] = useState<Omit<ProductVariant, 'id'>[]>([]);

  // Load product if editing
  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      
      // Map category name to ID
      const cat = CATEGORIES.find(c => c.name === product.categoryName);
      setCategoryId(cat ? cat.id : 6);
      
      setPrice(product.price);
      setStock(product.stock);
      
      // Image URL mapping
      const pImage = product.images?.find(img => img.isPrimary)?.url || product.image || '';
      setImageUrl(pImage);
      
      setAttributes(product.attributes || []);
      setVariants(product.variants || []);
    } else {
      // Clear form for creation
      setName('');
      setDescription('');
      setCategoryId(6);
      setPrice(150000);
      setStock(50);
      setImageUrl('');
      setAttributes([
        { name: 'Chất liệu', value: 'Đất sét cao lanh nung tay' },
        { name: 'Hoàn thiện', value: 'Men bóng mộc mạc' }
      ]);
      setVariants([]);
    }
    setActiveTab('basic');
  }, [product]);

  const isSubmitting = externalSubmitting !== undefined ? externalSubmitting : submitting;

  // Add attribute handler
  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', value: '' }]);
  };

  // Remove attribute handler
  const handleRemoveAttribute = (idx: number) => {
    setAttributes(attributes.filter((_, i) => i !== idx));
  };

  const handleAttributeChange = (idx: number, field: 'name' | 'value', val: string) => {
    const updated = [...attributes];
    updated[idx] = { ...updated[idx], [field]: val };
    setAttributes(updated);
  };

  // Add variant handler
  const handleAddVariant = () => {
    setVariants([...variants, { name: '', price, stock, skuCode: `SKU-${Date.now().toString().slice(-4)}` }]);
  };

  // Remove variant handler
  const handleRemoveVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleVariantChange = (idx: number, field: keyof Omit<ProductVariant, 'id'>, val: any) => {
    const updated = [...variants];
    updated[idx] = { ...updated[idx], [field]: val };
    setVariants(updated);
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Vui lòng nhập tên sản phẩm');

    setSubmitting(true);
    try {
      // Map images format
      const imagesList = imageUrl.trim() 
        ? [{ url: imageUrl, isPrimary: true, mediaId: Date.now(), displayOrder: 0 }] 
        : [];

      const payload = {
        name,
        description,
        categoryId,
        categoryName: CATEGORIES.find(c => c.id === Number(categoryId))?.name || 'Craft - Home Decor',
        price: Number(price),
        stock: Number(stock),
        image: imageUrl || undefined,
        images: imagesList,
        attributes: attributes.filter(a => a.name.trim() !== ''),
        variants: variants.filter(v => v.name.trim() !== ''),
      };

      await onSave(payload);
    } catch (err) {
      console.error(err);
      alert('Đã có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FDFAF7] border border-[#EAE3D2] rounded-3xl shadow-sm w-full flex flex-col overflow-hidden relative font-sans">
      {/* Tab Buttons */}
      <div className="flex border-b border-[#EAE3D2]/50 bg-white text-xs font-bold px-3">
        <button
          onClick={() => setActiveTab('basic')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-all ${
            activeTab === 'basic' 
              ? 'border-[#F1641E] text-[#F1641E]' 
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
          type="button"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Thông tin cơ bản</span>
        </button>
        <button
          onClick={() => setActiveTab('attributes')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-all ${
            activeTab === 'attributes' 
              ? 'border-[#F1641E] text-[#F1641E]' 
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
          type="button"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Thuộc tính chi tiết</span>
        </button>
        <button
          onClick={() => setActiveTab('variants')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-all ${
            activeTab === 'variants' 
              ? 'border-[#F1641E] text-[#F1641E]' 
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
          type="button"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Phân loại biến thể</span>
        </button>
      </div>

      {/* Content Form Container */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {activeTab === 'basic' && (
          <div className="space-y-4 text-left">
            {/* Name field */}
            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tên sản phẩm *</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="Ví dụ: Bình gốm sứ Bát Tràng men hoả biến Lam Ngọc"
                required
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222]"
              />
            </div>

            {/* Grid 2 Column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category select */}
              <div className="flex flex-col space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Danh mục ngành hàng</label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(Number(e.target.value))}
                  className="w-full text-xs p-3 border border-gray-300 rounded-xl bg-white text-[#222222] focus:border-[#F1641E]"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Cover Image URL */}
              <div className="flex flex-col space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Ảnh sản phẩm (URL)</label>
                <input 
                  type="url" 
                  value={imageUrl} 
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222]"
                />
              </div>
            </div>

            {/* Price and Stock Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Price field */}
              <div className="flex flex-col space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Đơn giá bán lẻ (VNĐ) *</label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={e => setPrice(Number(e.target.value))}
                  min={0}
                  required
                  className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222]"
                />
              </div>

              {/* Stock field */}
              <div className="flex flex-col space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Số lượng tồn kho ban đầu *</label>
                <input 
                  type="number" 
                  value={stock} 
                  onChange={e => setStock(Number(e.target.value))}
                  min={0}
                  required
                  className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222]"
                />
              </div>
            </div>

            {/* Description field */}
            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mô tả tác phẩm</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết câu chuyện chế tác sản phẩm, nguồn gốc vật liệu, hướng dẫn bảo quản..."
                rows={4}
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222] resize-none"
              />
            </div>
          </div>
        )}

        {activeTab === 'attributes' && (
          <div className="space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-[#EAE3D2]/50 pb-2">
              <div>
                <h4 className="font-serif font-black text-sm text-gray-800">Thông số kĩ thuật / Thuộc tính</h4>
                <p className="text-[10px] text-gray-400">Thêm các chi tiết kỹ thuật giúp khách hàng dễ chọn mua</p>
              </div>
              <button
                type="button"
                onClick={handleAddAttribute}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E5C3F] border border-[#1E5C3F]/20 hover:bg-[#EBF2EE] px-3 py-1.5 rounded-full transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm thuộc tính</span>
              </button>
            </div>

            {attributes.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 font-semibold border border-dashed border-[#EAE3D2]/60 rounded-2xl bg-white">
                Chưa có thuộc tính chi tiết nào. Click nút để thêm mới!
              </div>
            ) : (
              <div className="space-y-3">
                {attributes.map((attr, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <input 
                      type="text" 
                      value={attr.name}
                      onChange={e => handleAttributeChange(idx, 'name', e.target.value)}
                      placeholder="Tên (Ví dụ: Chất liệu, Size)"
                      className="flex-1 text-xs p-2.5 border border-gray-300 rounded-lg bg-white text-[#222222] focus:border-[#F1641E]"
                    />
                    <input 
                      type="text" 
                      value={attr.value}
                      onChange={e => handleAttributeChange(idx, 'value', e.target.value)}
                      placeholder="Giá trị (Ví dụ: Gỗ mun thô, 15cm)"
                      className="flex-1 text-xs p-2.5 border border-gray-300 rounded-lg bg-white text-[#222222] focus:border-[#F1641E]"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveAttribute(idx)}
                      className="p-2.5 rounded-lg text-red-500 border border-red-100 hover:bg-red-50 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'variants' && (
          <div className="space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-[#EAE3D2]/50 pb-2">
              <div>
                <h4 className="font-serif font-black text-sm text-gray-800">Quản lý các biến thể sản phẩm</h4>
                <p className="text-[10px] text-gray-400">Áp dụng khi sản phẩm có các kích thước, màu sắc khác nhau</p>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E5C3F] border border-[#1E5C3F]/20 hover:bg-[#EBF2EE] px-3 py-1.5 rounded-full transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm phân loại</span>
              </button>
            </div>

            {variants.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 font-semibold border border-dashed border-[#EAE3D2]/60 rounded-2xl bg-white">
                Sản phẩm chưa cấu hình biến thể. Chỉ bán theo phiên bản mặc định
              </div>
            ) : (
              <div className="overflow-x-auto border border-[#EAE3D2]/60 rounded-2xl bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F5EFE6]/30 border-b border-[#EAE3D2]/65 text-gray-600 font-bold">
                      <th className="p-3">Tên biến thể *</th>
                      <th className="p-3">SKU Code</th>
                      <th className="p-3 w-28">Đơn giá (đ)</th>
                      <th className="p-3 w-20">Kho hàng</th>
                      <th className="p-3 w-12 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3D2]/35">
                    {variants.map((v, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="p-2">
                          <input 
                            type="text" 
                            value={v.name}
                            onChange={e => handleVariantChange(idx, 'name', e.target.value)}
                            placeholder="Ví dụ: Màu đỏ nhạt"
                            className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white text-[#222222]"
                          />
                        </td>
                        <td className="p-2">
                          <input 
                            type="text" 
                            value={v.skuCode}
                            onChange={e => handleVariantChange(idx, 'skuCode', e.target.value)}
                            className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white text-[#222222]"
                          />
                        </td>
                        <td className="p-2">
                          <input 
                            type="number" 
                            value={v.price}
                            onChange={e => handleVariantChange(idx, 'price', Number(e.target.value))}
                            className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white text-[#222222]"
                          />
                        </td>
                        <td className="p-2">
                          <input 
                            type="number" 
                            value={v.stock}
                            onChange={e => handleVariantChange(idx, 'stock', Number(e.target.value))}
                            className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white text-[#222222]"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button 
                            type="button" 
                            onClick={() => handleRemoveVariant(idx)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Footer Action Buttons */}
        <div className="pt-4 border-t border-[#EAE3D2]/50 flex justify-end gap-3 bg-[#FDFAF7] py-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-[#222222] hover:bg-gray-150 rounded-full text-xs font-bold transition-all cursor-pointer bg-white"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#1E5C3F] hover:bg-[#123b28] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            {isSubmitting ? 'Đang lưu...' : (product ? 'Cập nhật tác phẩm' : 'Đăng bán ngay')}
          </button>
        </div>
      </form>
    </div>
  );
}
