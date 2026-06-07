'use client';

import { useEffect, useMemo, useState } from 'react';
import { productService } from '@/features/products/api/productService';
import { Product } from '@/features/shared/types';
import ProductCard from '@/features/products/components/ProductCard';
import { ChevronLeft, ChevronRight, Clock, Truck, ShieldCheck, RefreshCw, Star, Gift, Filter } from 'lucide-react';
import Link from 'next/link';

const PRODUCTS_PER_PAGE = 8;

const categoriesList = [
  { name: 'Tất cả sản phẩm', count: '1.2k', slug: 'all' },
  { name: 'Ý tưởng Quà tặng', count: '234', slug: 'gifts' },
  { name: 'Quà Ngày của Cha', count: '89', slug: 'fathers-day' },
  { name: 'Đồ gia dụng & Trang trí', count: '156', slug: 'home-living' },
  { name: 'Thời trang tuyển chọn', count: '412', slug: 'fashion' },
  { name: 'Trang sức & Phụ kiện', count: '98', slug: 'jewelry' },
  { name: 'Đồ thủ công & Nghệ thuật', count: '184', slug: 'crafts' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [currentPage, products]);

  const firstProductNumber = products.length === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const lastProductNumber = Math.min(currentPage * PRODUCTS_PER_PAGE, products.length);
  
  const pageNumbers = useMemo(() => {
    const maxVisiblePages = 5;
    const start = Math.max(1, Math.min(currentPage - 2, totalPages - maxVisiblePages + 1));
    const end = Math.min(totalPages, start + maxVisiblePages - 1);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [currentPage, totalPages]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
        setCurrentPage(1);
      } catch (err) {
        console.error('Fetch products error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 font-sans">
      {/* Left Sidebar Filter - Etsy minimal styling */}
      <aside className={`${showMobileFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0 space-y-6 bg-white border border-[#EAE3D2]/60 rounded-2xl p-5 shadow-[0_2px_4px_rgba(0,0,0,0.01)]`}>
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <Filter className="w-4 h-4 text-[#F1641E]" />
          <h3 className="font-serif font-black text-gray-900 text-base">Bộ lọc tìm kiếm</h3>
        </div>

        {/* Categories list */}
        <div className="space-y-3">
          <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Danh mục tuyển chọn</h4>
          <ul className="space-y-1 text-xs">
            {categoriesList.map((cat) => (
              <li key={cat.slug}>
                <button 
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left flex justify-between items-center px-3 py-2.5 rounded-lg font-medium transition-all ${
                    selectedCategory === cat.slug 
                      ? 'bg-[#F5EFE6] text-[#F1641E] font-bold' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{cat.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Slider mockup */}
        <div className="border-t border-gray-100 pt-5 space-y-3">
          <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Khoảng giá</h4>
          <div className="flex justify-between text-[11px] text-gray-500">
            <span>50.000đ</span>
            <span>10.000.000đ</span>
          </div>
          <div className="w-full bg-[#EAE3D2] rounded-full h-1.5 relative">
            <div className="bg-[#F1641E] h-1.5 rounded-full absolute left-[15%] right-[35%]"></div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="text" placeholder="Từ" className="w-full text-xs p-2 border border-gray-200 rounded-lg text-center bg-[#FDFAF7]" />
            <span className="text-gray-400 text-xs">-</span>
            <input type="text" placeholder="Đến" className="w-full text-xs p-2 border border-gray-200 rounded-lg text-center bg-[#FDFAF7]" />
          </div>
        </div>

        {/* Rating filter */}
        <div className="border-t border-gray-100 pt-5 space-y-3">
          <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Đánh giá tuyển chọn</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button className="flex items-center text-gray-600 hover:text-[#F1641E] transition-colors">
                <div className="flex text-[#ffb800] mr-2">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-medium">5 sao hoàn hảo</span>
              </button>
            </li>
            <li>
              <button className="flex items-center text-gray-600 hover:text-[#F1641E] transition-colors">
                <div className="flex text-[#ffb800] mr-2">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 stroke-current text-transparent" />
                </div>
                <span className="font-medium">Từ 4 sao trở lên</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Right Product Grid Column */}
      <div className="flex-1 min-w-0 space-y-6">
        
        {/* Weekend Sale Banner - Etsy style styling */}
        <div className="bg-[#F8F2EC] border border-[#EBE0D5] rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <div className="relative z-10 space-y-3 text-center md:text-left">
            <span className="text-[#D55D24] font-bold text-xs uppercase tracking-wider">Sự kiện mua sắm đặc biệt</span>
            <h2 className="font-serif text-3xl font-extrabold text-[#5A3A22] leading-tight">Siêu sale cuối tuần</h2>
            <p className="text-xs md:text-sm text-[#7D5C45] max-w-md">
              Hàng ngàn sản phẩm quà tặng thủ công mỹ nghệ giảm giá tới 50% chỉ áp dụng trong 3 ngày cuối tuần.
            </p>
            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <Link href="/products?category=sale" className="bg-[#5A3A22] hover:bg-[#7D5C45] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all">
                Mua ngay
              </Link>
              <Link href="/products?category=sale" className="border border-[#5A3A22]/35 text-[#5A3A22] px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#5A3A22]/5 transition-all">
                Xem tất cả ưu đãi
              </Link>
            </div>
          </div>
          <div className="flex gap-4 relative z-10 shrink-0">
            <div className="border border-[#EBE0D5] bg-white rounded-xl p-3.5 text-center w-20 shadow-sm">
              <div className="text-lg font-bold text-[#F1641E]">500+</div>
              <div className="text-[10px] text-gray-500 font-semibold mt-0.5">Sản phẩm</div>
            </div>
            <div className="border border-[#EBE0D5] bg-white rounded-xl p-3.5 text-center w-20 shadow-sm">
              <div className="text-lg font-bold text-[#1E5C3F]">4.9★</div>
              <div className="text-[10px] text-gray-500 font-semibold mt-0.5">Đánh giá</div>
            </div>
          </div>
        </div>

        {/* Localized Category Circles */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categoriesList.slice(1).map((cat, idx) => (
            <button 
              key={cat.slug} 
              onClick={() => setSelectedCategory(cat.slug)}
              className="flex flex-col items-center justify-center p-3 bg-white border border-[#EAE3D2]/50 rounded-xl hover:shadow-md hover:border-[#F1641E]/20 transition-all duration-200 group cursor-pointer"
            >
              <div className="w-10 h-10 mb-2 flex items-center justify-center text-lg bg-[#F5EFE6]/60 rounded-full group-hover:scale-110 transition-transform">
                {idx === 0 ? '🎁' : idx === 1 ? '👔' : idx === 2 ? '🖼️' : idx === 3 ? '🧥' : idx === 4 ? '💍' : '🎨'}
              </div>
              <span className="text-[10.5px] font-bold text-gray-700 text-center line-clamp-1 group-hover:text-[#F1641E] transition-colors">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Flash Sale Banner with Countdown */}
        <div className="bg-[#EBF2EE] border border-[#D0E2D7] rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center text-[#1E5C3F] font-bold text-xs md:text-sm">
            <Clock className="w-4 h-4 mr-2" />
            <span>Chương trình Giờ Vàng mua sắm — Kết thúc sau:</span>
          </div>
          <div className="flex gap-2 text-xs font-bold">
            <div className="bg-[#222222] text-white px-2.5 py-1 rounded-md">02</div>
            <span className="text-[#222222] leading-7">:</span>
            <div className="bg-[#222222] text-white px-2.5 py-1 rounded-md">47</div>
            <span className="text-[#222222] leading-7">:</span>
            <div className="bg-[#222222] text-white px-2.5 py-1 rounded-md">18</div>
          </div>
        </div>

        {/* Products Grid Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-4">
            <div className="text-left">
              <h2 className="font-serif text-lg md:text-xl font-extrabold text-gray-900">Sản phẩm tuyển chọn nổi bật</h2>
              {!loading && (
                <p className="text-xs text-gray-500 mt-1">
                  Hiển thị {firstProductNumber} - {lastProductNumber} trên tổng số {products.length} tác phẩm
                </p>
              )}
            </div>

            <button 
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-1.5 px-4 py-2 border border-[#EAE3D2] rounded-full text-xs font-bold bg-white hover:border-[#222222] transition-all cursor-pointer shrink-0 shadow-sm"
            >
              <Filter className="w-3.5 h-3.5 text-[#F1641E]" />
              <span>{showMobileFilters ? 'Đóng bộ lọc' : 'Lọc sản phẩm'}</span>
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-500 text-sm font-semibold">Đang tải danh sách tác phẩm nghệ thuật...</div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center text-gray-500 text-sm font-semibold">Không tìm thấy sản phẩm nào phù hợp.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination buttons - rounded-full style */}
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center justify-center w-8 h-8 border border-[#EAE3D2] rounded-full text-gray-600 hover:border-[#222222] hover:text-[#222222] disabled:text-gray-300 disabled:border-gray-200 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      aria-current={page === currentPage ? 'page' : undefined}
                      className={`w-8 h-8 rounded-full border text-xs font-bold transition-all duration-200 cursor-pointer ${
                        page === currentPage
                          ? 'border-[#222222] bg-[#222222] text-white'
                          : 'border-[#EAE3D2] bg-white text-gray-600 hover:border-[#222222] hover:text-[#222222]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center justify-center w-8 h-8 border border-[#EAE3D2] rounded-full text-gray-600 hover:border-[#222222] hover:text-[#222222] disabled:text-gray-300 disabled:border-gray-200 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Lower Banner Guarantees - Etsy style */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="border border-[#EAE3D2]/50 bg-white rounded-xl p-4 flex gap-3 items-center group hover:shadow-sm transition-all duration-300">
            <Truck className="w-5 h-5 text-[#F1641E]" />
            <div>
              <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">Giao hàng tin cậy</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Vận chuyển nhanh toàn quốc</p>
            </div>
          </div>
          <div className="border border-[#EAE3D2]/50 bg-white rounded-xl p-4 flex gap-3 items-center group hover:shadow-sm transition-all duration-300">
            <Gift className="w-5 h-5 text-[#F1641E]" />
            <div>
              <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">Nhà sáng tạo Việt</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Cam kết sản phẩm chất lượng</p>
            </div>
          </div>
          <div className="border border-[#EAE3D2]/50 bg-white rounded-xl p-4 flex gap-3 items-center group hover:shadow-sm transition-all duration-300">
            <RefreshCw className="w-5 h-5 text-[#F1641E]" />
            <div>
              <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">Đổi trả 30 ngày</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Yên tâm mua sắm không lo</p>
            </div>
          </div>
          <div className="border border-[#EAE3D2]/50 bg-white rounded-xl p-4 flex gap-3 items-center group hover:shadow-sm transition-all duration-300">
            <ShieldCheck className="w-5 h-5 text-[#F1641E]" />
            <div>
              <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">Thanh toán bảo mật</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Mã hóa an toàn dữ liệu</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
