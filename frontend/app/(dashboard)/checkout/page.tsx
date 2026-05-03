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
      <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Checkout</h1>
        <p className="text-gray-600 mb-6">Your cart is empty</p>
        <Link href="/products" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block">
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
        router.push('/orders');
      }, 1500);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMsg = e.response?.data?.message || e.message || 'Failed to create order';
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
      <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="inline-block mb-4 text-5xl text-green-500">✓</div>
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Order Review</h2>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Shipping Information</h2>
            {keycloakId ? (
              <div className="text-sm text-gray-600">
                <p className="mb-2 font-medium">User ID: <span className="font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200 break-all">{keycloakId}</span></p>
                <p className="text-gray-500">Shipping details will be processed by our team after order confirmation.</p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Loading user information...</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Order Summary</h2>
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 border-t border-gray-200 pt-4 mt-2">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmitOrder}
              disabled={loading}
              className="w-full mt-6 flex justify-center py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>

            <Link
              href="/cart"
              className="w-full mt-3 flex justify-center py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
