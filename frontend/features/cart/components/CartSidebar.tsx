'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/features/cart/store';

export default function CartSidebar() {
  const initializeCart = useCartStore((state) => state.initializeCart);
  const itemCount = useCartStore(state => state.getItemCount());

  useEffect(() => {
    void initializeCart();
  }, [initializeCart]);

  return (
    <Link
      href="/cart"
      className="px-4 py-2 bg-[#F5EFE6] text-[#222222] hover:bg-[#EAE3D2] font-semibold text-xs rounded-full transition-colors relative inline-flex items-center gap-1.5 border border-[#EAE3D2]"
    >
      <ShoppingCart className="w-3.5 h-3.5 text-[#F1641E]" />
      <span>Giỏ hàng</span>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#F1641E] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-[#FDFAF7]">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
