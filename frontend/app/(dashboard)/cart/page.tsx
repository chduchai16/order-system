'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';

export default function CartPage() {
  const { items, savedItems, removeFromCart, updateQuantity, getTotalPrice, clearCart, saveForLater, moveToCart } = useCartStore();

  if (items.length === 0 && (!savedItems || savedItems.length === 0)) {
    return (
      <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mb-6">Your cart is empty</p>
        <Link 
          href="/products" 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-gray-900">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map(item => (
                      <tr key={item.productId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${(item.unitPrice || 0).toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <input
                            type="number"
                            min="1"
                            max="999"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.productId, parseInt(e.target.value) || 1)
                            }
                            className="w-16 px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-900"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                          ${((item.unitPrice || 0) * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                          <button
                            onClick={() => saveForLater(item.productId)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Save for later
                          </button>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                Cart items list is empty.
              </div>
            )}
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
              
              <Link
                href="/checkout"
                className="w-full mt-6 flex justify-center py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                style={{ pointerEvents: items.length === 0 ? 'none' : 'auto', opacity: items.length === 0 ? 0.5 : 1 }}
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={() => clearCart()}
                className="w-full mt-3 flex justify-center py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Saved for Later Section */}
      {savedItems && savedItems.length > 0 && (
        <div className="pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Saved for Later ({savedItems.length})
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                {savedItems.map(item => (
                  <tr key={item.productId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${(item.unitPrice || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3 text-right">
                      <button
                        onClick={() => moveToCart(item.productId)}
                        className="px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 font-medium transition-colors"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
