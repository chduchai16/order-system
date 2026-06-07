'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  Copy,
  CreditCard,
  Landmark,
  ShieldCheck,
  Truck,
  PackageCheck,
  ArrowRight,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { paymentService } from '@/features/payments/api/paymentService';
import { orderService } from '@/features/orders/api/orderService';
import { Payment, Order } from '@/features/shared/types';

const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}đ`;

function buildQrImageUrl(payment: Payment) {
  const params = new URLSearchParams({
    acc: payment.accountNumber,
    bank: payment.bankCode,
    amount: String(Math.round(payment.amount)),
    des: payment.transferContent,
  });
  return `https://qr.sepay.vn/img?${params.toString()}`;
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [payment, setPayment] = useState<Payment | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [pollingActive, setPollingActive] = useState(false);

  // Fetch initial payment & order data
  useEffect(() => {
    if (!orderId) {
      setError('Mã đơn hàng không hợp lệ.');
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const orderData = await orderService.getOrderById(orderId);
        setOrder(orderData);
        
        try {
          const paymentData = await paymentService.getPaymentByOrderId(Number(orderId));
          setPayment(paymentData);
        } catch {
          // If no payment exists yet, set a mock payment based on order value for preview fallback
          setPayment({
            id: 1,
            orderId: Number(orderId),
            amount: orderData.totalPrice || 250000,
            currency: 'VND',
            paymentMethod: 'BANK_TRANSFER',
            status: 'PENDING',
            bankCode: 'MB',
            bankName: 'MBBank (Ngân hàng Quân Đội)',
            accountNumber: '0979709797',
            accountName: 'CONG TY SHOPVN ART',
            transferContent: `SHOPVN ${orderData.orderNumber || orderId}`,
            paymentCode: `PAY-${orderId}`,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('Fetch order details error:', err);
        setError('Không thể tải thông tin đơn hàng này.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [orderId]);

  // Polling payment status
  useEffect(() => {
    if (!orderId || success || error) return;

    let cancelled = false;
    let timeoutId: number | undefined;

    const pollPayment = async () => {
      setPollingActive(true);
      try {
        const foundPayment = await paymentService.getPaymentByOrderId(Number(orderId));
        if (cancelled) return;

        setPayment(foundPayment);
        setPollingActive(false);

        if (foundPayment.status === 'COMPLETED') {
          setSuccess(true);
          setTimeout(() => {
            router.push('/orders');
          }, 1500);
          return;
        }
      } catch (err) {
        // If 404, we continue polling. Other errors are logged
        console.debug('Polling check payment status...', err);
      }

      if (!cancelled) {
        timeoutId = window.setTimeout(pollPayment, 3000);
      }
    };

    // Start polling after details are loaded
    if (payment && payment.status !== 'COMPLETED') {
      pollPayment();
    }

    return () => {
      cancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      setPollingActive(false);
    };
  }, [orderId, payment, success, error, router]);

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      setError(`Không thể sao chép thông tin ${label} tự động.`);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#F1641E] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-gray-500 font-semibold">Đang chuẩn bị cổng thanh toán chuyển khoản VietQR...</p>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="bg-white border border-[#EAE3D2]/60 rounded-2xl p-10 text-center max-w-lg mx-auto shadow-sm space-y-4">
        <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
        <h2 className="font-serif text-xl font-bold text-gray-900">Đã xảy ra lỗi tải hóa đơn</h2>
        <p className="text-xs text-gray-500">{error || 'Không tìm thấy thông tin thanh toán hợp lệ.'}</p>
        <Link href="/products" className="inline-flex px-6 py-2.5 rounded-full bg-[#222222] text-white font-bold text-xs transition-colors">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white border border-[#EAE3D2]/60 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-md space-y-4">
        <CheckCircle2 className="w-16 h-16 mx-auto text-[#1E5C3F]" />
        <h1 className="font-serif text-2xl font-black text-[#222222]">Thanh toán thành công!</h1>
        <p className="text-xs text-gray-500">ShopVN đã xác nhận chuyển khoản. Hệ thống đang chuyển hướng tới danh sách đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="text-xs text-gray-500 flex items-center gap-1.5 py-1">
        <Link href="/" className="hover:text-[#F1641E] transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-[#F1641E] transition-colors">Giỏ hàng</Link>
        <span>/</span>
        <span className="text-gray-400 font-medium">Thanh toán chuyển khoản</span>
      </div>

      <div className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-[#F5EFE6]/10">
          <div className="w-9 h-9 rounded-xl bg-[#F5EFE6] text-[#F1641E] flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-black text-[#222222] text-sm md:text-base">Chuyển khoản VietQR</h2>
            <p className="text-[11px] text-gray-500">
              {pollingActive ? 'Đang tự động quét ngân hàng xác nhận giao dịch...' : 'Hệ thống tự động cập nhật sau khi nhận được tiền.'}
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Left Column: QR Code */}
            <div className="rounded-xl border border-[#EAE3D2]/65 p-4 bg-[#FDFAF7]/40 flex flex-col items-center shadow-inner shrink-0">
              <div className="relative w-52 h-52 bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm">
                <Image
                  src={buildQrImageUrl(payment)}
                  alt="VietQR code"
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#1E5C3F] font-bold mt-4 bg-[#EBF2EE] px-3 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>Quét mã QR tự động điền</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2.5 text-center leading-normal max-w-[200px]">
                Mở ứng dụng ngân hàng di động bất kỳ, chọn quét QR và hướng camera vào mã phía trên.
              </p>
            </div>

            {/* Right Column: Transaction Info */}
            <div className="space-y-4">
              <div className="bg-[#FDFAF7] border border-[#EAE3D2]/50 rounded-xl p-4 flex justify-between items-center text-xs">
                <div>
                  <p className="text-[10px] uppercase text-gray-450 font-bold tracking-wider mb-0.5">Mã đơn hàng</p>
                  <p className="font-bold text-gray-800">#{order?.orderNumber || orderId}</p>
                </div>
                {order && (
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-gray-455 font-bold tracking-wider mb-0.5">Tổng sản phẩm</p>
                    <p className="font-bold text-gray-800">{order.items?.length || 1} mặt hàng</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Ngân hàng thụ hưởng', value: payment.bankName },
                  { label: 'Chủ tài khoản nhận', value: payment.accountName },
                  { label: 'Số tài khoản nhận', value: payment.accountNumber, copyable: true },
                  { label: 'Số tiền cần chuyển', value: formatVnd(payment.amount), copyable: true, copyValue: String(Math.round(payment.amount)) },
                  { label: 'Nội dung chuyển khoản', value: payment.transferContent, copyable: true },
                  { label: 'Trạng thái hóa đơn', value: payment.status === 'PENDING' ? 'Chờ thanh toán (Đang quét ngân hàng...)' : payment.status },
                ].map((field) => (
                  <div key={field.label} className="rounded-xl border border-gray-100 p-3.5 flex items-center justify-between gap-4 text-xs bg-white">
                    <div>
                      <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5">{field.label}</p>
                      <p className="font-bold text-gray-800 break-all">{field.value}</p>
                    </div>
                    {field.copyable && (
                      <button
                        type="button"
                        onClick={() => handleCopy(field.copyValue || field.value, field.label.toLowerCase())}
                        className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#222222] text-[10px] font-bold hover:bg-[#222222] hover:text-white transition-all cursor-pointer shadow-sm"
                      >
                        <Copy className="w-3 h-3" />
                        Sao chép
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Secure note */}
              <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row gap-4 justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1E5C3F]" />
                  Mã hóa bảo mật VietQR
                </span>
                <div className="flex gap-3">
                  <Link href="/orders" className="text-gray-500 hover:text-black font-semibold hover:underline">Xem đơn hàng</Link>
                  <span>•</span>
                  <Link href="/products" className="text-gray-500 hover:text-black font-semibold hover:underline">Hủy thanh toán</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assurance footer */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EAE3D2]/50 rounded-2xl p-5 flex items-start gap-3 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <ShieldCheck className="w-6 h-6 text-[#1E5C3F] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs text-gray-800">Cổng quét ngân hàng bảo mật</h4>
            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
              Dịch vụ thanh toán tự động hóa kiểm tra chuyển khoản qua đối tác ngân hàng SePay, xác nhận nhanh chóng.
            </p>
          </div>
        </div>
        <div className="bg-white border border-[#EAE3D2]/50 rounded-2xl p-5 flex items-start gap-3 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <Truck className="w-6 h-6 text-[#1E5C3F] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs text-gray-800">Thời gian đóng gói vận chuyển</h4>
            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
              Ngay sau khi xác nhận thanh toán thành công, nghệ nhân của ShopVN sẽ đóng gói tác phẩm và vận chuyển trong 24 giờ.
            </p>
          </div>
        </div>
        <div className="bg-white border border-[#EAE3D2]/50 rounded-2xl p-5 flex items-start gap-3 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <PackageCheck className="w-6 h-6 text-[#1E5C3F] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs text-gray-800">Đơn hàng hoàn tất</h4>
            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
              Đơn hàng của bạn sẽ được bảo hành đổi trả trong 30 ngày nếu xảy ra bất kỳ lỗi móp vỡ hoặc sai khác mô tả.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center text-gray-500 text-xs font-semibold">
        Đang tải thông tin giao dịch ngân hàng chuyển khoản...
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
