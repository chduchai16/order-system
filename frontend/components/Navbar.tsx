'use client';

import Link from 'next/link';
import CartSidebar from './CartSidebar';

export default function Navbar() {
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
            Orders
          </Link>

          <Link 
            href="/wishlist" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Wishlist
          </Link>

          <Link 
            href="/addresses" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Addresses
          </Link>
          
        </div>
      </div>
    </nav>
  );
}
