'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Check,
  CheckCircle2,
  CreditCard,
  Landmark,
  Lock,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Truck,
  WalletCards,
  Zap,
} from 'lucide-react';
import { orderService } from '@/lib/api/orderService';
import { tokenStore } from '@/lib/api/tokenStore';
import { userService } from '@/lib/api/userService';
import { useCartStore } from '@/lib/store/cartStore';
import { Address, CreateOrderRequest } from '@/lib/utils/types';

type PaymentMethod = 'COD' | 'VNPAY';

const steps = ['Giỏ hàng', 'Thanh toán', 'Giao hàng', 'Xác nhận'];
const toDisplayPrice = (price: number) => (price >= 10000 ? price : price * 25000);
const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}đ`;

const paymentMethods: Array<{
  id: PaymentMethod;
  title: string;
  description: string;
  icon: typeof WalletCards;
  badge?: string;
}> = [
  {
    id: 'VNPAY',
    title: 'Thanh toán online qua VNPay',
    description: 'Thanh toán trước bằng thẻ ATM, Visa/Mastercard hoặc ví điện tử.',
    icon: CreditCard,
    badge: 'Khuyên dùng',
  },
  {
    id: 'COD',
    title: 'Thanh toán khi nhận hàng',
    description: 'Thanh toán tiền mặt sau khi đơn hàng được giao đến bạn.',
    icon: WalletCards,
  },
];

function ProductIcon({ index }: { index: number }) {
  const colors = ['bg-[#dff1ff] text-blue-500', 'bg-pink-100 text-purple-500', 'bg-green-100 text-green-600'];

  return (
    <div className={`w-14 h-14 rounded-md flex items-center justify-center shrink-0 ${colors[index % colors.length]}`}>
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1c-1.657 0-3-1.343-3-3v-2c0-1.657 1.343-3 3-3h3v8z" />
        <path d="M3 19a2 2 0 0 0 2 2h1c1.657 0 3-1.343 3-3v-2c0-1.657-1.343-3-3-3H3v8z" />
      </svg>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('VNPAY');
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    district: '',
    country: 'Vietnam',
  });

  const subtotal = useMemo(() => toDisplayPrice(getTotalPrice()), [getTotalPrice, items]);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const shippingFee = 0;
  const paymentDiscount = paymentMethod === 'VNPAY' ? Math.round(subtotal * 0.03) : 0;
  const total = Math.max(0, subtotal + shippingFee - paymentDiscount);

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

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id || null);
    setAddress({
      street: addr.street,
      city: addr.city,
      district: addr.district,
      country: addr.country,
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAddressId(null);
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async () => {
    if (!address.street || !address.city || !address.district) {
      setError('Vui lòng nhập đầy đủ địa chỉ giao hàng');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const userId = tokenStore.getUserId();
      if (!userId) {
        throw new Error('Bạn cần đăng nhập để đặt hàng');
      }

      const orderRequest: CreateOrderRequest = {
        userId,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        totalPrice: total,
        street: address.street,
        city: address.city,
        district: address.district,
        country: address.country,
        shippingCarrier: 'Giao Hàng Nhanh',
        discountCode: paymentMethod === 'VNPAY' ? 'ONLINEPAY' : '',
      };

      await orderService.createOrder(orderRequest);

      if (paymentMethod === 'VNPAY') {
        window.open('https://sandbox.vnpayment.vn/apis/vnpay-demo/', '_blank');
      }

      setSuccess(true);
      clearCart();

      setTimeout(() => {
        router.push('/orders');
      }, 1500);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message || e.message || 'Không thể tạo đơn hàng');
      console.error('Order creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
        <ShoppingCart className="w-12 h-12 mx-auto text-[#ff6600] mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Giỏ hàng của bạn đang trống</h1>
        <p className="text-gray-600 mb-6">Thêm sản phẩm vào giỏ để bắt đầu thanh toán.</p>
        <Link href="/products" className="inline-flex px-6 py-2.5 rounded-md bg-[#ff6600] text-white font-semibold hover:bg-orange-600">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
        <CheckCircle2 className="w-14 h-14 mx-auto text-green-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Đặt hàng thành công</h1>
        <p className="text-gray-600">Đang chuyển đến trang đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        <Link href="/" className="hover:text-[#ff6600]">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/cart" className="hover:text-[#ff6600]">Giỏ hàng</Link>
        <span className="mx-2">/</span>
        <span className="text-[#ff6600] font-semibold">Thanh toán</span>
      </div>

      <div className="bg-white border-y border-gray-200 py-5">
        <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
          {steps.map((step, index) => (
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
            <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-orange-50 text-[#ff6600] flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-gray-950">Thanh toán trước</h1>
                <p className="text-sm text-gray-600">Chọn phương thức thanh toán trước khi xác nhận giao hàng.</p>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const selected = paymentMethod === method.id;
                return (
                  <label key={method.id} className={`border rounded-lg p-4 cursor-pointer transition-colors ${selected ? 'border-[#ff6600] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={selected}
                        onChange={() => setPaymentMethod(method.id)}
                        className="mt-1 accent-[#ff6600]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-[#ff6600]" />
                          <span className="font-bold text-gray-950">{method.title}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                        {method.badge && (
                          <span className="inline-flex mt-3 px-2 py-1 rounded bg-green-50 text-green-600 text-xs font-bold">
                            {method.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-orange-50 text-[#ff6600] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-gray-950">Địa chỉ giao hàng</h2>
                <p className="text-sm text-gray-600">Sau khi thanh toán, đơn hàng sẽ được giao đến địa chỉ này.</p>
              </div>
            </div>

            <div className="p-5">
              {userAddresses.length > 0 && (
                <div className="mb-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {userAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => handleSelectAddress(addr)}
                        className={`text-left p-4 border rounded-lg transition-colors ${
                          selectedAddressId === addr.id ? 'border-[#ff6600] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-gray-950">{addr.label}</span>
                          {addr.isDefault && <span className="text-xs bg-[#ff6600] text-white px-2 py-0.5 rounded">Mặc định</span>}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{addr.street}</p>
                        <p className="text-xs text-gray-500 mt-1">{addr.district}, {addr.city}</p>
                      </button>
                    ))}
                  </div>

                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Hoặc nhập địa chỉ mới</span></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">Địa chỉ chi tiết</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleAddressChange}
                      placeholder="123 Đường Lê Lợi"
                      className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-md focus:border-[#ff6600] focus:ring-2 focus:ring-orange-100 text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Quận/Huyện</label>
                  <input
                    type="text"
                    name="district"
                    value={address.district}
                    onChange={handleAddressChange}
                    placeholder="Quận 1"
                    className="w-full h-11 px-4 border border-gray-300 rounded-md focus:border-[#ff6600] focus:ring-2 focus:ring-orange-100 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Tỉnh/Thành phố</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="TP. Hồ Chí Minh"
                    className="w-full h-11 px-4 border border-gray-300 rounded-md focus:border-[#ff6600] focus:ring-2 focus:ring-orange-100 text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <h2 className="font-bold text-gray-950 px-5 py-4 border-b border-gray-200">Sản phẩm đặt mua</h2>
            <div className="divide-y divide-gray-200">
              {items.map((item, index) => {
                const unitPrice = toDisplayPrice(item.unitPrice || 0);
                return (
                  <article key={item.productId} className="p-5 flex items-center gap-4">
                    <ProductIcon index={index} />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-950 line-clamp-2">{item.productName}</h3>
                      <p className="text-sm text-gray-600">Số lượng: {item.quantity} x {formatVnd(unitPrice)}</p>
                    </div>
                    <div className="font-bold text-[#ff6600]">{formatVnd(unitPrice * item.quantity)}</div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-24">
            <h2 className="font-bold text-gray-950 px-5 py-4 border-b border-gray-200">Tóm tắt thanh toán</h2>
            <div className="p-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Tạm tính ({itemCount} sản phẩm)</span>
                <span className="font-semibold">{formatVnd(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ưu đãi thanh toán online</span>
                <span className="font-semibold text-green-600">-{formatVnd(paymentDiscount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="font-semibold text-green-600">Miễn phí</span>
              </div>
              <div className="flex justify-between">
                <span>Phương thức</span>
                <span className="font-semibold">{paymentMethod === 'VNPAY' ? 'VNPay' : 'COD'}</span>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-start">
                <span className="font-bold text-gray-950">Tổng thanh toán</span>
                <span className="text-right">
                  <span className="block text-2xl font-bold text-[#ff6600]">{formatVnd(total)}</span>
                  <span className="text-xs text-green-600 font-semibold">Đã gồm phí giao hàng</span>
                </span>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmitOrder}
                disabled={loading}
                className="mt-4 w-full h-12 rounded-md bg-[#ff6600] text-white flex items-center justify-center gap-2 font-bold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                {loading ? 'Đang xử lý...' : paymentMethod === 'VNPAY' ? 'Thanh toán và đặt hàng' : 'Đặt hàng COD'}
              </button>

              <Link href="/cart" className="w-full h-11 rounded-md border border-gray-300 flex items-center justify-center font-bold hover:border-[#ff6600] hover:text-[#ff6600]">
                Quay lại giỏ hàng
              </Link>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg p-5 grid grid-cols-2 gap-3 text-sm text-gray-700">
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#ff6600]" />Thanh toán bảo mật</div>
            <div className="flex items-center gap-2"><Landmark className="w-4 h-4 text-[#ff6600]" />Cổng VNPay</div>
            <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#ff6600]" />Giao sau thanh toán</div>
            <div className="flex items-center gap-2"><PackageCheck className="w-4 h-4 text-[#ff6600]" />Hàng chính hãng</div>
          </section>
        </aside>
      </div>
    </div>
  );
}
