'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { userService } from '@/lib/api/userService';
import { WishlistItem } from '@/lib/utils/types';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // Assume user ID 1 for now
        const items = await userService.getWishlist(1);
        setWishlist(items);
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) return <div className="text-center py-12">Loading wishlist...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
        My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-gray-600 mb-6">Your wishlist is empty</p>
          <Link 
            href="/products" 
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
              <div>
                <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                <p className="text-xs text-gray-500">Added on {new Date(item.addedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Link 
                  href={`/products?search=${encodeURIComponent(item.productName)}`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="View Product"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </Link>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Remove">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
