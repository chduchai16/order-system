'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Check,
  CheckCircle2,
  CreditCard,
  X,
  Gift,
  Lock,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Truck,
  WalletCards,
} from 'lucide-react';
import { userService } from '@/features/account/api/userService';
import { useCartStore } from '@/features/cart/store/cartStore';
import { orderService } from '@/features/orders/api/orderService';
import { tokenStore } from '@/features/shared/api/tokenStore';
import { Address, CreateOrderRequest, PageResponse, Voucher } from '@/features/shared/types';
import { voucherService } from '@/features/vouchers/api/voucherService';

type PaymentMethod = 'COD' | 'BANK_TRANSFER';

const emptyVoucherPage: PageResponse<Voucher> = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  size: 0,
  number: 0,
};

const VOUCHER_PAGE_SIZE = 6;

const steps = ['Giỏ hàng', 'Thanh toán', 'Giao hàng', 'Xác nhận'];

const paymentMethods: Array<{
  id: PaymentMethod;
  title: string;
  description: string;
  icon: typeof WalletCards;
}> = [
  {
    id: 'BANK_TRANSFER',
    title: 'Chuyển khoản VietQR',
    description: 'Quét mã QR bằng ứng dụng ngân hàng để thanh toán tự động.',
    icon: CreditCard,
  },
  {
    id: 'COD',
    title: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán tiền mặt cho nhân viên giao hàng khi nhận đơn.',
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

function calculateVoucherDiscount(voucher: Voucher | null, subtotal: number) {
  if (!voucher) {
    return 0;
  }

  switch (voucher.discountType) {
    case 'FIXED':
      return Math.min(subtotal, voucher.discountValue);
    case 'PERCENT': {
      const discount = Math.floor((subtotal * voucher.discountValue) / 100);
      if (voucher.maxDiscountValue && voucher.maxDiscountValue > 0) {
        return Math.min(discount, voucher.maxDiscountValue);
      }
      return discount;
    }
    case 'FREESHIP':
      return 0;
    default:
      return 0;
  }
}

function voucherLabel(voucher: Voucher) {
  if (voucher.discountType === 'FIXED') {
    return `-${formatVnd(voucher.discountValue)}`;
  }
  if (voucher.discountType === 'PERCENT') {
    return `-${voucher.discountValue}%`;
  }
  return 'FREESHIP';
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
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherError, setVoucherError] = useState('');
  const [previewVouchers, setPreviewVouchers] = useState<Voucher[]>([]);
  const [modalVouchers, setModalVouchers] = useState<Voucher[]>([]);
  const [voucherListLoading, setVoucherListLoading] = useState(true);
  const [voucherPageNumber, setVoucherPageNumber] = useState(0);
  const [voucherHasMore, setVoucherHasMore] = useState(false);
  const [voucherLoadMoreLoading, setVoucherLoadMoreLoading] = useState(false);
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    district: '',
    country: 'Vietnam',
  });

  const subtotal = getTotalPrice();
  const shippingFee = 0;
  const voucherDiscount = calculateVoucherDiscount(appliedVoucher, subtotal);
  const total = Math.max(0, subtotal + shippingFee - voucherDiscount);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const mergeVouchers = (current: Voucher[], incoming: Voucher[]) => {
    const ids = new Set(current.map((voucher) => voucher.id));
    const next = [...current];

    for (const voucher of incoming) {
      if (!ids.has(voucher.id)) {
        ids.add(voucher.id);
        next.push(voucher);
      }
    }

    return next;
  };

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id || null);
    setAddress({
      street: addr.street,
      city: addr.city,
      district: addr.district,
      country: addr.country,
    });
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const profilePromise = userService.getProfile();
        const voucherPromise = voucherService.getVouchers('', 0, VOUCHER_PAGE_SIZE).catch((err) => {
          console.error('Failed to fetch vouchers', err);
          return emptyVoucherPage;
        });

        const [profile, voucherPage] = await Promise.all([profilePromise, voucherPromise]);

        if (profile.addresses) {
          setUserAddresses(profile.addresses);
          const defaultAddr = profile.addresses.find((addr) => addr.isDefault) ?? profile.addresses[0];
          if (defaultAddr) {
            handleSelectAddress(defaultAddr);
          }
        }

        const activeVouchers = (voucherPage.content ?? []).filter((voucher) => voucher.active);
        setPreviewVouchers(activeVouchers);
        setModalVouchers(activeVouchers);
        setVoucherPageNumber(voucherPage.number ?? 0);
        setVoucherHasMore((voucherPage.number ?? 0) + 1 < (voucherPage.totalPages ?? 0));
      } catch (err) {
        console.error('Failed to fetch checkout data', err);
      } finally {
        setVoucherListLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const loadMoreVouchers = async () => {
    if (voucherLoadMoreLoading || !voucherHasMore) {
      return;
    }

    setVoucherLoadMoreLoading(true);
    try {
      const nextPage = voucherPageNumber + 1;
      const response = await voucherService.getVouchers('', nextPage, VOUCHER_PAGE_SIZE);
      const activeVouchers = (response.content ?? []).filter((voucher) => voucher.active);

      setModalVouchers((current) => mergeVouchers(current, activeVouchers));
      setVoucherPageNumber(response.number ?? nextPage);
      setVoucherHasMore((response.number ?? nextPage) + 1 < (response.totalPages ?? 0));
    } catch (err) {
      console.error('Failed to load more vouchers', err);
    } finally {
      setVoucherLoadMoreLoading(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAddressId(null);
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const applyVoucher = async (code: string) => {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      setVoucherError('Vui lòng nhập mã voucher.');
      setAppliedVoucher(null);
      return;
    }

    setVoucherLoading(true);
    setVoucherError('');
    try {
      const page = await voucherService.getVouchers(normalizedCode, 0, 10);
      const matchedVoucher = page.content.find((voucher) => voucher.code.toUpperCase() === normalizedCode);
      if (!matchedVoucher) {
        throw new Error('Không tìm thấy voucher phù hợp.');
      }
      if (!matchedVoucher.active) {
        throw new Error('Voucher hiện không còn hiệu lực.');
      }
      if ((matchedVoucher.minOrderValue ?? 0) > subtotal) {
        throw new Error(`Voucher yêu cầu đơn tối thiểu ${formatVnd(matchedVoucher.minOrderValue ?? 0)}.`);
      }

      setAppliedVoucher(matchedVoucher);
      setVoucherCode(matchedVoucher.code);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể áp dụng voucher.';
      setAppliedVoucher(null);
      setVoucherError(message);
    } finally {
      setVoucherLoading(false);
    }
  };

  const clearVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
    setVoucherError('');
  };

  const handleSubmitOrder = async () => {
    if (!address.street || !address.city || !address.district) {
      setError('Vui lòng nhập đầy đủ địa chỉ nhận hàng.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const userId = tokenStore.getUserId();
      if (!userId) {
        throw new Error('Bạn cần đăng nhập để đặt hàng.');
      }

      const orderItems = items.map((item) => ({
        productId: Number(item.productId),
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));

      if (orderItems.some((item) => Number.isNaN(item.productId))) {
        throw new Error('Sản phẩm trong giỏ hàng không hợp lệ.');
      }

      const orderRequest: CreateOrderRequest = {
        userId,
        items: orderItems,
        street: address.street,
        city: address.city,
        district: address.district,
        country: address.country,
        shippingCarrier: 'Giao Hàng Nhanh',
        discountCode: appliedVoucher?.code || undefined,
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
      setError(e.response?.data?.message || e.message || 'Không thể tạo đơn hàng mới.');
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
        <p className="text-xs text-gray-500 mb-6">Không có sản phẩm nào để đặt thanh toán.</p>
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
        <p className="text-xs text-gray-500">Hệ thống đang chuyển bạn đến trang đơn hàng để theo dõi...</p>
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
              {index < 3 && <div className="hidden sm:block w-12 h-px bg-gray-200" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-6">
          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-[#F5EFE6]/10">
              <div className="w-9 h-9 rounded-xl bg-[#F5EFE6] text-[#F1641E] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-[#222222] text-sm md:text-base">Phương thức thanh toán</h3>
                <p className="text-[11px] text-gray-500">Chọn cổng thanh toán phù hợp trước khi giao hàng.</p>
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
                  </label>
                );
              })}
            </div>
          </section>

          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-[#F5EFE6]/10">
              <div className="w-9 h-9 rounded-xl bg-[#F5EFE6] text-[#F1641E] flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-[#222222] text-sm md:text-base">Voucher ưu đãi</h3>
                <p className="text-[11px] text-gray-500">Nhập mã voucher hoặc chọn nhanh từ danh sách gợi ý.</p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      applyVoucher(voucherCode);
                    }
                  }}
                  placeholder="Nhập mã voucher, ví dụ SALE10"
                  className="flex-1 h-11 px-4 border border-gray-300 rounded-full focus:border-[#F1641E] focus:ring-1 focus:ring-[#F1641E]/30 text-xs bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => applyVoucher(voucherCode)}
                  disabled={voucherLoading}
                  className="h-11 px-5 rounded-full bg-[#222222] text-white text-xs font-bold disabled:bg-gray-300"
                >
                  {voucherLoading ? 'Đang kiểm tra...' : 'Áp dụng'}
                </button>
                {appliedVoucher && (
                  <button
                    type="button"
                    onClick={clearVoucher}
                    className="h-11 px-5 rounded-full border border-gray-300 text-xs font-bold"
                  >
                    Bỏ chọn
                  </button>
                )}
              </div>

              {voucherError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-[11px] leading-snug">
                  {voucherError}
                </div>
              )}

              {appliedVoucher && (
                <div className="p-4 rounded-xl border border-[#1E5C3F]/20 bg-[#EBF2EE]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-xs text-[#1E5C3F]">{appliedVoucher.code}</div>
                      <div className="text-[11px] text-gray-600 mt-1">{appliedVoucher.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-500">Ước tính giảm</div>
                      <div className="font-bold text-sm text-[#1E5C3F]">-{formatVnd(voucherDiscount)}</div>
                    </div>
                  </div>
                </div>
              )}

              {voucherListLoading && (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-[11px] text-gray-500">
                  Đang tải danh sách voucher gợi ý...
                </div>
              )}

              {!voucherListLoading && previewVouchers.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-[11px] text-gray-500">
                  Hiện chưa có voucher gợi ý. Bạn vẫn có thể nhập mã voucher để kiểm tra.
                </div>
              )}

              {previewVouchers.length > 0 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {previewVouchers.map((voucher) => (
                      <button
                        key={voucher.id}
                        type="button"
                        onClick={() => applyVoucher(voucher.code)}
                        className="text-left p-4 border rounded-xl transition-all duration-200 bg-white hover:border-[#F1641E]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-[#222222]">{voucher.code}</span>
                          <span className="text-[10px] text-[#F1641E] font-bold">{voucherLabel(voucher)}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">{voucher.name}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVoucherModalOpen(true)}
                      className="h-10 px-5 rounded-full border border-gray-300 text-xs font-bold hover:border-[#F1641E] hover:text-[#F1641E]"
                    >
                      Xem tất cả voucher
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-[#F5EFE6]/10">
              <div className="w-9 h-9 rounded-xl bg-[#F5EFE6] text-[#F1641E] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-[#222222] text-sm md:text-base">Thông tin vận chuyển</h3>
                <p className="text-[11px] text-gray-500">Tác phẩm sẽ được đóng gói kỹ và giao đến địa chỉ bên dưới.</p>
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
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Địa chỉ chi tiết</label>
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

        <aside className="space-y-4">
          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden sticky top-24 shadow-sm">
            <h3 className="font-serif font-black text-[#222222] px-5 py-4 border-b border-gray-100 bg-[#F5EFE6]/10 text-base">Tóm tắt thanh toán</h3>
            <div className="p-5 space-y-4 text-xs font-semibold text-gray-600">
              <div className="flex justify-between">
                <span>Tạm tính ({itemCount} sản phẩm)</span>
                <span className="font-bold text-gray-800">{formatVnd(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Voucher áp dụng</span>
                <span className="text-[#1E5C3F] font-bold">-{formatVnd(voucherDiscount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="text-[#1E5C3F] font-bold">Miễn phí</span>
              </div>
              <div className="flex justify-between">
                <span>Phương thức áp dụng</span>
                <span className="font-bold text-gray-800">{paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản VietQR' : 'COD'}</span>
              </div>
              {appliedVoucher && (
                <div className="flex justify-between">
                  <span>Mã voucher</span>
                  <span className="font-bold text-gray-800">{appliedVoucher.code}</span>
                </div>
              )}

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
                {loading ? 'Đang xử lý...' : paymentMethod === 'BANK_TRANSFER' ? 'Tạo đơn hàng và đến trang thanh toán' : 'Xác nhận đặt đơn COD'}
              </button>

              <Link href="/cart" className="w-full h-11 rounded-full border border-gray-300 flex items-center justify-center font-bold hover:border-[#222222] hover:text-black transition-all text-xs">
                Quay lại giỏ hàng
              </Link>
            </div>
          </section>

          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl p-5 space-y-4 shadow-sm text-xs text-gray-600">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#1E5C3F] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-800">Thanh toán bảo mật</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">Mọi giao dịch qua VietQR được xác minh bảo mật tự động.</p>
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

      {voucherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-gray-100">
              <div>
                <h3 className="font-serif font-black text-lg text-[#222222]">Tất cả voucher</h3>
                <p className="text-[12px] text-gray-500 mt-1">Chọn voucher phù hợp hoặc tải thêm danh sách phía dưới.</p>
              </div>
              <button
                type="button"
                onClick={() => setVoucherModalOpen(false)}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {modalVouchers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {modalVouchers.map((voucher) => (
                    <button
                      key={`modal-${voucher.id}`}
                      type="button"
                      onClick={() => {
                        applyVoucher(voucher.code);
                        setVoucherModalOpen(false);
                      }}
                      className="text-left p-4 border rounded-xl transition-all duration-200 bg-white hover:border-[#F1641E]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-[#222222]">{voucher.code}</span>
                        <span className="text-[10px] text-[#F1641E] font-bold">{voucherLabel(voucher)}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">{voucher.name}</p>
                    </button>
                  ))}
                </div>
              )}

              {voucherHasMore && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={loadMoreVouchers}
                    disabled={voucherLoadMoreLoading}
                    className="h-10 px-5 rounded-full border border-gray-300 text-xs font-bold hover:border-[#F1641E] hover:text-[#F1641E] disabled:opacity-50"
                  >
                    {voucherLoadMoreLoading ? 'Đang tải thêm...' : 'Tải thêm voucher'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
