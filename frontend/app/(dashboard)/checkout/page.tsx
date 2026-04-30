'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { orderService } from '@/lib/api/orderService';
import { tokenManager } from '@/lib/auth/tokenManager';
import { jwtDecoder } from '@/lib/auth/jwtDecoder';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (items.length === 0 && !success) {
    return (
      <div className="text-center py-20 bg-[#111111]/80 border border-white/10 rounded-3xl backdrop-blur-xl shadow-lg max-w-2xl mx-auto mt-10">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] text-4xl">
          💳
        </div>
        <h1 className="text-3xl font-bold mb-4 text-white">Checkout</h1>
        <p className="text-gray-400 mb-8 font-light">Your cart is empty. Please add items to proceed.</p>
        <Link 
          href="/dashboard/products" 
          className="inline-flex px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async () => {
    setError('');
    setLoading(true);

    try {
      // Create order for each cart item
      for (const item of items) {
        await orderService.createOrder({
          productId: item.productId,
          quantity: item.quantity,
        });
      }

      setSuccess(true);
      clearCart();
      
      setTimeout(() => {
        router.push('/dashboard/orders');
      }, 2500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create order';
      setError(errorMsg);
      console.error('Order creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const accessToken = tokenManager.getAccessToken();
  const keycloakId = accessToken ? jwtDecoder.getKeycloakId(accessToken.replace('Bearer ', '')) : null;

  if (success) {
    return (
      <div className="text-center py-20 bg-[#111111]/80 border border-emerald-500/20 rounded-3xl backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.1)] max-w-2xl mx-auto mt-10 overflow-hidden relative">
        <div className="absolute top-[-20%] left-1/2 transform -translate-x-1/2 w-[80%] h-[80%] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>
        <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full mb-8 border border-emerald-500/30 text-5xl shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
          ✓
        </div>
        <h1 className="text-4xl font-extrabold mb-4 text-white tracking-tight">Order Placed Successfully!</h1>
        <p className="text-gray-400 mb-6 font-light text-lg">Thank you for your purchase. We are processing it right away.</p>
        <div className="mt-8 flex items-center justify-center gap-3 text-gray-500 text-sm">
          <div className="w-4 h-4 border-2 border-emerald-500/50 border-t-emerald-500 rounded-full animate-spin"></div>
          Redirecting to your orders...
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-8 text-white tracking-tight">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111111]/80 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold border border-blue-500/30">1</span>
              Order Review
            </h2>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-gray-100 text-lg">{item.name}</p>
                    <p className="text-sm text-gray-400 font-medium">Qty: <span className="text-gray-300">{item.quantity}</span></p>
                  </div>
                  <p className="font-bold text-white text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111111]/80 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-lg relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold border border-purple-500/30">2</span>
              Shipping Information
            </h2>
            {keycloakId ? (
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="mb-2 font-medium text-gray-300 text-sm">Account ID</p>
                  <p className="font-mono bg-black/50 px-3 py-2 rounded-lg text-gray-400 text-sm border border-white/5 break-all">{keycloakId}</p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-200/80 text-sm">
                  <span className="text-xl leading-none">ℹ️</span>
                  <p>Shipping details will be processed securely by our fulfillment team after order confirmation.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-gray-400 p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="w-4 h-4 border-2 border-gray-500/50 border-t-gray-400 rounded-full animate-spin"></div>
                Loading account information...
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#111111]/80 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-lg sticky top-28">
            <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">Summary</h2>
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div className="flex justify-between text-gray-400 font-light">
                <span>Subtotal</span>
                <span className="text-gray-200">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-light">
                <span>Shipping</span>
                <span className="text-emerald-400 font-medium">Free</span>
              </div>
              <div className="flex justify-between font-extrabold text-xl text-white border-t border-white/10 pt-6 mt-6">
                <span>Total</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm backdrop-blur-sm flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="mt-8 space-y-3">
              <button
                onClick={handleSubmitOrder}
                disabled={loading}
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-400 hover:to-teal-400 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:shadow-none"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  'Confirm & Pay'
                )}
              </button>

              <Link
                href="/dashboard/cart"
                className="w-full flex items-center justify-center px-6 py-4 bg-white/5 text-gray-300 font-medium hover:bg-white/10 hover:text-white rounded-xl border border-white/10 transition-all duration-300"
              >
                Return to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
