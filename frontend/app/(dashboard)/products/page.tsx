'use client';

import { useEffect, useMemo, useState } from 'react';
import { productService } from '@/features/products/api/productService';
import { Product } from '@/features/shared/types';
import ProductCard from '@/features/products/components/ProductCard';
import { ChevronLeft, ChevronRight, Clock, Truck, ShieldCheck, RefreshCw, Headset, Star } from 'lucide-react';
import Link from 'next/link';

const PRODUCTS_PER_PAGE = 8;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <aside className="w-64 flex-shrink-0 space-y-6">
        <div>
          <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm">Danh mục</h3>
          <ul className="space-y-1">
            <li>
              <button className="w-full text-left flex justify-between items-center px-3 py-2 bg-orange-50 text-[#ff6600] font-medium rounded-md">
                <span>Tất cả sản phẩm</span>
                <span className="text-xs">1.2k</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left flex justify-between items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                <span>Điện thoại</span>
                <span className="text-xs text-gray-400">234</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left flex justify-between items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                <span>Laptop</span>
                <span className="text-xs text-gray-400">89</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left flex justify-between items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                <span>Âm thanh</span>
                <span className="text-xs text-gray-400">156</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left flex justify-between items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                <span>Thời trang</span>
                <span className="text-xs text-gray-400">412</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left flex justify-between items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                <span>Nhà bếp</span>
                <span className="text-xs text-gray-400">98</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm">Khoảng giá</h3>
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>50k</span>
            <span>10 triệu</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-[#ff6600] h-1.5 rounded-full" style={{ width: '40%', marginLeft: '10%' }}></div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm">Đánh giá</h3>
          <ul className="space-y-2">
            <li>
              <button className="flex items-center text-sm text-gray-600 hover:text-[#ff6600]">
                <div className="flex text-[#ffb800] mr-2">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span>5 sao</span>
              </button>
            </li>
            <li>
              <button className="flex items-center text-sm text-gray-600 hover:text-[#ff6600]">
                <div className="flex text-[#ffb800] mr-2">
                  <Star className="w-4 h-4 fill-current text-transparent stroke-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span>4 sao trở lên</span>
              </button>
            </li>
            <li>
              <button className="flex items-center text-sm text-gray-600 hover:text-[#ff6600]">
                <div className="flex text-[#ffb800] mr-2">
                  <Star className="w-4 h-4 fill-current text-transparent stroke-current" />
                  <Star className="w-4 h-4 fill-current text-transparent stroke-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span>3 sao trở lên</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm">Thương hiệu</h3>
          <ul className="space-y-2">
            <li>
              <button className="w-full text-left flex justify-between items-center text-sm text-gray-600 hover:text-[#ff6600]">
                <span>Apple</span>
                <span className="text-xs text-gray-400">45</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left flex justify-between items-center text-sm text-gray-600 hover:text-[#ff6600]">
                <span>Samsung</span>
                <span className="text-xs text-gray-400">67</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left flex justify-between items-center text-sm text-gray-600 hover:text-[#ff6600]">
                <span>Nike</span>
                <span className="text-xs text-gray-400">89</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left flex justify-between items-center text-sm text-gray-600 hover:text-[#ff6600]">
                <span>Sony</span>
                <span className="text-xs text-gray-400">34</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        
        {/* Main Banner */}
        <div className="bg-[#1e2738] rounded-2xl p-8 mb-6 text-white relative overflow-hidden flex justify-between items-center">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Siêu sale cuối tuần</h2>
            <h1 className="text-4xl font-black mb-4">Giảm đến 70%</h1>
            <p className="text-gray-400 mb-6 max-w-md text-sm">Hàng nghìn sản phẩm chính hãng, giao hàng nhanh toàn quốc</p>
            <div className="flex space-x-4">
              <button className="bg-transparent border border-gray-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition">
                Mua ngay
              </button>
              <button className="bg-transparent border border-gray-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition">
                Xem tất cả ưu đãi
              </button>
            </div>
          </div>
          <div className="flex gap-4 relative z-10">
            <div className="border border-gray-600 rounded-xl p-4 text-center w-24">
              <div className="text-2xl font-bold text-[#ff6600]">10k+</div>
              <div className="text-xs text-gray-400">Sản phẩm</div>
            </div>
            <div className="border border-gray-600 rounded-xl p-4 text-center w-24">
              <div className="text-2xl font-bold text-[#ff6600]">500k</div>
              <div className="text-xs text-gray-400">Khách hàng</div>
            </div>
            <div className="border border-gray-600 rounded-xl p-4 text-center w-24">
              <div className="text-2xl font-bold text-[#ff6600]">4.9</div>
              <div className="text-xs text-gray-400">Đánh giá TB</div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <Link href="#" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:shadow-md transition bg-white group">
            <div className="w-10 h-10 mb-2 flex items-center justify-center text-[#ff6600] group-hover:scale-110 transition-transform">📱</div>
            <span className="text-xs font-medium text-gray-700">Điện thoại</span>
          </Link>
          <Link href="#" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:shadow-md transition bg-white group">
            <div className="w-10 h-10 mb-2 flex items-center justify-center text-[#ff6600] group-hover:scale-110 transition-transform">💻</div>
            <span className="text-xs font-medium text-gray-700">Laptop</span>
          </Link>
          <Link href="#" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:shadow-md transition bg-white group">
            <div className="w-10 h-10 mb-2 flex items-center justify-center text-[#ff6600] group-hover:scale-110 transition-transform">👕</div>
            <span className="text-xs font-medium text-gray-700">Thời trang</span>
          </Link>
          <Link href="#" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:shadow-md transition bg-white group">
            <div className="w-10 h-10 mb-2 flex items-center justify-center text-[#ff6600] group-hover:scale-110 transition-transform">🪑</div>
            <span className="text-xs font-medium text-gray-700">Nội thất</span>
          </Link>
          <Link href="#" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:shadow-md transition bg-white group">
            <div className="w-10 h-10 mb-2 flex items-center justify-center text-[#ff6600] group-hover:scale-110 transition-transform">✨</div>
            <span className="text-xs font-medium text-gray-700">Làm đẹp</span>
          </Link>
          <Link href="#" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:shadow-md transition bg-white group">
            <div className="w-10 h-10 mb-2 flex items-center justify-center text-[#ff6600] group-hover:scale-110 transition-transform">🏃</div>
            <span className="text-xs font-medium text-gray-700">Thể thao</span>
          </Link>
        </div>

        {/* Flash Sale Banner */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex justify-between items-center mb-6">
          <div className="flex items-center text-[#ff6600] font-bold">
            <Clock className="w-5 h-5 mr-2" />
            <span>Flash Sale hôm nay — kết thúc sau</span>
          </div>
          <div className="flex gap-2">
            <div className="bg-[#1e2738] text-white px-2.5 py-1 rounded-md font-bold">02</div>
            <span className="text-[#1e2738] font-bold">:</span>
            <div className="bg-[#1e2738] text-white px-2.5 py-1 rounded-md font-bold">47</div>
            <span className="text-[#1e2738] font-bold">:</span>
            <div className="bg-[#1e2738] text-white px-2.5 py-1 rounded-md font-bold">18</div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
            {!loading && (
              <p className="text-sm text-gray-500 mt-1">
                Hiển thị {firstProductNumber}-{lastProductNumber} trong {products.length} sản phẩm
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Đang tải sản phẩm...</div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-gray-500">Không có sản phẩm nào.</div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mb-8">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:border-[#ff6600] hover:text-[#ff6600] disabled:text-gray-400 disabled:hover:text-gray-400 disabled:hover:border-gray-200 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Trước
              </button>

              <div className="flex items-center gap-2">
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-current={page === currentPage ? 'page' : undefined}
                    className={`w-9 h-9 rounded-md border text-sm font-medium transition-colors ${
                      page === currentPage
                        ? 'border-[#ff6600] bg-[#ff6600] text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-[#ff6600] hover:text-[#ff6600]'
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
                className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:border-[#ff6600] hover:text-[#ff6600] disabled:text-gray-400 disabled:hover:text-gray-400 disabled:hover:border-gray-200 disabled:cursor-not-allowed"
              >
                Sau
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* Promotional Banners */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#1e2738] rounded-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-1">Giao hàng miễn phí toàn quốc</h3>
            <p className="text-gray-400 text-sm mb-4">Đơn hàng từ 200.000đ</p>
            <button className="bg-transparent border border-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition">
              Mua ngay
            </button>
          </div>
          <div className="bg-[#141b2d] rounded-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-1">Hoàn tiền 10% khi thanh toán online</h3>
            <p className="text-gray-400 text-sm mb-4">Áp dụng ví điện tử & thẻ ngân hàng</p>
            <button className="bg-transparent border border-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition">
              Tìm hiểu thêm
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="border border-gray-200 rounded-xl p-4 flex items-start gap-3 bg-white">
            <Truck className="w-8 h-8 text-[#ff6600] shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Giao hàng nhanh</h4>
              <p className="text-xs text-gray-500 mt-1">Toàn quốc 2-3 ngày</p>
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 flex items-start gap-3 bg-white">
            <ShieldCheck className="w-8 h-8 text-[#ff6600] shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Hàng chính hãng</h4>
              <p className="text-xs text-gray-500 mt-1">100% bảo đảm</p>
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 flex items-start gap-3 bg-white">
            <RefreshCw className="w-8 h-8 text-[#ff6600] shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Đổi trả dễ dàng</h4>
              <p className="text-xs text-gray-500 mt-1">Trong vòng 30 ngày</p>
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 flex items-start gap-3 bg-white">
            <Headset className="w-8 h-8 text-[#ff6600] shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Hỗ trợ 24/7</h4>
              <p className="text-xs text-gray-500 mt-1">Chat & gọi điện</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
