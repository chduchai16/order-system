'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';

export default function CartSidebar() {
  const itemCount = useCartStore(state => state.getItemCount());

  return (
    <Link
      href="/dashboard/cart"
      className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium rounded-md transition-colors relative inline-flex items-center gap-2 border border-blue-200"
    >
      <span>Cart</span>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
