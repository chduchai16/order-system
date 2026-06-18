'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  User, 
  Bell, 
  ExternalLink 
} from 'lucide-react';
import { sellerService, ShopSettings } from '../api/sellerService';

interface SellerLayoutProps {
  children: React.ReactNode;
}

export default function SellerLayout({ children }: SellerLayoutProps) {
  const pathname = usePathname();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [settings, setSettings] = useState<ShopSettings | null>(null);

  useEffect(() => {
    setSettings(sellerService.getShopSettings());
    
    // Add event listener to capture setting updates
    const handleSettingsUpdate = () => {
      setSettings(sellerService.getShopSettings());
    };
    window.addEventListener('shop_settings_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('shop_settings_updated', handleSettingsUpdate);
    };
  }, []);

  const navItems = [
    { name: 'Tổng quan', path: '/business', icon: LayoutDashboard },
    { name: 'Quản lý sản phẩm', path: '/business/products', icon: ShoppingBag },
    { name: 'Đơn hàng cửa hàng', path: '/business/orders', icon: Receipt },
    { name: 'Mã giảm giá', path: '/business/vouchers', icon: Ticket },
    { name: 'Cài đặt cửa hàng', path: '/business/settings', icon: Settings },
  ];

  const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}đ`;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#FDFAF7] border-r border-[#EAE3D2]/70 py-6 px-4">
      {/* Brand logo */}
      <div className="px-3 pb-6 border-b border-[#EAE3D2]/50 flex items-center justify-between">
        <Link href="/business" className="flex items-center space-x-2">
          <span className="font-serif text-2xl font-black text-[#F1641E] tracking-tight">ShopVN</span>
          <span className="bg-[#1E5C3F] text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">Kênh Người Bán</span>
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
        <div className="my-6 px-3 py-4 bg-[#F5EFE6]/35 border border-[#EAE3D2]/50 rounded-2xl flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#EAE3D2] shrink-0 bg-[#FDFAF7]">
            <img 
              src={settings.avatarUrl} 
              alt={settings.shopName} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="min-w-0 flex-grow">
            <h4 className="font-serif font-black text-xs text-gray-800 truncate leading-snug">{settings.shopName}</h4>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mt-0.5">Nghệ nhân</span>
          </div>
        </div>
      )}

      {/* Navigation links */}
      <nav className="flex-1 space-y-1.5 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setShowMobileSidebar(false)}
              className={`flex items-center gap-3 px-4.5 py-3.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#1E5C3F] text-white shadow-md shadow-[#1E5C3F]/10'
                  : 'text-gray-650 hover:bg-[#F5EFE6]/35 hover:text-black border border-transparent'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Back to buyer view */}
      <div className="border-t border-[#EAE3D2]/50 pt-5 px-1 mt-auto">
        <Link
          href="/"
          className="flex items-center justify-between px-4 py-3 border border-[#222222] hover:bg-[#222222] hover:text-white rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
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
              {navItems.find((item) => item.path === pathname)?.name || 'Kênh Người Bán'}
            </h1>
          </div>

          {/* Quick Header Stats */}
          {settings && (
            <div className="flex items-center space-x-3 md:space-x-6">
              {/* Wallet Stats */}
              <div className="flex items-center gap-2 bg-[#EBF2EE] border border-[#1E5C3F]/15 px-3 py-1.5 rounded-full">
                <Wallet className="w-4 h-4 text-[#1E5C3F]" />
                <div className="text-left leading-none">
                  <span className="text-[8.5px] font-bold text-gray-400 uppercase tracking-wide">Số dư ví</span>
                  <p className="text-[11.5px] font-extrabold text-[#1E5C3F] mt-0.5">{formatVnd(settings.walletBalance)}</p>
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
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={settings.avatarUrl} alt={settings.shopName} className="w-full h-full object-cover" />
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
