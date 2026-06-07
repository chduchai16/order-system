'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Check,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Truck,
  WalletCards,
  Gift,
} from 'lucide-react';
import { userService } from '@/features/account/api/userService';
import { useCartStore } from '@/features/cart/store/cartStore';
import { orderService } from '@/features/orders/api/orderService';
import { tokenStore } from '@/features/shared/api/tokenStore';
import { Address, CreateOrderRequest } from '@/features/shared/types';

type PaymentMethod = 'COD' | 'BANK_TRANSFER';

const steps = ['Giỏ hàng', 'Thanh toán', 'Giao hàng', 'Xác nhận'];

const paymentMethods: Array<{
  id: PaymentMethod;
  title: string;
  description: string;
  icon: typeof WalletCards;
  badge?: string;
}> = [
  {
    id: 'BANK_TRANSFER',
    title: 'Chuyển khoản VietQR',
    description: 'Quét mã QR bằng ứng dụng ngân hàng để thanh toán tự động, nhận thêm ưu đãi.',
    icon: CreditCard,
    badge: 'Khuyên dùng - Giảm 3%',
  },
  {
    id: 'COD',
    title: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán tiền mặt cho nhân viên giao hàng sau khi nhận và kiểm tra tác phẩm.',
    icon: WalletCards,
  },
];

