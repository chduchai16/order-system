'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Receipt, 
  Ticket, 
  Settings, 
  ArrowLeftRight, 
  Menu, 
  X, 
  Wallet, 
  Bell, 
  ExternalLink 
} from 'lucide-react';
import { sellerSettingsService } from '@/features/seller/api/settings';
import { ShopSettings } from '@/features/seller/types';

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [settings, setSettings] = useState<ShopSettings | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(sellerSettingsService.getShopSettings());
    
    // Add event listener to capture setting updates
    const handleSettingsUpdate = () => {
      setSettings(sellerSettingsService.getShopSettings());
    };
    window.addEventListener('shop_settings_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('shop_settings_updated', handleSettingsUpdate);
    };
  }, []);

  const navItems = [
    { name: 'Tổng quan', path: '/seller', icon: LayoutDashboard },
    { name: 'Quản lý sản phẩm', path: '/seller/products', icon: ShoppingBag },
    { name: 'Đơn hàng cửa hàng', path: '/seller/orders', icon: Receipt },
    { name: 'Mã giảm giá', path: '/seller/vouchers', icon: Ticket },
    { name: 'Cài đặt cửa hàng', path: '/seller/settings', icon: Settings },
  ];

  const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}đ`;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#1E1A17] border-r border-[#3A332E] py-6 px-4">
      {/* Brand logo */}
      <div className="px-3 pb-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/seller" className="flex items-center space-x-2">
          <span className="font-serif text-2xl font-black text-[#F1641E] tracking-tight">ShopVN</span>
          <span className="bg-[#F1641E] text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">Kênh Người Bán</span>
        </Link>
        <button 
          onClick={() => setShowMobileSidebar(false)}
          className="p-1.5 text-gray-400 hover:text-black md:hidden rounded-full border border-gray-150 hover:bg-gray-100"
          type="button"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Seller Mini Profile */}
      {settings && (
        <div className="my-6 px-3 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0 bg-white/5">
            <Image 
              src={settings.avatarUrl} 
              alt={settings.shopName} 
              fill 
              className="object-cover" 
            />
          </div>
          <div className="min-w-0 flex-grow">
            <h4 className="font-serif font-black text-xs text-white truncate leading-snug">{settings.shopName}</h4>
            <span className="text-[10px] text-[#A8988C] font-semibold uppercase tracking-wider block mt-0.5">Nghệ nhân</span>
          </div>
        </div>
      )}

      {/* Navigation links */}
      <nav className="flex-1 space-y-1.5 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path === '/seller' && pathname === '/seller/dashboard');
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setShowMobileSidebar(false)}
              className={`flex items-center gap-3 px-4.5 py-3.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#F1641E] text-white shadow-md shadow-[#F1641E]/20'
                  : 'text-[#C2B4AA] hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-[#8A7E75]'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Back to buyer view */}
      <div className="border-t border-white/10 pt-5 px-1 mt-auto">
        <Link
          href="/"
          className="flex items-center justify-between px-4 py-3 border border-white/20 text-[#C2B4AA] hover:bg-white hover:text-black rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-gray-500 hover:text-white" />
            <span>Về trang mua sắm</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFAF7]/40 flex font-sans antialiased text-[#222222]">
      {/* Desktop sidebar */}
      <aside className="w-68 hidden md:block shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile drawer backdrop */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fade-in"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Mobile drawer container */}
      <aside 
        className={`fixed inset-y-0 left-0 w-68 z-50 bg-[#FDFAF7] shadow-2xl md:hidden transform transition-transform duration-300 ${
          showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Main dashboard content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-[#EAE3D2]/60 bg-[#FDFAF7]/85 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="p-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-700 md:hidden cursor-pointer"
              type="button"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-serif font-black text-sm md:text-base text-gray-900 capitalize hidden sm:block">
              {navItems.find((item) => item.path === pathname || (item.path === '/seller' && pathname === '/seller/dashboard'))?.name || 'Kênh Người Bán'}
            </h1>
          </div>

          {/* Quick Header Stats */}
          {settings && (
            <div className="flex items-center space-x-3 md:space-x-6">
              {/* Wallet Stats */}
              <div className="flex items-center gap-2 bg-[#FFF2EB] border border-[#F1641E]/15 px-3 py-1.5 rounded-full">
                <Wallet className="w-4 h-4 text-[#F1641E]" />
                <div className="text-left leading-none">
                  <span className="text-[8.5px] font-bold text-gray-400 uppercase tracking-wide">Số dư ví</span>
                  <p className="text-[11.5px] font-extrabold text-[#F1641E] mt-0.5">{formatVnd(settings.walletBalance)}</p>
                </div>
              </div>

              {/* Notification icon */}
              <button 
                type="button" 
                className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-black hover:border-black cursor-pointer shadow-sm relative"
                aria-label="Thông báo"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F1641E]"></span>
              </button>

              <span className="text-gray-300 hidden sm:inline">|</span>

              {/* Shop Badge */}
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-50">
                  <Image src={settings.avatarUrl} alt={settings.shopName} fill className="object-cover" />
                </div>
                <span className="text-xs font-bold text-gray-700 hidden lg:inline max-w-[120px] truncate">{settings.shopName}</span>
              </div>
            </div>
          )}
        </header>

        {/* Dynamic page contents wrapper */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
