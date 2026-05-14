'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  CheckCircle2,
  CreditCard,
  Gift,
  Heart,
  Home,
  LogOut,
  MapPin,
  MessageCircle,
  Package,
  Settings,
  Star,
  Ticket,
  Truck,
  User,
  WalletCards,
  X,
} from 'lucide-react';
import { orderService } from '@/features/orders/api/orderService';
import { userService } from '@/features/account/api/userService';
import { Address, Order } from '@/features/shared/types';

type OrderStatus = 'processing' | 'shipping' | 'completed' | 'cancelled';

interface DisplayOrder {
  id: string;
  title: string;
  itemCount: number;
  status: OrderStatus;
  statusLabel: string;
  total: number;
  date: string;
  iconClassName: string;
}

const fallbackOrders: DisplayOrder[] = [
  {
    id: 'DH-20250512-001',
    title: 'Tai nghe Sony Pro X1 + 2 sản phẩm khác',
    itemCount: 4,
    status: 'shipping',
    statusLabel: 'Đang giao hàng',
    total: 1040000,
    date: '12/05/2025',
    iconClassName: 'bg-[#dff1ff] text-blue-500',
  },
  {
    id: 'DH-20250508-002',
    title: 'Samsung Galaxy Watch 6 44mm Graphite',
    itemCount: 1,
    status: 'completed',
    statusLabel: 'Đã hoàn thành',
    total: 850000,
    date: '08/05/2025',
    iconClassName: 'bg-pink-100 text-purple-500',
  },
  {
    id: 'DH-20250501-003',
    title: 'Áo thun Uniqlo x 2',
    itemCount: 2,
    status: 'processing',
    statusLabel: 'Đang xử lý',
    total: 240000,
    date: '01/05/2025',
    iconClassName: 'bg-green-100 text-green-600',
  },
  {
    id: 'DH-20250420-004',
    title: 'Balo laptop 15.6 inch cao cấp',
    itemCount: 1,
    status: 'cancelled',
    statusLabel: 'Đã hủy',
    total: 350000,
    date: '20/04/2025',
    iconClassName: 'bg-yellow-100 text-yellow-600',
  },
];

const fallbackAddresses: Address[] = [
  {
    id: 1,
    label: 'Nhà riêng',
    street: '123 Đường Lê Lợi, Phường Bến Nghé',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    country: 'Việt Nam',
    isDefault: true,
  },
  {
    id: 2,
    label: 'Văn phòng',
    street: '456 Nguyễn Huệ, Phường Bến Nghé',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    country: 'Việt Nam',
    isDefault: false,
  },
];

const navItems = [
  { label: 'Tổng quan', icon: Home },
  { label: 'Đơn hàng của tôi', icon: Box, active: true, count: 12 },
  { label: 'Sản phẩm yêu thích', icon: Heart, count: 8 },
  { label: 'Đánh giá của tôi', icon: Star, count: 5 },
  { label: 'Thông tin cá nhân', icon: User },
  { label: 'Địa chỉ giao hàng', icon: MapPin },
  { label: 'Phương thức thanh toán', icon: CreditCard },
  { label: 'Mã giảm giá', icon: Ticket, count: 3 },
  { label: 'Cài đặt tài khoản', icon: Settings },
];

const tabs = ['Tất cả', 'Đang xử lý', 'Đang giao', 'Hoàn thành'];

const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}đ`;
const normalizePrice = (price: number) => (price >= 10000 ? price : price * 25000);

const statusStyles: Record<OrderStatus, string> = {
  processing: 'bg-blue-50 text-blue-600',
  shipping: 'bg-orange-50 text-[#ff6600]',
  completed: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-600',
};

const statusIcons: Record<OrderStatus, React.ElementType> = {
  processing: Truck,
  shipping: Truck,
  completed: CheckCircle2,
  cancelled: X,
};

function mapOrder(order: Order, index: number): DisplayOrder {
  const normalizedStatus = order.status?.toUpperCase();
  const status: OrderStatus =
    normalizedStatus === 'COMPLETED'
      ? 'completed'
      : normalizedStatus === 'CANCELLED'
        ? 'cancelled'
        : normalizedStatus === 'PAID' || normalizedStatus === 'STOCK_RESERVED'
          ? 'shipping'
          : 'processing';

  return {
    id: order.orderNumber || String(order.id),
    title: order.items?.map((item) => item.productName).join(' + ') || `Đơn hàng #${order.id}`,
    itemCount: order.items?.reduce((count, item) => count + (item.quantity || 0), 0) || order.items?.length || 1,
    status,
    statusLabel:
      status === 'completed'
        ? 'Đã hoàn thành'
        : status === 'cancelled'
          ? 'Đã hủy'
          : status === 'shipping'
            ? 'Đang giao hàng'
            : 'Đang xử lý',
    total: normalizePrice(order.totalPrice || 0),
    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '',
    iconClassName: ['bg-[#dff1ff] text-blue-500', 'bg-pink-100 text-purple-500', 'bg-green-100 text-green-600', 'bg-yellow-100 text-yellow-600'][index % 4],
  };
}

function ProductIcon({ className }: { className: string }) {
  return (
    <div className={`w-16 h-16 rounded-md flex items-center justify-center shrink-0 ${className}`}>
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1c-1.657 0-3-1.343-3-3v-2c0-1.657 1.343-3 3-3h3v8z" />
        <path d="M3 19a2 2 0 0 0 2 2h1c1.657 0 3-1.343 3-3v-2c0-1.657-1.343-3-3-3H3v8z" />
      </svg>
    </div>
  );
}

