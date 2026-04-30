'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';

export default function CartSidebar() {
  const itemCount = useCartStore(state => state.getItemCount());

  return (
    <Link
      href="/dashboard/cart"
      className="px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all duration-300 relative inline-flex items-center gap-2 border border-white/10 backdrop-blur-md shadow-sm"
    >
      <span className="text-lg leading-none">🛒</span>
      <span className="hidden sm:inline tracking-wide">Cart</span>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-pulse border border-blue-400/50">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
