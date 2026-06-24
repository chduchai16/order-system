'use client';

import { useSyncExternalStore, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Search,
  ShoppingCart,
  User,
  Gift,
  Sparkles,
  Home as HomeIcon,
  Menu,
  Globe,
  LogOut,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';
import { useCartStore } from '@/features/cart/store/cartStore';
import { tokenStore } from '@/features/shared/api/tokenStore';
import { userService } from '@/features/account/api/userService';
import { User as UserType } from '@/features/shared/types';
import { useEffect } from 'react';

interface SubCategory {
  name: string;
  slug: string;
  imageUrl: string;
}

interface MegaCategory {
  key: string;
  name: string;
  slug: string;
  subCategories: SubCategory[];
}

const megaCategories: MegaCategory[] = [
  {
    key: 'home-living',
    name: 'Gốm sứ & Gia dụng',
    slug: 'home-living',
    subCategories: [
      { name: 'Cốc & Ly sứ', slug: 'home-living', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80' },
      { name: 'Bình hoa gốm', slug: 'home-living', imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&auto=format&fit=crop&q=80' },
      { name: 'Ấm & Chén trà', slug: 'home-living', imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&auto=format&fit=crop&q=80' },
      { name: 'Khay gỗ & Dĩa', slug: 'home-living', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&auto=format&fit=crop&q=80' },
    ]
  },
  {
    key: 'jewelry',
    name: 'Trang sức bạc & Đá',
    slug: 'jewelry',
    subCategories: [
      { name: 'Nhẫn bạc', slug: 'jewelry', imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&auto=format&fit=crop&q=80' },
      { name: 'Dây chuyền', slug: 'jewelry', imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=80' },
      { name: 'Bông tai', slug: 'jewelry', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&auto=format&fit=crop&q=80' },
      { name: 'Vòng tay trầm', slug: 'jewelry', imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&auto=format&fit=crop&q=80' },
    ]
  },
  {
    key: 'candles',
    name: 'Nến thơm & Tinh dầu',
    slug: 'crafts',
    subCategories: [
      { name: 'Nến thơm sáp', slug: 'crafts', imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&auto=format&fit=crop&q=80' },
      { name: 'Tinh dầu treo', slug: 'crafts', imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&auto=format&fit=crop&q=80' },
      { name: 'Sáp thơm treo', slug: 'crafts', imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&auto=format&fit=crop&q=80' },
    ]
  },
  {
    key: 'art',
    name: 'Tranh vẽ & Nghệ thuật',
    slug: 'crafts',
    subCategories: [
      { name: 'Tranh thêu tay', slug: 'crafts', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&auto=format&fit=crop&q=80' },
      { name: 'Tranh in Canvas', slug: 'crafts', imageUrl: 'https://images.unsplash.com/photo-1501472312651-726afd116ff1?w=300&auto=format&fit=crop&q=80' },
      { name: 'Tranh sơn mài', slug: 'crafts', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&auto=format&fit=crop&q=80' },
    ]
  },
  {
    key: 'fashion',
    name: 'Thời trang & Túi',
    slug: 'fashion',
    subCategories: [
      { name: 'Áo thun thêu', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80' },
      { name: 'Túi tote linen', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=80' },
      { name: 'Khăn choàng len', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300&auto=format&fit=crop&q=80' },
      { name: 'Mũ len móc', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d4353c0?w=300&auto=format&fit=crop&q=80' },
    ]
  },
  {
    key: 'leather',
    name: 'Sổ tay & Đồ da bò',
    slug: 'fashion',
    subCategories: [
      { name: 'Sổ tay da bò', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=300&auto=format&fit=crop&q=80' },
      { name: 'Ví da nam', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&auto=format&fit=crop&q=80' },
      { name: 'Bao da iPad', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&auto=format&fit=crop&q=80' },
    ]
  },
  {
    key: 'gifts',
    name: 'Ý tưởng quà tặng',
    slug: 'gifts',
    subCategories: [
      { name: 'Quà sinh nhật', slug: 'gifts', imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&auto=format&fit=crop&q=80' },
      { name: 'Quà tân gia', slug: 'gifts', imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&auto=format&fit=crop&q=80' },
      { name: 'Quà cho Cha', slug: 'fathers-day', imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=300&auto=format&fit=crop&q=80' },
      { name: 'Hộp quà combo', slug: 'gifts', imageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=300&auto=format&fit=crop&q=80' },
    ]
  }
];

export default function Navbar() {
  const isHydrated = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const cartItemCount = useCartStore((state) => state.items.reduce((count, item) => count + item.quantity, 0));
  const initializeCart = useCartStore((state) => state.initializeCart);
  const resetCartState = useCartStore((state) => state.resetCartState);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [profile, setProfile] = useState<UserType | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [activeMegaCategory, setActiveMegaCategory] = useState('home-living');

  useEffect(() => {
    void initializeCart();
  }, [initializeCart]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = tokenStore.getAccessToken();
      if (!token) {
        setLoadingProfile(false);
        return;
      }
      try {
        const data = await userService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile in Navbar:', err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <header className="w-full bg-[#FDFAF7] border-b border-[#EAE3D2]/60 sticky top-0 z-50">
      {/* Top micro bar */}
      <div className="bg-[#F5EFE6]/50 text-[#555555] text-[11px] py-1.5 px-6 border-b border-[#EAE3D2]/40 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-medium">Chào mừng bạn đến với ShopVN — Nền tảng thương mại trực tuyến lớn nhất Việt Nam!</span>
          <div className="flex space-x-5 items-center">
            <Link href="/products?category=sale" className="hover:text-[#F1641E] transition-colors font-semibold text-[#1E5C3F]">Ưu đãi hè - Giảm tới 50%</Link>
            <span className="text-gray-300">|</span>
            <div className="flex items-center space-x-1 hover:text-black cursor-pointer">
              <Globe className="w-3.5 h-3.5" />
              <span>Việt Nam / VNĐ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4 md:gap-8">
        {/* Mobile menu toggle & Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-1 text-gray-700 hover:text-black md:hidden cursor-pointer"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="flex items-center space-x-1.5 group">
            <span className="font-serif text-3xl font-black text-[#F1641E] tracking-tight group-hover:opacity-90 transition-opacity">ShopVN</span>
          </Link>

          {/* Etsy Style Categories Menu Button */}
          <div className="hidden md:block relative">
            <button 
              onClick={() => setShowMegaMenu(!showMegaMenu)}
              className="flex items-center gap-1.5 hover:bg-[#F5EFE6]/60 px-4 py-2.5 rounded-full transition-all text-xs font-bold text-[#222222] cursor-pointer"
              type="button"
            >
              <Menu className="w-4 h-4 text-[#F1641E]" />
              <span>Danh mục</span>
            </button>
            
            {showMegaMenu && (
              <>
                {/* Backdrop to close when clicking outside */}
                <div className="fixed inset-0 z-30" onClick={() => setShowMegaMenu(false)} />
                
                {/* Mega Menu Dropdown */}
                <div className="absolute left-0 mt-3.5 z-40 bg-white border border-[#EAE3D2]/70 rounded-2xl shadow-2xl w-[90vw] max-w-4xl h-[480px] flex overflow-hidden font-sans">
                  {/* Left Column: Categories List */}
                  <div className="w-1/3 border-r border-[#EAE3D2]/50 bg-[#FDFAF7]/40 overflow-y-auto py-3">
                    {megaCategories.map((cat) => (
                      <button
                        key={cat.key}
                        onMouseEnter={() => setActiveMegaCategory(cat.key)}
                        onClick={() => setActiveMegaCategory(cat.key)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold transition-all text-left ${
                          activeMegaCategory === cat.key
                            ? 'bg-white text-[#F1641E] border-l-4 border-[#F1641E]'
                            : 'text-gray-700 hover:bg-[#F5EFE6]/20'
                        }`}
                        type="button"
                      >
                        <span>{cat.name}</span>
                        <ChevronRight className={`w-3.5 h-3.5 ${activeMegaCategory === cat.key ? 'text-[#F1641E]' : 'text-gray-400'}`} />
                      </button>
                    ))}
                  </div>
                  
                  {/* Right Column: Subcategories Grid */}
                  <div className="flex-1 bg-white overflow-y-auto p-6 flex flex-col justify-between">
                    <div>
                      {/* Active category header link */}
                      {megaCategories.find(c => c.key === activeMegaCategory) && (
                        <div className="mb-6 flex justify-between items-center border-b border-gray-100 pb-3">
                          <Link 
                            href={`/products?category=${megaCategories.find(c => c.key === activeMegaCategory)?.slug}`} 
                            onClick={() => setShowMegaMenu(false)}
                            className="group flex items-center gap-1 font-serif font-black text-gray-900 text-base md:text-lg hover:text-[#F1641E] transition-colors"
                          >
                            <span>Tất cả {megaCategories.find(c => c.key === activeMegaCategory)?.name}</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      )}
                      
                      {/* Subcategories grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {megaCategories.find(c => c.key === activeMegaCategory)?.subCategories.map((sub, idx) => (
                          <Link 
                            key={`${sub.name}-${idx}`}
                            href={`/products?category=${sub.slug}`} 
                            onClick={() => setShowMegaMenu(false)}
                            className="group flex flex-col items-center text-center space-y-2.5 cursor-pointer"
                          >
                            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300">
                              <Image 
                                src={sub.imageUrl} 
                                alt={sub.name} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-300" 
                                sizes="(max-width: 768px) 50vw, 20vw" 
                              />
                            </div>
                            <span className="text-[11.5px] font-bold text-gray-700 group-hover:text-[#F1641E] transition-colors leading-tight">{sub.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search Bar - Etsy Style */}
        <div className="flex-1 max-w-3xl hidden md:flex items-center h-12">
          <form className="w-full h-full flex items-stretch relative" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex-1 h-full">
              <input
                type="text"
                placeholder="Tìm kiếm mọi thứ: quà tặng, tranh vẽ, thời trang..."
                className="w-full h-full pl-5 pr-12 bg-white border-2 border-[#222222] rounded-l-full text-[#222222] placeholder-gray-500 focus:bg-white focus:outline-none text-sm transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]"
              />
              <button 
                type="submit" 
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-black cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-400 hover:text-gray-700" />
              </button>
            </div>
            <button className="h-full bg-[#222222] hover:bg-[#F1641E] text-white px-7 rounded-r-full font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center border-2 border-l-0 border-[#222222] hover:border-[#F1641E]">
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-3 sm:space-x-5 text-gray-700 shrink-0">
          <Link href="/business" className="hidden md:flex items-center gap-1.5 bg-[#EBF2EE] hover:bg-[#d5ebdcf5] text-[#1E5C3F] font-bold text-xs px-4 py-2 rounded-full transition-all duration-200 border border-[#1E5C3F]/20 cursor-pointer mr-0.5" title="Kênh người bán - Shop Manager">
            <ShoppingBag className="w-4 h-4 text-[#1E5C3F]" />
            <span>Kênh người bán</span>
          </Link>

          <Link href="/wishlist" className="p-2.5 rounded-full hover:bg-gray-100/80 transition-colors relative flex items-center justify-center cursor-pointer group" title="Danh sách yêu thích">
            <Heart className="w-6 h-6 group-hover:scale-105 transition-transform" />
            <span className="absolute top-1 right-1 bg-[#1E5C3F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#FDFAF7]">
              5
            </span>
          </Link>


          {isHydrated && !loadingProfile && profile ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="w-9 h-9 rounded-full bg-[#F5EFE6] text-[#F1641E] border border-[#EAE3D2] hover:border-[#F1641E] flex items-center justify-center font-bold text-sm uppercase shadow-sm shrink-0 cursor-pointer transition-all duration-200 focus:outline-none"
                type="button"
                aria-haspopup="true"
                aria-expanded={showUserDropdown}
                title="Tài khoản"
              >
                {profile.firstName ? profile.firstName[0] : (profile.username ? profile.username[0] : 'U')}
              </button>
              
              {showUserDropdown && (
                <>
                  {/* Backdrop overlay to close when clicking outside */}
                  <div className="fixed inset-0 z-30" onClick={() => setShowUserDropdown(false)} />
                  
                  {/* Dropdown Card */}
                  <div className="absolute right-0 mt-2.5 w-60 bg-white border border-[#EAE3D2]/60 rounded-2xl shadow-xl py-3 px-1 z-40 animate-fade-in font-sans">
                    <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F5EFE6] text-[#F1641E] border border-[#EAE3D2] flex items-center justify-center font-bold text-base uppercase shrink-0">
                        {profile.firstName ? profile.firstName[0] : (profile.username ? profile.username[0] : 'U')}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{profile.firstName || profile.username}</p>
                        <p className="text-[10px] text-gray-400 truncate text-ellipsis overflow-hidden">{profile.email || 'Nghệ nhân Việt'}</p>
                      </div>
                    </div>
                    
                    <div className="py-1.5">
                      <Link 
                        href="/account" 
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-[#F5EFE6]/35 hover:text-black transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-gray-450" />
                        <span>Trang cá nhân của tôi</span>
                      </Link>
                      <Link 
                        href="/account" 
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-[#F5EFE6]/35 hover:text-black transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4 text-gray-450" />
                        <span>Đơn hàng đã mua</span>
                      </Link>
                      <Link 
                        href="/wishlist" 
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-[#F5EFE6]/35 hover:text-black transition-colors cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-gray-450" />
                        <span>Sản phẩm yêu thích</span>
                      </Link>
                      <Link 
                        href="/business" 
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#1E5C3F] hover:bg-[#EBF2EE] transition-colors cursor-pointer border-t border-gray-100 mt-1 pt-2"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#1E5C3F]" />
                        <span>Kênh Người Bán</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-2 px-3">
                      <button
                        onClick={() => {
                          tokenStore.clearTokens();
                          resetCartState();
                          setProfile(null);
                          setShowUserDropdown(false);
                          window.location.reload();
                        }}
                        className="w-full py-2 text-center bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-full text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        type="button"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất tài khoản</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Link href="/login" className="text-sm font-semibold hover:text-[#F1641E] transition-colors py-1.5 px-3 rounded-full hover:bg-gray-100/60 hidden md:block">
                Đăng nhập
              </Link>
              <Link href="/login" className="p-2.5 rounded-full hover:bg-gray-100/80 transition-colors flex items-center justify-center cursor-pointer group" title="Đăng nhập">
                <User className="w-6 h-6 group-hover:scale-105 transition-transform" />
              </Link>
            </div>
          )}

          <Link href="/cart" className="p-2.5 rounded-full hover:bg-gray-100/80 transition-colors relative flex items-center justify-center cursor-pointer group" title="Giỏ hàng">
            <ShoppingCart className="w-6 h-6 group-hover:scale-105 transition-transform" />
            {isHydrated && cartItemCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#F1641E] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full border-2 border-[#FDFAF7]">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Search - Visible only on mobile */}
      <div className="px-4 pb-3 md:hidden">
        <form className="w-full h-10 flex relative" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Tìm kiếm quà tặng, đồ thủ công..."
            className="w-full h-full pl-4 pr-10 bg-white border border-[#222222] rounded-full text-xs placeholder-gray-500 focus:outline-none"
          />
          <button type="submit" className="absolute right-0 top-0 h-full px-3.5 flex items-center text-gray-500 hover:text-[#F1641E]" aria-label="Submit Search">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Sub Navigation (Categories) - Etsy inspired links */}
      <nav className="border-t border-[#EAE3D2]/40 hidden md:block bg-[#FDFAF7]/85 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-center space-x-1.5 lg:space-x-4 overflow-x-auto no-scrollbar py-2 text-xs font-semibold text-gray-700">
          <Link href="/products?category=gifts" className="flex items-center gap-1 hover:bg-[#F5EFE6]/60 px-3 py-2 rounded-full transition-colors whitespace-nowrap">
            <Gift className="w-3.5 h-3.5 text-[#F1641E]" />
            <span>Ý tưởng Quà tặng</span>
          </Link>
          <Link href="/products?category=fathers-day" className="hover:bg-[#F5EFE6]/60 px-3 py-2 rounded-full transition-colors whitespace-nowrap text-[#1E5C3F] font-bold">
            Quà Ngày của Cha 🎁
          </Link>
          <Link href="/products?category=home-living" className="flex items-center gap-1 hover:bg-[#F5EFE6]/60 px-3 py-2 rounded-full transition-colors whitespace-nowrap">
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Đồ gia dụng & Trang trí</span>
          </Link>
          <Link href="/products?category=fashion" className="hover:bg-[#F5EFE6]/60 px-3 py-2 rounded-full transition-colors whitespace-nowrap">
            Thời trang tuyển chọn
          </Link>
          <Link href="/products?category=jewelry" className="hover:bg-[#F5EFE6]/60 px-3 py-2 rounded-full transition-colors whitespace-nowrap">
            Trang sức & Phụ kiện
          </Link>
          <Link href="/products?category=crafts" className="flex items-center gap-1 hover:bg-[#F5EFE6]/60 px-3 py-2 rounded-full transition-colors whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-[#FBBF24] fill-[#FBBF24]" />
            <span>Đồ thủ công & Nghệ thuật</span>
          </Link>
          <Link href="/products?category=sale" className="hover:bg-red-50 hover:text-red-600 text-[#ff3333] px-3 py-2 rounded-full transition-colors whitespace-nowrap">
            Ưu đãi Đặc biệt %
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden flex" onClick={() => setShowMobileMenu(false)}>
          <div className="w-72 bg-[#FDFAF7] h-full p-6 flex flex-col space-y-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="font-serif text-2xl font-black text-[#F1641E]">ShopVN</span>
              <button onClick={() => setShowMobileMenu(false)} className="text-gray-500 font-bold hover:text-black cursor-pointer text-lg">×</button>
            </div>
            <ul className="space-y-4 font-semibold text-sm text-gray-700 flex-1 overflow-y-auto">
              <li>
                <Link href="/products?category=fathers-day" onClick={() => setShowMobileMenu(false)} className="block text-[#1E5C3F] font-bold">
                  Quà Ngày của Cha 🎁
                </Link>
              </li>
              <li>
                <Link href="/products?category=gifts" onClick={() => setShowMobileMenu(false)} className="block py-1">
                  Ý tưởng Quà tặng
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-living" onClick={() => setShowMobileMenu(false)} className="block py-1">
                  Đồ gia dụng & Trang trí
                </Link>
              </li>
              <li>
                <Link href="/products?category=fashion" onClick={() => setShowMobileMenu(false)} className="block py-1">
                  Thời trang tuyển chọn
                </Link>
              </li>
              <li>
                <Link href="/products?category=jewelry" onClick={() => setShowMobileMenu(false)} className="block py-1">
                  Trang sức & Phụ kiện
                </Link>
              </li>
              <li>
                <Link href="/products?category=crafts" onClick={() => setShowMobileMenu(false)} className="block py-1">
                  Đồ thủ công & Nghệ thuật
                </Link>
              </li>
              <li>
                <Link href="/products?category=sale" onClick={() => setShowMobileMenu(false)} className="block py-1 text-red-500">
                  Ưu đãi Đặc biệt %
                </Link>
              </li>
              <li className="border-t border-gray-200/80 pt-3 mt-2">
                <Link href="/business" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-2 py-1 text-[#1E5C3F] font-bold">
                  <ShoppingBag className="w-4 h-4 text-[#1E5C3F]" />
                  <span>Kênh Người Bán</span>
                </Link>
              </li>
            </ul>
            <div className="pt-6 border-t border-gray-200 space-y-3">
              {profile ? (
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F5EFE6] text-[#F1641E] border border-[#EAE3D2] flex items-center justify-center font-bold text-sm uppercase shadow-sm">
                      {profile.firstName ? profile.firstName[0] : (profile.username ? profile.username[0] : 'U')}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Xin chào</p>
                      <p className="text-sm font-black text-gray-850">{profile.firstName || profile.username}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      tokenStore.clearTokens();
                      resetCartState();
                      setProfile(null);
                      setShowMobileMenu(false);
                      window.location.reload();
                    }}
                    className="block w-full py-2.5 text-center bg-red-50 hover:bg-red-100 text-red-650 rounded-full text-xs font-bold transition-colors cursor-pointer"
                    type="button"
                  >
                    Đăng xuất tài khoản
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" onClick={() => setShowMobileMenu(false)} className="block w-full py-2.5 text-center bg-[#222222] text-white rounded-full text-sm font-semibold">
                    Đăng nhập
                  </Link>
                  <Link href="/register" onClick={() => setShowMobileMenu(false)} className="block w-full py-2.5 text-center border border-[#222222] text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-50">
                    Đăng ký tài khoản
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
