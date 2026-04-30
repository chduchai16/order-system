'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { orderService } from '@/lib/api/orderService';
import { Order } from '@/lib/utils/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to load orders';
        setError(errorMsg);
        console.error('Fetch orders error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-8 text-white tracking-tight">My Orders</h1>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="text-gray-400 font-light tracking-wide">Loading orders...</div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm backdrop-blur-sm flex items-start gap-2">
          <span className="mt-0.5">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {!loading && orders.length === 0 && !error && (
        <div className="text-center py-20 bg-[#111111]/80 border border-white/10 rounded-3xl backdrop-blur-xl shadow-lg max-w-2xl mx-auto mt-10">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] text-4xl">
            📦
          </div>
          <p className="text-2xl font-bold mb-4 text-white">No Orders Yet</p>
          <p className="text-gray-400 mb-8 font-light">You haven't placed any orders. Start exploring our catalog!</p>
          <Link 
            href="/dashboard/products" 
            className="inline-flex px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="bg-[#111111]/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs">Order ID</th>
                  <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs">Product ID</th>
                  <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs">Quantity</th>
                  <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs">Total Price</th>
                  <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5 text-gray-400 font-mono text-sm">{order.id}</td>
                    <td className="px-6 py-5 text-gray-300 font-mono text-sm">{order.productId}</td>
                    <td className="px-6 py-5 text-gray-300">{order.quantity}</td>
                    <td className="px-6 py-5 text-white font-bold">${order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                          order.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                            : order.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                            : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}
                      >
                        {order.status === 'COMPLETED' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>}
                        {order.status === 'PENDING' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2 animate-pulse"></span>}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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
