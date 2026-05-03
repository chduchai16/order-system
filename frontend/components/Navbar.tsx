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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          href="/products" 
          className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
        >
          OrderSystem
        </Link>

        <div className="flex gap-4 items-center">
          <Link 
            href="/products" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Products
          </Link>
          
          <CartSidebar />
          
          <Link 
            href="/orders" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            My Orders
          </Link>
          
          <div className="w-px h-6 bg-gray-300 mx-2 hidden sm:block"></div>
          
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium border border-gray-300"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  );
}
