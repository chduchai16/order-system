'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap } from 'lucide-react';

export default function AuthHeader() {
  const pathname = usePathname();

  return (
    <header className="h-16 bg-[#1e2738] text-white border-b border-[#2d374b]">
      <div className="h-full px-6 lg:px-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Zap className="w-5 h-5 text-[#ff6600] fill-current" />
          ShopVN
        </Link>

        <nav className="flex items-center gap-2 text-sm font-bold">
          <Link
            href="/login"
            className={`px-4 py-2 rounded-md transition-colors ${
              pathname === '/login' ? 'text-[#ff6600] bg-white/5' : 'text-gray-300 hover:text-white'
            }`}
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className={`px-4 py-2 rounded-md transition-colors ${
              pathname === '/register' ? 'text-[#ff6600] bg-white/5' : 'text-gray-300 hover:text-white'
            }`}
          >
            Đăng ký
          </Link>
        </nav>
      </div>
    </header>
  );
}
