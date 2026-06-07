'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AuthHeader() {
  const pathname = usePathname();

  return (
    <header className="h-16 bg-[#FDFAF7] text-[#222222] border-b border-[#EAE3D2]/60 font-sans">
      <div className="h-full px-6 lg:px-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 font-serif font-black text-2xl text-[#F1641E] tracking-tight hover:opacity-90 transition-opacity">
          ShopVN
        </Link>

        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <Link
            href="/login"
            className={`px-4.5 py-2 rounded-full transition-all duration-200 cursor-pointer ${
              pathname === '/login' 
                ? 'text-[#F1641E] bg-[#F5EFE6]' 
                : 'text-gray-650 hover:text-black hover:bg-gray-150/40'
            }`}
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className={`px-4.5 py-2 rounded-full transition-all duration-200 cursor-pointer ${
              pathname === '/register' 
                ? 'text-[#F1641E] bg-[#F5EFE6]' 
                : 'text-gray-650 hover:text-black hover:bg-gray-150/40'
            }`}
          >
            Đăng ký
          </Link>
        </nav>
      </div>
    </header>
  );
}
