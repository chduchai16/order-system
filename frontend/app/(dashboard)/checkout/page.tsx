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
import { Address, CreateOrderRequest, Voucher } from '@/features/shared/types';
import { voucherService } from '@/features/vouchers/api/voucherService';

type PaymentMethod = 'COD' | 'BANK_TRANSFER';

const steps = ['Gio hang', 'Thanh toan', 'Giao hang', 'Xac nhan'];

const paymentMethods: Array<{
  id: PaymentMethod;
  title: string;
  description: string;
  icon: typeof WalletCards;
}> = [
  {
    id: 'BANK_TRANSFER',
    title: 'Chuyen khoan VietQR',
    description: 'Quet ma QR bang ung dung ngan hang de thanh toan tu dong.',
    icon: CreditCard,
  },
  {
    id: 'COD',
    title: 'Thanh toan khi nhan hang (COD)',
    description: 'Thanh toan tien mat cho nhan vien giao hang khi nhan don.',
    icon: WalletCards,
  },
];

const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}d`;

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
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
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
        const [profile, voucherPage] = await Promise.all([
          userService.getProfile(),
          voucherService.getVouchers('', 0, 6),
        ]);

        if (profile.addresses) {
          setUserAddresses(profile.addresses);
          const defaultAddr = profile.addresses.find((addr) => addr.isDefault) ?? profile.addresses[0];
          if (defaultAddr) {
            handleSelectAddress(defaultAddr);
          }
        }

        setAvailableVouchers(voucherPage.content.filter((voucher) => voucher.active));
      } catch (err) {
        console.error('Failed to fetch checkout data', err);
      }
    };

    fetchInitialData();
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAddressId(null);
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const applyVoucher = async (code: string) => {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      setVoucherError('Vui long nhap ma voucher.');
      setAppliedVoucher(null);
      return;
    }

    setVoucherLoading(true);
    setVoucherError('');
    try {
      const page = await voucherService.getVouchers(normalizedCode, 0, 10);
      const matchedVoucher = page.content.find((voucher) => voucher.code.toUpperCase() === normalizedCode);
      if (!matchedVoucher) {
        throw new Error('Khong tim thay voucher phu hop.');
      }
      if (!matchedVoucher.active) {
        throw new Error('Voucher hien khong con hieu luc.');
      }
      if ((matchedVoucher.minOrderValue ?? 0) > subtotal) {
        throw new Error(`Voucher yeu cau don toi thieu ${formatVnd(matchedVoucher.minOrderValue ?? 0)}.`);
      }

      setAppliedVoucher(matchedVoucher);
      setVoucherCode(matchedVoucher.code);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Khong the ap dung voucher.';
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
      setError('Vui long nhap day du dia chi nhan hang.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const userId = tokenStore.getUserId();
      if (!userId) {
        throw new Error('Ban can dang nhap de dat hang.');
      }

      const orderItems = items.map((item) => ({
        productId: Number(item.productId),
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));

      if (orderItems.some((item) => Number.isNaN(item.productId))) {
        throw new Error('San pham trong gio hang khong hop le.');
      }

      const orderRequest: CreateOrderRequest = {
        userId,
        items: orderItems,
        street: address.street,
        city: address.city,
        district: address.district,
        country: address.country,
        shippingCarrier: 'Giao Hang Nhanh',
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
      setError(e.response?.data?.message || e.message || 'Khong the tao don hang moi.');
      console.error('Order creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="bg-white border border-[#EAE3D2]/60 rounded-2xl p-10 text-center max-w-lg mx-auto shadow-sm">
        <ShoppingCart className="w-14 h-14 mx-auto text-[#F1641E] mb-4" />
        <h1 className="font-serif text-2xl font-black mb-2 text-gray-900">Gio hang cua ban dang trong</h1>
        <p className="text-xs text-gray-500 mb-6">Khong co san pham nao de dat thanh toan.</p>
        <Link href="/products" className="inline-flex px-6 py-3 rounded-full bg-[#F1641E] hover:bg-[#d85213] text-white font-bold text-xs transition-colors">
          Tiep tuc mua sam
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white border border-[#EAE3D2]/60 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-md">
        <CheckCircle2 className="w-16 h-16 mx-auto text-[#1E5C3F] mb-4" />
        <h1 className="font-serif text-2xl font-black mb-2 text-[#222222]">Dat don hang thanh cong!</h1>
        <p className="text-xs text-gray-500">He thong dang chuyen ban den trang don hang de theo doi...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="text-xs text-gray-500 flex items-center gap-1.5 py-1">
        <Link href="/" className="hover:text-[#F1641E] transition-colors">Trang chu</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-[#F1641E] transition-colors">Gio hang</Link>
        <span>/</span>
        <span className="text-gray-400 font-medium">Thanh toan</span>
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
              {index < 3 && <div className="hidden sm:block w-12 h-px bg-gray-250" />}
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
                <h3 className="font-serif font-black text-[#222222] text-sm md:text-base">Phuong thuc thanh toan</h3>
                <p className="text-[11px] text-gray-500">Chon cong thanh toan phu hop truoc khi giao hang.</p>
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
                <h3 className="font-serif font-black text-[#222222] text-sm md:text-base">Voucher uu dai</h3>
                <p className="text-[11px] text-gray-500">Nhap ma voucher hoac chon nhanh tu danh sach goi y.</p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  placeholder="Nhap ma voucher, vi du SALE10"
                  className="flex-1 h-11 px-4 border border-gray-300 rounded-full focus:border-[#F1641E] focus:ring-1 focus:ring-[#F1641E]/30 text-xs bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => applyVoucher(voucherCode)}
                  disabled={voucherLoading}
                  className="h-11 px-5 rounded-full bg-[#222222] text-white text-xs font-bold disabled:bg-gray-300"
                >
                  {voucherLoading ? 'Dang kiem tra...' : 'Ap dung'}
                </button>
                {appliedVoucher && (
                  <button
                    type="button"
                    onClick={clearVoucher}
                    className="h-11 px-5 rounded-full border border-gray-300 text-xs font-bold"
                  >
                    Bo chon
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
                      <div className="text-[10px] text-gray-500">Uoc tinh giam</div>
                      <div className="font-bold text-sm text-[#1E5C3F]">-{formatVnd(voucherDiscount)}</div>
                    </div>
                  </div>
                </div>
              )}

              {availableVouchers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableVouchers.map((voucher) => (
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
              )}
            </div>
          </section>

          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-[#F5EFE6]/10">
              <div className="w-9 h-9 rounded-xl bg-[#F5EFE6] text-[#F1641E] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-[#222222] text-sm md:text-base">Thong tin van chuyen</h3>
                <p className="text-[11px] text-gray-500">Tac pham se duoc dong goi ky va giao den dia chi ben duoi.</p>
              </div>
            </div>

            <div className="p-5">
              {userAddresses.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-[#222222] text-xs uppercase tracking-wider mb-3">So dia chi cua ban</h4>
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
                              Mac dinh
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
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Dia chi chi tiet</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleAddressChange}
                      placeholder="Vi du: 80/12 Duong Le Loi"
                      className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-full focus:border-[#F1641E] focus:ring-1 focus:ring-[#F1641E]/30 text-xs bg-white focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Quan/Huyen</label>
                  <input
                    type="text"
                    name="district"
                    value={address.district}
                    onChange={handleAddressChange}
                    placeholder="Quan 1"
                    className="w-full h-11 px-4 border border-gray-300 rounded-full focus:border-[#F1641E] focus:ring-1 focus:ring-[#F1641E]/30 text-xs bg-white focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Tinh/Thanh pho</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="TP. Ho Chi Minh"
                    className="w-full h-11 px-4 border border-gray-300 rounded-full focus:border-[#F1641E] focus:ring-1 focus:ring-[#F1641E]/30 text-xs bg-white focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden shadow-sm">
            <h3 className="font-serif font-black text-[#222222] px-5 py-4 border-b border-gray-100 bg-[#F5EFE6]/10 text-base">San pham trong hoa don</h3>
            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                const unitPrice = item.unitPrice || 0;
                return (
                  <article key={item.productId} className="p-4 flex items-center gap-4">
                    <ProductIcon />
                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="font-bold text-[#222222] text-xs md:text-sm line-clamp-1 leading-tight">{item.productName}</h4>
                      <p className="text-xs text-gray-500">So luong: {item.quantity} x {formatVnd(unitPrice)}</p>
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
            <h3 className="font-serif font-black text-[#222222] px-5 py-4 border-b border-gray-100 bg-[#F5EFE6]/10 text-base">Tom tat thanh toan</h3>
            <div className="p-5 space-y-4 text-xs font-semibold text-gray-600">
              <div className="flex justify-between">
                <span>Tam tinh ({itemCount} san pham)</span>
                <span className="font-bold text-gray-800">{formatVnd(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Voucher ap dung</span>
                <span className="text-[#1E5C3F] font-bold">-{formatVnd(voucherDiscount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phi van chuyen</span>
                <span className="text-[#1E5C3F] font-bold">Mien phi</span>
              </div>
              <div className="flex justify-between">
                <span>Phuong thuc ap dung</span>
                <span className="font-bold text-gray-800">{paymentMethod === 'BANK_TRANSFER' ? 'Chuyen khoan VietQR' : 'COD'}</span>
              </div>
              {appliedVoucher && (
                <div className="flex justify-between">
                  <span>Ma voucher</span>
                  <span className="font-bold text-gray-800">{appliedVoucher.code}</span>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-start">
                <span className="font-bold text-[#222222] text-sm">Tong thanh toan</span>
                <div className="text-right">
                  <span className="block text-2xl font-serif font-black text-[#F1641E]">{formatVnd(total)}</span>
                  <span className="text-[10px] text-gray-400 block mt-1">Da bao gom tat ca cac loai phi</span>
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
                {loading ? 'Dang xu ly...' : paymentMethod === 'BANK_TRANSFER' ? 'Tao don hang & den trang thanh toan' : 'Xac nhan dat don COD'}
              </button>

              <Link href="/cart" className="w-full h-11 rounded-full border border-gray-300 flex items-center justify-center font-bold hover:border-[#222222] hover:text-black transition-all text-xs">
                Quay lai gio hang
              </Link>
            </div>
          </section>

          <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl p-5 space-y-4 shadow-sm text-xs text-gray-600">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#1E5C3F] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-800">Thanh toan bao mat</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">Moi giao dich qua VietQR duoc xac minh bao mat tu dong.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-gray-100 pt-3">
              <PackageCheck className="w-5 h-5 text-[#1E5C3F] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-800">Bao dam van chuyen</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">Tac pham se duoc dong goi bang hop giay tai che chong soc chuyen dung.</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
