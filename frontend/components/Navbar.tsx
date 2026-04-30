'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/lib/auth/tokenManager';
import CartSidebar from './CartSidebar';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    tokenManager.clearTokens();
    router.push('/login');
  };

  return (
    <nav className="bg-[#111111]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          href="/dashboard/products" 
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300">
            OS
          </div>
          <span className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors tracking-wide hidden sm:block">
            OrderSystem
          </span>
        </Link>

        <div className="flex gap-2 sm:gap-6 items-center">
          <Link 
            href="/dashboard/products" 
            className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
          >
            Products
          </Link>
          
          <CartSidebar />
          
          <Link 
            href="/dashboard/orders" 
            className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
          >
            My Orders
          </Link>
          
          <div className="w-px h-6 bg-white/10 mx-1 sm:mx-2 hidden sm:block"></div>
          
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 sm:px-5 sm:py-2.5 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-red-500/10 ml-1 sm:ml-2"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  );
}
