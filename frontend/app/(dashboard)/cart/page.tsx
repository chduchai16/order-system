'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-[#111111]/80 border border-white/10 rounded-3xl backdrop-blur-xl shadow-lg max-w-2xl mx-auto mt-10">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] text-4xl">
          🛒
        </div>
        <h1 className="text-3xl font-bold mb-4 text-white">Your Cart is Empty</h1>
        <p className="text-gray-400 mb-8 font-light">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          href="/dashboard/products" 
          className="inline-flex px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-8 text-white tracking-tight">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-[#111111]/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs">Product</th>
                    <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs">Price</th>
                    <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs">Quantity</th>
                    <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs">Total</th>
                    <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map(item => (
                    <tr key={item.productId} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5 text-gray-100 font-medium">{item.name}</td>
                      <td className="px-6 py-5 text-gray-400">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-5">
                        <input
                          type="number"
                          min="1"
                          max="999"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.productId, parseInt(e.target.value) || 1)
                          }
                          className="w-20 px-3 py-2 rounded-lg border border-white/10 bg-black/50 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-center"
                        />
                      </td>
                      <td className="px-6 py-5 font-bold text-gray-100">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-5">
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 transition-all duration-300"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#111111]/80 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-lg sticky top-28">
            <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">Order Summary</h2>
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div className="flex justify-between text-gray-400 font-light">
                <span>Subtotal</span>
                <span className="text-gray-200">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-light">
                <span>Shipping</span>
                <span className="text-gray-200">Calculated next</span>
              </div>
              <div className="flex justify-between font-extrabold text-xl text-white border-t border-white/10 pt-6 mt-6">
                <span>Total</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <Link
                href="/dashboard/checkout"
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={() => clearCart()}
                className="w-full px-6 py-4 bg-white/5 text-gray-300 font-medium hover:bg-white/10 hover:text-white rounded-xl border border-white/10 transition-all duration-300"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
