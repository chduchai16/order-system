'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowRight, CheckCircle2, CreditCard, PackageCheck, ShoppingBag } from 'lucide-react';

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('vnp_ResponseCode');
  const isSuccess = status === '00';

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        <Link href="/" className="hover:text-[#ff6600]">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-[#ff6600] font-semibold">Kết quả thanh toán</span>
      </div>

      <section className={`rounded-lg border overflow-hidden ${isSuccess ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
        <div className="p-8 lg:p-10 text-center bg-white">
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-5 ${isSuccess ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {isSuccess ? <CheckCircle2 className="w-11 h-11" /> : <AlertCircle className="w-11 h-11" />}
          </div>

          <h1 className="text-3xl font-black text-gray-950 mb-3">
            {isSuccess ? 'Thanh toán thành công' : 'Thanh toán chưa hoàn tất'}
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            {isSuccess
              ? 'Đơn hàng của bạn đã được ghi nhận. ShopVN sẽ chuẩn bị hàng và giao đến địa chỉ đã chọn.'
              : `Không thể xử lý thanh toán. Mã phản hồi: ${status || 'không xác định'}. Bạn có thể thử lại hoặc chọn phương thức khác.`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mt-8">
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <CreditCard className="w-6 h-6 text-[#ff6600] mx-auto mb-2" />
              <div className="font-bold text-gray-950">Thanh toán</div>
              <div className="text-sm text-gray-600">{isSuccess ? 'Đã xác nhận' : 'Cần thử lại'}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <PackageCheck className="w-6 h-6 text-[#ff6600] mx-auto mb-2" />
              <div className="font-bold text-gray-950">Đơn hàng</div>
              <div className="text-sm text-gray-600">{isSuccess ? 'Đang xử lý' : 'Chưa hoàn tất'}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <ShoppingBag className="w-6 h-6 text-[#ff6600] mx-auto mb-2" />
              <div className="font-bold text-gray-950">ShopVN</div>
              <div className="text-sm text-gray-600">Hỗ trợ 24/7</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href="/orders" className="h-11 px-6 rounded-md bg-[#ff6600] text-white font-bold flex items-center justify-center gap-2 hover:bg-orange-600">
              Xem đơn hàng
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/products" className="h-11 px-6 rounded-md border border-gray-300 text-gray-900 font-bold flex items-center justify-center hover:border-[#ff6600] hover:text-[#ff6600]">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<div className="bg-white border border-gray-200 rounded-lg py-16 text-center text-gray-500">Đang tải kết quả thanh toán...</div>}>
      <PaymentResultContent />
    </Suspense>
  );
}