export default function AccountOrdersView() {
  const [orders, setOrders] = useState<DisplayOrder[]>(fallbackOrders);
  const [addresses, setAddresses] = useState<Address[]>(fallbackAddresses);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const [orderData, addressData] = await Promise.allSettled([
          orderService.getMyOrders(),
          userService.getAddresses(),
        ]);

        if (orderData.status === 'fulfilled' && orderData.value.length > 0) {
          setOrders(orderData.value.map(mapOrder));
        }

        if (addressData.status === 'fulfilled' && addressData.value.length > 0) {
          setAddresses(addressData.value);
        }
      } catch (err) {
        console.error('Fetch account data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Tổng đơn hàng', value: orders.length || 12, icon: Package, className: 'bg-orange-50 text-[#ff6600]' },
      { label: 'Đang xử lý', value: orders.filter((order) => order.status === 'processing').length || 2, icon: Truck, className: 'bg-blue-50 text-blue-600' },
      { label: 'Đã hoàn thành', value: orders.filter((order) => order.status === 'completed').length || 9, icon: CheckCircle2, className: 'bg-green-50 text-green-600' },
      { label: 'Tổng chi tiêu', value: '1.2tr', icon: WalletCards, className: 'bg-purple-50 text-purple-600' },
    ],
    [orders]
  );

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200 text-sm text-gray-600">
        <Link href="/" className="hover:text-[#ff6600]">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-[#ff6600] font-semibold">Tài khoản của tôi</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-gray-200 bg-white">
          <div className="px-6 py-7 text-center border-b border-gray-200">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#d68a45] to-[#5b321f] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3">
              NT
            </div>
            <h2 className="font-bold text-gray-950">Nguyễn Thành</h2>
            <p className="text-sm text-gray-600">thanh@email.com</p>
            <span className="inline-flex mt-2 px-2 py-1 rounded bg-orange-50 text-[#ff6600] text-xs font-bold">
              Thành viên Vàng
            </span>
          </div>

          <nav className="py-3">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`w-full h-12 px-5 flex items-center gap-3 text-sm border-l-2 ${
                    item.active
                      ? 'border-[#ff6600] bg-orange-50 text-[#ff6600] font-bold'
                      : 'border-transparent text-gray-700 hover:bg-gray-50'
                  } ${index === 4 || index === 8 ? 'border-t border-t-gray-200 mt-2 pt-2 h-14' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count && <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#ff6600] text-xs">{item.count}</span>}
                </button>
              );
            })}
            <button type="button" className="w-full h-12 px-5 flex items-center gap-3 text-sm text-red-500 hover:bg-red-50">
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </nav>
        </aside>

        <main className="bg-[#faf8f3] p-6 space-y-5">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center ${stat.className}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-950">{stat.value}</div>
                    <div className="text-sm text-gray-700 leading-tight">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
              <h1 className="font-bold text-gray-950">Đơn hàng của tôi</h1>
              <div className="flex items-center gap-2">
                {tabs.map((tab, index) => (
                  <button
                    key={tab}
                    type="button"
                    className={`px-3 py-1.5 rounded-md text-sm font-semibold ${
                      index === 0 ? 'bg-orange-50 text-[#ff6600]' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">Đang tải dữ liệu tài khoản...</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const StatusIcon = statusIcons[order.status];
                  return (
                    <article key={order.id} className="p-5 flex gap-4">
                      <ProductIcon className={order.iconClassName} />
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xs text-gray-700 font-mono">#{order.id}</p>
                            <h2 className="font-bold text-gray-950 leading-tight line-clamp-2">{order.title}</h2>
                            <p className="text-sm text-gray-700 mt-1">{order.itemCount} sản phẩm</p>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold mt-2 ${statusStyles[order.status]}`}>
                              <StatusIcon className="w-3 h-3" />
                              {order.statusLabel}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-bold text-[#ff6600]">{formatVnd(order.total)}</div>
                            <div className="text-xs text-gray-600">{order.date}</div>
                            <div className="flex gap-2 mt-4 justify-end">
                              <button type="button" className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-semibold hover:border-[#ff6600] hover:text-[#ff6600]">
                                {order.status === 'completed' ? 'Mua lại' : order.status === 'processing' ? 'Hủy đơn' : 'Theo dõi'}
                              </button>
                              <button type="button" className="px-3 py-1.5 rounded-md bg-[#ff6600] text-white text-sm font-semibold hover:bg-orange-600">
                                {order.status === 'completed' ? 'Đánh giá' : order.status === 'cancelled' ? 'Mua lại' : 'Chi tiết'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-gray-950">Địa chỉ giao hàng</h2>
              <button type="button" className="text-sm font-semibold text-[#ff6600] hover:underline">+ Thêm địa chỉ</button>
            </div>
            <div className="p-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div key={address.id ?? address.label} className={`border rounded-lg p-4 ${address.isDefault ? 'border-[#ff6600]' : 'border-gray-300'}`}>
                  <div className="flex justify-between gap-3">
                    <h3 className="font-bold text-gray-950">{address.label || 'Địa chỉ'}</h3>
                    {address.isDefault && <span className="px-2 py-0.5 rounded bg-[#ff6600] text-white text-xs font-bold">Mặc định</span>}
                  </div>
                  <p className="text-sm text-gray-700 mt-1">0901 234 567</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {address.street}, {address.district}, {address.city}
                  </p>
                  <div className="flex gap-3 mt-3">
                    <button type="button" className="text-sm text-[#ff6600] font-semibold hover:underline">Sửa</button>
                    <button type="button" className="text-sm text-red-500 font-semibold hover:underline">Xóa</button>
                  </div>
                </div>
              ))}

              <button type="button" className="min-h-24 border border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2 text-gray-700 hover:border-[#ff6600] hover:text-[#ff6600]">
                <MessageCircle className="w-4 h-4" />
                Thêm địa chỉ mới
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
