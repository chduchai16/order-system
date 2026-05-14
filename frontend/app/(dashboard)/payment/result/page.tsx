'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('vnp_ResponseCode');
  const isSuccess = status === '00';

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
      {isSuccess ? (
        <>
          <div className="inline-block mb-4 text-5xl text-green-500">✓</div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Payment Successful</h1>
          <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
        </>
      ) : (
        <>
          <div className="inline-block mb-4 text-5xl text-red-500">✕</div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Payment Failed</h1>
          <p className="text-gray-600 mb-6">There was an error processing your payment. Code: {status}</p>
        </>
      )}

      <div className="space-y-3">
        <Link
          href="/orders"
          className="block w-full py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          View My Orders
        </Link>
        <Link
          href="/products"
          className="block w-full py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading payment result...</div>}>
      <PaymentResultContent />
    </Suspense>
  );
}