const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}đ`;

function ProductIcon() {
  return (
    <div className="w-14 h-14 rounded-xl bg-[#F5EFE6]/70 flex items-center justify-center shrink-0 border border-[#EAE3D2]/40">
      <Gift className="w-7 h-7 text-[#F1641E] opacity-75" />
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    district: '',
    country: 'Vietnam',
  });

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id || null);
    setAddress({
      street: addr.street,
      city: addr.city,
      district: addr.district,
      country: addr.country,
    });
  };

  const subtotal = getTotalPrice();
  const shippingFee = 0;
  const paymentDiscount = paymentMethod === 'BANK_TRANSFER' ? Math.round(subtotal * 0.03) : 0;
  const total = Math.max(0, subtotal + shippingFee - paymentDiscount);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        const profile = await userService.getProfile();
        if (profile.addresses) {
          setUserAddresses(profile.addresses);
          const defaultAddr = profile.addresses.find((addr) => addr.isDefault) ?? profile.addresses[0];
          if (defaultAddr) {
            handleSelectAddress(defaultAddr);
          }
        }
      } catch (err) {
        console.error('Failed to fetch addresses', err);
      }
    };

    fetchUserAddresses();
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAddressId(null);
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async () => {
    if (!address.street || !address.city || !address.district) {
      setError('Vui lòng nhập đầy đủ địa chỉ nhận hàng chi tiết để vận chuyển.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const userId = tokenStore.getUserId();
      if (!userId) {
        throw new Error('Bạn cần đăng nhập tài khoản ShopVN để hoàn tất đặt đơn hàng.');
      }

      const orderItems = items.map((item) => ({
        productId: Number(item.productId),
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));

      if (orderItems.some((item) => Number.isNaN(item.productId))) {
        throw new Error('Sản phẩm đặt mua trong giỏ hàng không hợp lệ.');
      }

      const orderRequest: CreateOrderRequest = {
        userId,
        items: orderItems,
        totalPrice: total,
        street: address.street,
        city: address.city,
        district: address.district,
        country: address.country,
        shippingCarrier: 'Giao Hang Nhanh',
        discountCode: paymentMethod === 'BANK_TRANSFER' ? 'ONLINEPAY' : '',
      };

      const order = await orderService.createOrder(orderRequest);
      clearCart();

      if (paymentMethod === 'BANK_TRANSFER') {
        router.push(`/payment?orderId=${order.id}`);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/orders');
        }, 1500);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message || e.message || 'Không thể thiết lập tạo đơn hàng mới.');
      console.error('Order creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="bg-white border border-[#EAE3D2]/60 rounded-2xl p-10 text-center max-w-lg mx-auto shadow-sm">
        <ShoppingCart className="w-14 h-14 mx-auto text-[#F1641E] mb-4" />
        <h1 className="font-serif text-2xl font-black mb-2 text-gray-900">Giỏ hàng của bạn đang trống</h1>
        <p className="text-xs text-gray-500 mb-6">Không có sản phẩm nào để đặt thanh toán. Hãy thêm mặt hàng yêu thích ngay.</p>
        <Link href="/products" className="inline-flex px-6 py-3 rounded-full bg-[#F1641E] hover:bg-[#d85213] text-white font-bold text-xs transition-colors">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white border border-[#EAE3D2]/60 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-md">
        <CheckCircle2 className="w-16 h-16 mx-auto text-[#1E5C3F] mb-4" />
        <h1 className="font-serif text-2xl font-black mb-2 text-[#222222]">Đặt đơn hàng thành công!</h1>
        <p className="text-xs text-gray-500">Cảm ơn bạn đã đồng hành. Hệ thống đang chuyển bạn đến trang đơn hàng để theo dõi...</p>
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
        <span className="text-gray-400 font-medium">Thanh toán</span>
      </div>

      {/* Stepper progress indicator */}
      <div className="bg-white border border-[#EAE3D2]/50 rounded-2xl py-4 px-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
        <div className="flex flex-wrap justify-between items-center max-w-3xl mx-auto gap-4">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                index === 0
                  ? 'bg-[#EBF2EE] border-[#1E5C3F] text-[#1E5C3F]'
                  : index === 1
                    ? 'bg-[#F1641E] border-[#F1641E] text-white shadow-sm'
                    : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {index === 0 ? <Check className="w-3.5 h-3.5" /> : index + 1}
              </div>
              <span className={`text-xs font-bold ${index === 1 ? 'text-[#F1641E]' : 'text-gray-500'}`}>{step}</span>
              {index < 3 && <div className="hidden sm:block w-12 h-px bg-gray-250" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-6">
          
          {/* Payment selector section */}
          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-[#F5EFE6]/10">
              <div className="w-9 h-9 rounded-xl bg-[#F5EFE6] text-[#F1641E] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-[#222222] text-sm md:text-base">Phương thức thanh toán</h3>
                <p className="text-[11px] text-gray-500">Vui lòng chọn cổng thanh toán phù hợp trước khi giao hàng.</p>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const selected = paymentMethod === method.id;
                return (
                  <label key={method.id} className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    selected ? 'border-[#F1641E] bg-[#FDFAF7]' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={selected}
                        onChange={() => setPaymentMethod(method.id)}
                        className="mt-1 accent-[#F1641E] shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[#F1641E] shrink-0" />
                          <span className="font-bold text-xs md:text-sm text-[#222222]">{method.title}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-normal">{method.description}</p>
                      </div>
                    </div>
                    {method.badge && (
                      <div className="mt-3.5">
                        <span className="px-2.5 py-1 rounded bg-[#EBF2EE] text-[#1E5C3F] text-[10px] font-bold">
                          {method.badge}
                        </span>
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </section>

          {/* Delivery destination address */}
          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-[#F5EFE6]/10">
              <div className="w-9 h-9 rounded-xl bg-[#F5EFE6] text-[#F1641E] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-[#222222] text-sm md:text-base">Thông tin vận chuyển</h3>
                <p className="text-[11px] text-gray-500">Tác phẩm sẽ được đóng gói tỉ mỉ và giao đến địa chỉ bên dưới.</p>
              </div>
            </div>

            <div className="p-5">
              {userAddresses.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-[#222222] text-xs uppercase tracking-wider mb-3">Sổ địa chỉ của bạn</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {userAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => handleSelectAddress(addr)}
                        className={`text-left p-4 border rounded-xl transition-all duration-200 cursor-pointer ${
                          selectedAddressId === addr.id 
                            ? 'border-[#F1641E] bg-[#FDFAF7] ring-1 ring-[#F1641E]' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="font-bold text-xs text-[#222222]">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[9px] bg-[#1E5C3F] text-white px-2 py-0.5 rounded-full font-bold">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{addr.street}</p>
                        <p className="text-[10.5px] text-gray-400 font-semibold mt-1">{addr.district}, {addr.city}</p>
                      </button>
                    ))}
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-150" /></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider"><span className="bg-white px-3 text-gray-400">Hoặc tự điền địa chỉ giao hàng</span></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Địa chỉ chi tiết (Số nhà, tên đường...)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleAddressChange}
                      placeholder="Ví dụ: 80/12 Đường Lê Lợi"
                      className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-full focus:border-[#F1641E] focus:ring-1 focus:ring-[#F1641E]/30 text-xs bg-white focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Quận/Huyện</label>
                  <input
                    type="text"
                    name="district"
                    value={address.district}
                    onChange={handleAddressChange}
                    placeholder="Quận 1"
                    className="w-full h-11 px-4 border border-gray-300 rounded-full focus:border-[#F1641E] focus:ring-1 focus:ring-[#F1641E]/30 text-xs bg-white focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Tỉnh/Thành phố</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="TP. Hồ Chí Minh"
                    className="w-full h-11 px-4 border border-gray-300 rounded-full focus:border-[#F1641E] focus:ring-1 focus:ring-[#F1641E]/30 text-xs bg-white focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* List of items inside checkout */}
          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden shadow-sm">
            <h3 className="font-serif font-black text-[#222222] px-5 py-4 border-b border-gray-100 bg-[#F5EFE6]/10 text-base">Sản phẩm trong hóa đơn</h3>
            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                const unitPrice = item.unitPrice || 0;
                return (
                  <article key={item.productId} className="p-4 flex items-center gap-4">
                    <ProductIcon />
                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="font-bold text-[#222222] text-xs md:text-sm line-clamp-1 leading-tight">{item.productName}</h4>
                      <p className="text-xs text-gray-500">Số lượng: {item.quantity} x {formatVnd(unitPrice)}</p>
                    </div>
                    <div className="font-bold text-[#F1641E] text-xs md:text-sm shrink-0">{formatVnd(unitPrice * item.quantity)}</div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar Order Actions */}
        <aside className="space-y-4">
          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden sticky top-24 shadow-sm">
            <h3 className="font-serif font-black text-[#222222] px-5 py-4 border-b border-gray-100 bg-[#F5EFE6]/10 text-base">Tóm tắt thanh toán</h3>
            <div className="p-5 space-y-4 text-xs font-semibold text-gray-600">
              <div className="flex justify-between">
                <span>Tạm tính ({itemCount} sản phẩm)</span>
                <span className="font-bold text-gray-800">{formatVnd(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Khuyến mãi trực tuyến</span>
                <span className="text-[#1E5C3F] font-bold">-{formatVnd(paymentDiscount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="text-[#1E5C3F] font-bold">Miễn phí</span>
              </div>
              <div className="flex justify-between">
                <span>Phương thức áp dụng</span>
                <span className="font-bold text-gray-800">{paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản VietQR' : 'COD'}</span>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-start">
                <span className="font-bold text-[#222222] text-sm">Tổng thanh toán</span>
                <div className="text-right">
                  <span className="block text-2xl font-serif font-black text-[#F1641E]">{formatVnd(total)}</span>
                  <span className="text-[10px] text-gray-400 block mt-1">Đã bao gồm tất cả các loại phí</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-[11px] leading-snug">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmitOrder}
                disabled={loading}
                className="mt-4 w-full h-12 rounded-full bg-[#F1641E] hover:bg-[#d85213] text-white flex items-center justify-center gap-2 font-bold text-xs cursor-pointer shadow-sm transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                {loading ? 'Đang xử lý...' : paymentMethod === 'BANK_TRANSFER' ? 'Tạo đơn hàng & Đến trang thanh toán' : 'Xác nhận đặt đơn COD'}
              </button>

              <Link href="/cart" className="w-full h-11 rounded-full border border-gray-300 flex items-center justify-center font-bold hover:border-[#222222] hover:text-black transition-all text-xs">
                Quay lại giỏ hàng
              </Link>
            </div>
          </section>

          {/* Checkout assurances */}
          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl p-5 space-y-4 shadow-sm text-xs text-gray-600">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#1E5C3F] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-800">Thanh toán bảo mật</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">Mọi giao dịch qua VietQR được xác minh bảo mật tự động thông qua SePay.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-gray-100 pt-3">
              <PackageCheck className="w-5 h-5 text-[#1E5C3F] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-800">Bảo đảm vận chuyển</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">Tác phẩm sẽ được đóng gói bằng hộp giấy tái chế chống sốc chuyên dụng.</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
