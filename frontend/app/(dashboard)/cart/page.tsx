'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  CreditCard,
  Heart,
  Lock,
  Minus,
  PackageCheck,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Trash2,
  Truck,
  Gift,
} from 'lucide-react';
import { useCartStore } from '@/features/cart/store/cartStore';
import { CartItem } from '@/features/shared/types';

const shippingOptions = [
  {
    id: 'fast',
    name: 'Giao hàng nhanh tin cậy',
    description: 'Nhận hàng trong 2-3 ngày làm việc',
    fee: 0,
  },
  {
    id: 'express',
    name: 'Giao hàng hỏa tốc',
    description: 'Nhận hàng trong 2-4 giờ (nội thành)',
    fee: 25000,
  },
  {
    id: 'standard',
    name: 'Giao hàng tiêu chuẩn',
    description: 'Nhận hàng trong 5-7 ngày làm việc',
    fee: 0,
  },
];

const paymentMethods = ['Visa/MC', 'MoMo', 'ZaloPay', 'COD'];

const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}đ`;

function ProductIcon() {
  return (
    <div className="w-16 h-16 rounded-xl bg-[#F5EFE6]/70 flex items-center justify-center shrink-0 border border-[#EAE3D2]/40">
      <Gift className="w-7 h-7 text-[#F1641E] opacity-75" />
    </div>
  );
}

function QuantityControl({
  item,
  updateQuantity,
}: {
  item: CartItem;
  updateQuantity: (productId: string, quantity: number) => void;
}) {
  return (
    <div className="inline-flex items-center h-9 border border-gray-200 rounded-full bg-white overflow-hidden px-1 bg-white">
      <button
        type="button"
        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
        className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black cursor-pointer"
        aria-label="Giảm số lượng"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
      <button
        type="button"
        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
        className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black cursor-pointer"
        aria-label="Tăng số lượng"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function CartPage() {
  const { items, savedItems, removeFromCart, updateQuantity, getTotalPrice, clearCart, saveForLater, moveToCart } = useCartStore();
  const [couponCode, setCouponCode] = useState('SALE30');
  const [appliedCoupon, setAppliedCoupon] = useState('SALE30');
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0].id);

  const subtotal = getTotalPrice();
  const selectedShippingOption = shippingOptions.find((option) => option.id === selectedShipping) ?? shippingOptions[0];
  const productDiscount = items.length > 0 ? Math.round(subtotal * 0.225) : 0;
  const couponDiscount = appliedCoupon.trim().toUpperCase() === 'SALE30' && items.length > 0 ? 30000 : 0;
  const total = Math.max(0, subtotal - productDiscount - couponDiscount + selectedShippingOption.fee);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  // Free shipping progress variables (threshold 300k)
  const freeShippingThreshold = 300000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const applyCoupon = () => {
    setAppliedCoupon(couponCode.trim().toUpperCase());
  };

  if (items.length === 0 && (!savedItems || savedItems.length === 0)) {
    return (
      <div className="bg-white border border-[#EAE3D2]/60 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm">
        <ShoppingCart className="w-14 h-14 mx-auto text-[#F1641E] mb-4" />
        <h1 className="font-serif text-2xl font-black mb-2 text-[#222222]">Giỏ hàng của bạn đang trống</h1>
        <p className="text-xs text-gray-500 mb-6">Hãy thêm những món quà thủ công hoặc sản phẩm dệt may độc đáo để bắt đầu mua sắm.</p>
        <Link href="/products" className="inline-flex px-6 py-3 rounded-full bg-[#F1641E] hover:bg-[#d85213] text-white font-bold text-xs transition-colors">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="text-xs text-gray-500 flex items-center gap-1.5 py-1">
        <Link href="/" className="hover:text-[#F1641E] transition-colors">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-400 font-medium">Giỏ hàng</span>
      </div>

      {/* Process Stepper */}
      <div className="bg-white border border-[#EAE3D2]/50 rounded-2xl py-4 px-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
        <div className="flex flex-wrap justify-between items-center max-w-3xl mx-auto gap-4">
          {['Giỏ hàng', 'Thanh toán', 'Giao hàng', 'Hoàn tất'].map((step, index) => (
            <div key={step} className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                index === 0
                  ? 'bg-[#F1641E] border-[#F1641E] text-white'
                  : 'bg-white border-gray-300 text-gray-500'
              }`}>
                {index === 0 ? <Check className="w-3.5 h-3.5" /> : index + 1}
              </div>
              <span className={`text-xs font-bold ${index === 0 ? 'text-[#F1641E]' : 'text-gray-500'}`}>{step}</span>
              {index < 3 && <div className="hidden sm:block w-12 h-px bg-gray-200" />}
            </div>
          ))}
        </div>
      </div>

      {/* Free Shipping Alert Threshold Box */}
      {items.length > 0 && (
        <div className="bg-[#EBF2EE] border border-[#D0E2D7] rounded-2xl p-4 space-y-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E5C3F]">
            <Truck className="w-4.5 h-4.5" />
            {isFreeShipping ? (
              <span>Đơn hàng của bạn đã đủ điều kiện được miễn phí vận chuyển tiêu chuẩn!</span>
            ) : (
              <span>Mua thêm {formatVnd(freeShippingThreshold - subtotal)} để nhận miễn phí vận chuyển tiêu chuẩn!</span>
            )}
          </div>
          <div className="w-full bg-[#D4E4DB] rounded-full h-2 overflow-hidden">
            <div className="bg-[#1E5C3F] h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-6">
          {/* Main items panel */}
          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#F5EFE6]/10">
              <h2 className="font-serif font-black text-[#222222] text-base">Tác phẩm bạn đặt mua</h2>
              <span className="text-xs text-gray-500 font-semibold">{items.length} mặt hàng</span>
            </div>

            {items.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {items.map((item, index) => {
                  const price = item.unitPrice || 0;
                  const originalPrice = Math.round(price * 1.55);

                  return (
                    <article key={item.productId} className="p-5 flex gap-4">
                      <ProductIcon />
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex justify-between gap-4">
                          <div className="min-w-0 space-y-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.sku || 'ShopVN Tuyển chọn'}</span>
                            <h3 className="font-bold text-[#222222] text-xs md:text-sm leading-tight line-clamp-2 hover:text-[#F1641E] transition-colors">
                              <Link href={`/products/${item.productId}`}>{item.productName}</Link>
                            </h3>
                            <p className="text-[11px] text-gray-500">Màu sắc: Tự nhiên • Phiên bản chế tác: Tiêu chuẩn</p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-bold text-[#F1641E] text-sm md:text-base">{formatVnd(price)}</div>
                            <div className="text-[10px] text-gray-400 line-through">{formatVnd(originalPrice)}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <QuantityControl item={item} updateQuantity={updateQuantity} />
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={() => saveForLater(item.productId)} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#F1641E] transition-colors font-semibold">
                              <Heart className="w-3.5 h-3.5" />
                              Lưu mua sau
                            </button>
                            <button type="button" onClick={() => removeFromCart(item.productId)} className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors font-semibold">
                              <Trash2 className="w-3.5 h-3.5" />
                              Xóa bỏ
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 text-xs font-semibold">Chưa có sản phẩm nào trong giỏ.</div>
            )}

            {appliedCoupon === 'SALE30' && items.length > 0 && (
              <div className="px-5 py-3.5 bg-[#EBF2EE] border-t border-green-100 text-xs font-bold text-[#1E5C3F] flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Mã giảm giá SALE30 đã kích hoạt thành công — Giảm ngay {formatVnd(couponDiscount)}!
              </div>
            )}

            {/* Coupon Code Form */}
            <div className="p-5 border-t border-gray-100 bg-[#FDFAF7]/50 flex gap-3">
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="Nhập mã ưu đãi hoặc Voucher..."
                className="flex-1 h-10 px-4 border border-gray-300 rounded-full outline-none focus:border-[#F1641E] text-xs bg-white focus:ring-1 focus:ring-[#F1641E]/30"
              />
              <button type="button" onClick={applyCoupon} className="px-5 h-10 rounded-full border border-[#222222] text-[#222222] text-xs font-bold hover:bg-[#222222] hover:text-white transition-all cursor-pointer">
                Áp dụng
              </button>
            </div>
          </section>

          {/* Shipping choices */}
          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden shadow-sm">
            <h3 className="font-serif font-black text-[#222222] px-5 py-4 border-b border-gray-100 bg-[#F5EFE6]/10 text-base">Phương thức vận chuyển</h3>
            <div className="p-5 space-y-1">
              {shippingOptions.map((option) => (
                <label key={option.id} className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={selectedShipping === option.id}
                      onChange={() => setSelectedShipping(option.id)}
                      className="mt-1 accent-[#F1641E]"
                    />
                    <span>
                      <span className="block font-bold text-xs md:text-sm text-gray-800 group-hover:text-black">{option.name}</span>
                      <span className="block text-[11px] text-gray-500 mt-0.5">{option.description}</span>
                    </span>
                  </div>
                  <span className="font-bold text-xs text-[#F1641E] shrink-0">
                    {option.fee === 0 ? 'Miễn phí' : formatVnd(option.fee)}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Saved Items for later */}
          {savedItems && savedItems.length > 0 && (
            <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden shadow-sm">
              <h3 className="font-serif font-black text-[#222222] px-5 py-4 border-b border-gray-100 bg-[#F5EFE6]/10 text-base">Đã lưu để mua sau</h3>
              <div className="divide-y divide-gray-100">
                {savedItems.map((item) => (
                  <div key={item.productId} className="p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-bold text-xs md:text-sm text-gray-800 truncate">{item.productName}</p>
                      <p className="text-xs text-gray-500 font-semibold mt-0.5">{formatVnd(item.unitPrice || 0)}</p>
                    </div>
                    <div className="flex gap-4 shrink-0">
                      <button type="button" onClick={() => moveToCart(item.productId)} className="text-xs font-bold text-[#F1641E] hover:underline cursor-pointer">
                        Chuyển vào giỏ
                      </button>
                      <button type="button" onClick={() => removeFromCart(item.productId)} className="text-xs font-bold text-red-500 hover:underline cursor-pointer">
                        Xóa bỏ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Summary billing */}
        <aside className="space-y-4">
          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden sticky top-24 shadow-sm">
            <h3 className="font-serif font-black text-[#222222] px-5 py-4 border-b border-gray-100 bg-[#F5EFE6]/10 text-base">Tóm tắt đơn hàng</h3>
            <div className="p-5 space-y-4 text-xs font-semibold text-gray-600">
              <div className="flex justify-between">
                <span>Tạm tính ({itemCount} sản phẩm)</span>
                <span className="font-bold text-gray-800">{formatVnd(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ưu đãi thành viên ShopVN</span>
                <span className="text-[#1E5C3F] font-bold">-{formatVnd(productDiscount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Mã giảm giá {appliedCoupon}</span>
                <span className="text-[#1E5C3F] font-bold">-{formatVnd(couponDiscount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển dự kiến</span>
                <span className="text-[#1E5C3F] font-bold">
                  {selectedShippingOption.fee === 0 ? 'Miễn phí' : formatVnd(selectedShippingOption.fee)}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-start">
                <span className="font-bold text-[#222222] text-sm">Tổng cộng</span>
                <div className="text-right">
                  <span className="block text-2xl font-serif font-black text-[#F1641E]">{formatVnd(total)}</span>
                  <span className="text-[10px] text-[#1E5C3F] font-bold block mt-1">Tiết kiệm được: {formatVnd(productDiscount + couponDiscount)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className={`mt-4 h-12 rounded-full bg-[#F1641E] hover:bg-[#d85213] text-white flex items-center justify-center gap-2 font-bold text-xs cursor-pointer shadow-sm transition-all duration-200 ${
                  items.length === 0 ? 'pointer-events-none opacity-50 bg-gray-300 border-gray-200' : ''
                }`}
              >
                <Lock className="w-4 h-4" />
                Tiến hành thanh toán bảo mật
              </Link>

              {/* Payment methods mock */}
              <div className="space-y-1.5 pt-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center mb-2">Chấp nhận thanh toán</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {paymentMethods.map((method) => (
                    <div key={method} className="h-6.5 rounded border border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-500 flex items-center justify-center gap-0.5">
                      <CreditCard className="w-2.5 h-2.5" />
                      {method}
                    </div>
                  ))}
                </div>
              </div>

              <button type="button" onClick={clearCart} className="w-full text-[10.5px] text-gray-400 hover:text-red-500 text-center transition-colors pt-2 cursor-pointer">
                Xóa toàn bộ giỏ hàng
              </button>
            </div>
          </section>

          {/* Guarantees Box */}
          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#1E5C3F] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-800 text-xs">Bảo mật giao dịch tuyệt đối</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">Thông tin tài khoản ngân hàng của bạn được mã hóa an toàn 256-bit.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-gray-100 pt-3">
              <RefreshCw className="w-5 h-5 text-[#1E5C3F] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-800 text-xs">Quy trình đổi trả thuận tiện</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">ShopVN cam kết hoàn trả đầy đủ tiền hàng trong 30 ngày nếu không đúng mô tả.</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
