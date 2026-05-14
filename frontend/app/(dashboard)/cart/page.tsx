'use client';

import { useMemo, useState } from 'react';
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
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { CartItem } from '@/lib/utils/types';

const shippingOptions = [
  {
    id: 'fast',
    name: 'Giao hàng nhanh',
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
const placeholderColors = ['bg-[#dff1ff] text-blue-500', 'bg-pink-100 text-purple-500', 'bg-green-100 text-green-600'];

const toDisplayPrice = (price: number) => (price >= 10000 ? price : price * 25000);
const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}đ`;

function ProductIcon({ index }: { index: number }) {
  return (
    <div className={`w-16 h-16 rounded-md flex items-center justify-center shrink-0 ${placeholderColors[index % placeholderColors.length]}`}>
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1c-1.657 0-3-1.343-3-3v-2c0-1.657 1.343-3 3-3h3v8z" />
        <path d="M3 19a2 2 0 0 0 2 2h1c1.657 0 3-1.343 3-3v-2c0-1.657-1.343-3-3-3H3v8z" />
      </svg>
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
    <div className="inline-flex items-center h-8 border border-gray-300 rounded-md bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#ff6600]"
        aria-label="Giảm số lượng"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-9 text-center text-sm border-x border-gray-200">{item.quantity}</span>
      <button
        type="button"
        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#ff6600]"
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

  const subtotal = useMemo(() => toDisplayPrice(getTotalPrice()), [getTotalPrice, items]);
  const selectedShippingOption = shippingOptions.find((option) => option.id === selectedShipping) ?? shippingOptions[0];
  const productDiscount = items.length > 0 ? Math.round(subtotal * 0.225) : 0;
  const couponDiscount = appliedCoupon.trim().toUpperCase() === 'SALE30' && items.length > 0 ? 30000 : 0;
  const total = Math.max(0, subtotal - productDiscount - couponDiscount + selectedShippingOption.fee);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const applyCoupon = () => {
    setAppliedCoupon(couponCode.trim().toUpperCase());
  };

  if (items.length === 0 && (!savedItems || savedItems.length === 0)) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
        <ShoppingCart className="w-12 h-12 mx-auto text-[#ff6600] mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Giỏ hàng của bạn đang trống</h1>
        <p className="text-gray-600 mb-6">Thêm sản phẩm vào giỏ để bắt đầu đặt hàng.</p>
        <Link href="/products" className="inline-flex px-6 py-2.5 rounded-md bg-[#ff6600] text-white font-semibold hover:bg-orange-600">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        <Link href="/" className="hover:text-[#ff6600]">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-[#ff6600] font-semibold">Giỏ hàng</span>
      </div>

      <div className="bg-white border-y border-gray-200 py-5">
        <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
          {['Giỏ hàng', 'Thanh toán', 'Giao hàng', 'Xác nhận'].map((step, index) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                index === 0
                  ? 'bg-[#ff6600] border-[#ff6600] text-white'
                  : index === 1
                    ? 'bg-[#111827] border-[#111827] text-white'
                    : 'bg-white border-gray-300 text-gray-500'
              }`}>
                {index === 0 ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className={`text-sm font-semibold ${index <= 1 ? 'text-gray-900' : 'text-gray-500'}`}>{step}</span>
              {index < 3 && <div className="hidden md:block h-px bg-gray-300 flex-1" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-5">
          <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h1 className="font-bold text-gray-950">Sản phẩm trong giỏ</h1>
              <span className="text-sm text-gray-700">{items.length} sản phẩm</span>
            </div>

            {items.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {items.map((item, index) => {
                  const price = toDisplayPrice(item.unitPrice || 0);
                  const originalPrice = Math.round(price * 1.55);

                  return (
                    <article key={item.productId} className="p-5 flex gap-4">
                      <ProductIcon index={index} />
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#ff6600]">{item.sku || 'ShopVN'}</p>
                            <h2 className="font-bold text-gray-950 leading-tight line-clamp-2">{item.productName}</h2>
                            <p className="text-xs text-gray-700 mt-1">Màu: Đen • Phiên bản: Standard</p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-bold text-[#ff6600]">{formatVnd(price)}</div>
                            <div className="text-xs text-gray-500 line-through">{formatVnd(originalPrice)}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <QuantityControl item={item} updateQuantity={updateQuantity} />
                          <button type="button" onClick={() => removeFromCart(item.productId)} className="inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
                            <Trash2 className="w-3.5 h-3.5" />
                            Xóa
                          </button>
                          <button type="button" onClick={() => saveForLater(item.productId)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#ff6600]">
                            <Heart className="w-3.5 h-3.5" />
                            Lưu
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">Chưa có sản phẩm nào trong giỏ.</div>
            )}

            {appliedCoupon === 'SALE30' && items.length > 0 && (
              <div className="px-5 py-3 bg-green-50 border-t border-green-100 text-sm font-semibold text-green-700 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Mã SALE30 đã áp dụng - Giảm thêm {formatVnd(couponDiscount)}
              </div>
            )}

            <div className="p-5 border-t border-gray-200 flex gap-3">
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="Nhập mã giảm giá..."
                className="flex-1 h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-[#ff6600]"
              />
              <button type="button" onClick={applyCoupon} className="px-5 h-11 rounded-md border border-gray-300 font-semibold hover:border-[#ff6600] hover:text-[#ff6600]">
                Áp dụng
              </button>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <h2 className="font-bold text-gray-950 px-5 py-4 border-b border-gray-200">Phương thức giao hàng</h2>
            <div className="p-5 space-y-1">
              {shippingOptions.map((option) => (
                <label key={option.id} className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={selectedShipping === option.id}
                      onChange={() => setSelectedShipping(option.id)}
                      className="mt-1 accent-[#ff6600]"
                    />
                    <span>
                      <span className="block font-bold text-gray-950">{option.name}</span>
                      <span className="block text-xs text-gray-600">{option.description}</span>
                    </span>
                  </div>
                  <span className="font-bold text-[#ff6600] shrink-0">{option.fee === 0 ? 'Miễn phí' : formatVnd(option.fee)}</span>
                </label>
              ))}
            </div>
          </section>

          {savedItems && savedItems.length > 0 && (
            <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <h2 className="font-bold text-gray-950 px-5 py-4 border-b border-gray-200">Đã lưu để mua sau</h2>
              <div className="divide-y divide-gray-200">
                {savedItems.map((item) => (
                  <div key={item.productId} className="p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{item.productName}</p>
                      <p className="text-sm text-gray-500">{formatVnd(toDisplayPrice(item.unitPrice || 0))}</p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button type="button" onClick={() => moveToCart(item.productId)} className="text-sm font-semibold text-[#ff6600] hover:underline">
                        Chuyển vào giỏ
                      </button>
                      <button type="button" onClick={() => removeFromCart(item.productId)} className="text-sm font-semibold text-red-500 hover:underline">
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <section className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-24">
            <h2 className="font-bold text-gray-950 px-5 py-4 border-b border-gray-200">Tóm tắt đơn hàng</h2>
            <div className="p-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Tạm tính ({itemCount} sản phẩm)</span>
                <span className="font-semibold">{formatVnd(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Giảm giá sản phẩm</span>
                <span className="font-semibold text-green-600">-{formatVnd(productDiscount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Mã giảm giá {appliedCoupon}</span>
                <span className="font-semibold text-green-600">-{formatVnd(couponDiscount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="font-semibold text-green-600">{selectedShippingOption.fee === 0 ? 'Miễn phí' : formatVnd(selectedShippingOption.fee)}</span>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-start">
                <span className="font-bold text-gray-950">Tổng thanh toán</span>
                <span className="text-right">
                  <span className="block text-2xl font-bold text-[#ff6600]">{formatVnd(total)}</span>
                  <span className="text-xs text-green-600 font-semibold">Bạn tiết kiệm {formatVnd(productDiscount + couponDiscount)}</span>
                </span>
              </div>

              <Link
                href="/checkout"
                className={`mt-4 h-12 rounded-md border border-gray-300 flex items-center justify-center gap-2 font-bold ${
                  items.length === 0 ? 'pointer-events-none opacity-50' : 'hover:border-[#ff6600] hover:text-[#ff6600]'
                }`}
              >
                <Lock className="w-4 h-4" />
                Đặt hàng ngay
              </Link>

              <div className="grid grid-cols-4 gap-2">
                {paymentMethods.map((method) => (
                  <div key={method} className="h-7 rounded border border-gray-200 bg-gray-50 text-[11px] font-semibold text-gray-600 flex items-center justify-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    {method}
                  </div>
                ))}
              </div>

              <button type="button" onClick={clearCart} className="w-full text-xs text-gray-500 hover:text-red-500">
                Xóa toàn bộ giỏ hàng
              </button>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg p-5 grid grid-cols-2 gap-3 text-sm text-gray-700">
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#ff6600]" />Thanh toán bảo mật</div>
            <div className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-[#ff6600]" />Đổi trả 30 ngày</div>
            <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#ff6600]" />Giao hàng miễn phí</div>
            <div className="flex items-center gap-2"><PackageCheck className="w-4 h-4 text-[#ff6600]" />Hàng chính hãng</div>
          </section>
        </aside>
      </div>
    </div>
  );
}
