'use client';

import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/features/shared/types';
import { sellerService } from '../api/sellerService';
import ProductModal from './ProductModal';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Package, 
  Layers, 
  SlidersHorizontal 
} from 'lucide-react';
import Image from 'next/image';

function getProductImage(product: Product) {
  const primaryImage = product.images?.find((image) => image.isPrimary && image.url);
  const firstImage = product.images?.find((image) => image.url);
  return primaryImage?.url ?? firstImage?.url ?? product.image ?? null;
}

export default function SellerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await sellerService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}đ`;

  // Get unique list of category names for filter dropdown
  const categoryNames = useMemo(() => {
    const names = new Set<string>();
    products.forEach(p => {
      if (p.categoryName) names.add(p.categoryName);
    });
    return Array.from(names);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = categoryFilter === 'all' || p.categoryName === categoryFilter;
        
        return matchesSearch && matchesCategory;
      })
      .sort((left, right) => {
        if (sortOption === 'price-asc') return left.price - right.price;
        if (sortOption === 'price-desc') return right.price - left.price;
        if (sortOption === 'stock-asc') return left.stock - right.stock;
        if (sortOption === 'stock-desc') return right.stock - left.stock;
        return 0; // default order
      });
  }, [products, searchQuery, categoryFilter, sortOption]);

  // Toggle active status
  const handleToggleActive = async (product: Product) => {
    // If active isn't explicitly set, default toggle
    const currentActive = product.active !== false; // if undefined, true
    const updatedProduct = await sellerService.updateProduct(product.id, {
      ...product,
      active: !currentActive,
    });
    // Update local state
    setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
  };

  // Delete product handler
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá/gỡ bỏ sản phẩm này khỏi cửa hàng không?')) return;
    try {
      await sellerService.deleteProduct(id);
      fetchProducts(); // reload
    } catch (err) {
      console.error(err);
      alert('Không thể xoá sản phẩm');
    }
  };

  // Edit click
  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Add click
  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  // Save modal callback
  const handleSaveProduct = async (payload: any) => {
    if (selectedProduct) {
      // Edit save
      const updated = await sellerService.updateProduct(selectedProduct.id, payload);
      setProducts(products.map(p => p.id === selectedProduct.id ? updated : p));
    } else {
      // Create save
      const created = await sellerService.createProduct(payload);
      setProducts([created, ...products]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top action block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#EAE3D2]/50 p-4 rounded-2xl shadow-sm">
        <div className="text-left">
          <h2 className="font-serif text-lg md:text-xl font-black text-gray-900">Danh sách tác phẩm</h2>
          <p className="text-[10px] text-gray-500 mt-0.5">Tổng số {filteredProducts.length} tác phẩm đang hiển thị trong bộ lọc</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 bg-[#1E5C3F] hover:bg-[#123926] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Đăng bán sản phẩm mới
        </button>
      </div>

      {/* Filter and search row */}
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-3 bg-white border border-[#EAE3D2]/50 p-4 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên sản phẩm, mã SKU..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222]"
          />
          <Search className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full text-xs pl-4 pr-10 py-2.5 border border-gray-300 rounded-xl bg-white text-[#222222] focus:border-[#F1641E] appearance-none cursor-pointer"
          >
            <option value="all">Tất cả danh mục ngành</option>
            {categoryNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <Layers className="w-4.5 h-4.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sorting options */}
        <div className="relative">
          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            className="w-full text-xs pl-4 pr-10 py-2.5 border border-gray-300 rounded-xl bg-white text-[#222222] focus:border-[#F1641E] appearance-none cursor-pointer"
          >
            <option value="newest">Sắp xếp: Mới nhất</option>
            <option value="price-asc">Giá: Thấp đến cao</option>
            <option value="price-desc">Giá: Cao đến thấp</option>
            <option value="stock-asc">Kho hàng: Tăng dần</option>
            <option value="stock-desc">Kho hàng: Giảm dần</option>
          </select>
          <SlidersHorizontal className="w-4.5 h-4.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main product table */}
      <div className="bg-white border border-[#EAE3D2]/50 rounded-3xl overflow-hidden shadow-sm text-left">
        {loading ? (
          <div className="py-16 text-center text-xs font-semibold text-gray-400">Đang tải danh sách tác phẩm nghệ thuật...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-xs font-semibold text-gray-400">Không tìm thấy sản phẩm nào trong bộ lọc.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5EFE6]/30 border-b border-[#EAE3D2]/65 text-gray-600 font-bold">
                  <th className="p-4 w-16 text-center">Ảnh</th>
                  <th className="p-4">Thông tin sản phẩm</th>
                  <th className="p-4 w-32">SKU Code</th>
                  <th className="p-4 w-32">Đơn giá bán</th>
                  <th className="p-4 w-24">Tồn kho</th>
                  <th className="p-4 w-28 text-center">Trạng thái</th>
                  <th className="p-4 w-24 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D2]/35">
                {filteredProducts.map((p) => {
                  const productImage = getProductImage(p);
                  const isActive = p.active !== false; // defaults to true
                  
                  return (
                    <tr key={p.id} className="hover:bg-[#FDFAF7]/30 transition-all">
                      <td className="p-4 text-center shrink-0">
                        <div className="w-11 h-11 relative rounded-xl border border-gray-150 overflow-hidden bg-gray-50 flex items-center justify-center">
                          {productImage ? (
                            <img src={productImage} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-gray-800">
                        <h4 className="line-clamp-2 leading-tight max-w-sm mb-1">{p.name}</h4>
                        <span className="text-[9.5px] bg-[#F5EFE6] text-[#7D5C45] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {p.categoryName || 'Mặc định'}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-medium text-gray-500 uppercase">{p.sku || `SKU-${p.id.toString().slice(-4)}`}</td>
                      <td className="p-4 font-bold text-[#F1641E]">{formatVnd(p.price)}</td>
                      <td className="p-4">
                        <span className={`font-bold ${p.stock <= 15 ? 'text-red-500 font-extrabold' : 'text-gray-700'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(p)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-[#EBF2EE] text-[#1E5C3F] border-[#1e5c3f]/25 hover:bg-red-55 hover:text-red-600 hover:border-red-200'
                              : 'bg-red-50 text-red-600 border-red-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
                          }`}
                        >
                          {isActive ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Hiển thị</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Ẩn tắt</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            className="p-2 border border-gray-200 hover:border-[#1E5C3F]/30 hover:bg-gray-50 rounded-lg text-gray-650 hover:text-[#1E5C3F] transition-all cursor-pointer bg-white"
                            title="Sửa sản phẩm"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 border border-red-100 hover:bg-red-50 rounded-lg text-red-500 transition-all cursor-pointer bg-white"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product edit/create Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />

    </div>
  );
}
