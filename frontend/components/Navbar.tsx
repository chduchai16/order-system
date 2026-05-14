'use client';

import Link from 'next/link';
import {
  Activity,
  BookOpen,
  Heart,
  Home,
  Home as HomeIcon,
  MapPin,
  Search,
  Shirt,
  ShoppingCart,
  Smartphone,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';

export default function Navbar() {
  const cartItemCount = useCartStore((state) => state.getItemCount());

  return (
    <header className="w-full">
      <div className="bg-[#1c2434] text-gray-300 text-xs py-1.5 px-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-semibold">Hotline: 1800 6789</span>
          <div className="flex space-x-4 items-center">
            <Link href="/register" className="hover:text-white transition-colors">Đăng ký</Link>
            <Link href="/login" className="hover:text-white transition-colors">Đăng nhập</Link>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>Hà Nội</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#242e42] py-4 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <Zap className="w-8 h-8 text-[#ff6600] fill-current" />
            <span className="text-2xl font-bold text-white">ShopVN</span>
          </Link>

          <div className="flex-1 max-w-2xl flex items-stretch h-11">
            <div className="relative w-full h-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                className="w-full h-full pl-10 pr-4 bg-[#313d52] border border-[#313d52] rounded-l-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#ff6600] leading-none"
              />
            </div>
            <button className="h-full min-w-28 bg-[#1e2738] hover:bg-gray-800 text-white px-6 rounded-r-md font-semibold transition-colors border border-l-0 border-[#313d52] flex items-center justify-center leading-none">
              Tìm kiếm
            </button>
          </div>

          <div className="flex items-center space-x-6 text-white shrink-0">
            <Link href="/wishlist" className="flex flex-col items-center relative hover:text-[#ff6600] transition-colors">
              <Heart className="w-6 h-6" />
              <span className="text-[10px] mt-1 font-medium">Yêu thích</span>
              <span className="absolute -top-1.5 -right-2 bg-[#ff6600] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center border border-[#242e42]">
                5
              </span>
            </Link>

            <Link href="/cart" className="relative flex flex-col items-center hover:text-[#ff6600] transition-colors cursor-pointer group">
              <div className="flex flex-col items-center relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="text-[10px] mt-1 font-medium">Giỏ hàng</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#ff6600] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center border border-[#242e42]">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Link>

            <Link href="/account" className="flex flex-col items-center hover:text-[#ff6600] transition-colors">
              <User className="w-6 h-6" />
              <span className="text-[10px] mt-1 font-medium">Tài khoản</span>
            </Link>
          </div>
        </div>
      </div>

      <nav className="bg-[#1e2738] border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 overflow-x-auto no-scrollbar">
          <Link href="/" className="flex items-center space-x-2 text-[#ff6600] border-b-2 border-[#ff6600] px-4 py-3 font-medium whitespace-nowrap">
            <Home className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>
          <Link href="/products?category=electronics" className="flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-3 font-medium whitespace-nowrap transition-colors">
            <Smartphone className="w-4 h-4" />
            <span>Điện tử</span>
          </Link>
          <Link href="/products?category=fashion" className="flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-3 font-medium whitespace-nowrap transition-colors">
            <Shirt className="w-4 h-4" />
            <span>Thời trang</span>
          </Link>
          <Link href="/products?category=home" className="flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-3 font-medium whitespace-nowrap transition-colors">
            <HomeIcon className="w-4 h-4" />
            <span>Nhà cửa</span>
          </Link>
          <Link href="/products?category=beauty" className="flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-3 font-medium whitespace-nowrap transition-colors">
            <Sparkles className="w-4 h-4" />
            <span>Làm đẹp</span>
          </Link>
          <Link href="/products?category=sports" className="flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-3 font-medium whitespace-nowrap transition-colors">
            <Activity className="w-4 h-4" />
            <span>Thể thao</span>
          </Link>
          <Link href="/products?category=books" className="flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-3 font-medium whitespace-nowrap transition-colors">
            <BookOpen className="w-4 h-4" />
            <span>Sách</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
