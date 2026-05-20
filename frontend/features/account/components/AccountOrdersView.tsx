'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Box,
  CheckCircle2,
  CreditCard,
  Heart,
  Home,
  LogOut,
  MapPin,
  Package,
  Settings,
  ShieldCheck,
  Star,
  Ticket,
  Truck,
  User,
  WalletCards,
  X,
} from 'lucide-react';
import { orderService } from '@/features/orders/api/orderService';
import { userService } from '@/features/account/api/userService';
import { tokenStore } from '@/features/shared/api/tokenStore';
import { Address, Order, User as UserProfile, WishlistItem } from '@/features/shared/types';

type SectionKey = 'overview' | 'orders' | 'wishlist' | 'profile' | 'addresses' | 'payments' | 'settings';
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
    id: 'ORD-202605-00021',
    title: 'Tai nghe Sony Pro X1 + 2 sản phẩm khác',
    itemCount: 4,
    status: 'shipping',
    statusLabel: 'Đang giao hàng',
    total: 1040000,
    date: '12/05/2026',
    iconClassName: 'bg-[#dff1ff] text-blue-500',
  },
  {
    id: 'ORD-202605-00016',
    title: 'Samsung Galaxy Watch 6 44mm Graphite',
    itemCount: 1,
    status: 'completed',
    statusLabel: 'Đã hoàn thành',
    total: 850000,
    date: '08/05/2026',
    iconClassName: 'bg-pink-100 text-purple-500',
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

const fallbackWishlist: WishlistItem[] = [
  { id: 1, productId: '1', productName: 'Tai nghe Bluetooth Sony Pro X1', addedAt: '2026-05-12T00:00:00Z' },
  { id: 2, productId: '2', productName: 'Samsung Galaxy Watch 6 Graphite', addedAt: '2026-05-08T00:00:00Z' },
];

const fallbackProfile: UserProfile = {
  id: '1',
  username: 'nguyenthanh',
  email: 'thanh@email.com',
  firstName: 'Nguyễn',
  lastName: 'Thành',
};

const visualStyles = ['bg-[#dff1ff] text-blue-500', 'bg-pink-100 text-purple-500', 'bg-green-100 text-green-600', 'bg-yellow-100 text-yellow-600'];

const sections: Array<{
  key: SectionKey;
  label: string;
  icon: React.ElementType;
}> = [
  { key: 'overview', label: 'Tổng quan', icon: Home },
  { key: 'orders', label: 'Đơn hàng của tôi', icon: Box },
  { key: 'wishlist', label: 'Sản phẩm yêu thích', icon: Heart },
  { key: 'profile', label: 'Thông tin cá nhân', icon: User },
  { key: 'addresses', label: 'Địa chỉ giao hàng', icon: MapPin },
  { key: 'payments', label: 'Phương thức thanh toán', icon: CreditCard },
  { key: 'settings', label: 'Cài đặt tài khoản', icon: Settings },
];

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

const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}đ`;

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
    total: order.totalPrice || 0,
    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '',
    iconClassName: visualStyles[index % visualStyles.length],
  };
}

function ProductIcon({ className }: { className: string }) {
  return (
    <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-md ${className}`}>
      <Package className="h-8 w-8" />
    </div>
  );
}

export default function AccountOrdersView() {
  const [selectedSection, setSelectedSection] = useState<SectionKey>('overview');
  const [orders, setOrders] = useState<DisplayOrder[]>(fallbackOrders);
  const [addresses, setAddresses] = useState<Address[]>(fallbackAddresses);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(fallbackWishlist);
  const [profile, setProfile] = useState<UserProfile>(fallbackProfile);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    firstName: fallbackProfile.firstName,
    lastName: fallbackProfile.lastName,
    email: fallbackProfile.email,
    username: fallbackProfile.username,
  });

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const [profileData, orderData, addressData, wishlistData] = await Promise.allSettled([
          userService.getProfile(),
          orderService.getMyOrders(),
          userService.getAddresses(),
          userService.getWishlist(),
        ]);

        if (profileData.status === 'fulfilled') {
          setProfile(profileData.value);
          setProfileForm({
            firstName: profileData.value.firstName || '',
            lastName: profileData.value.lastName || '',
            email: profileData.value.email || '',
            username: profileData.value.username || '',
          });
        }

        if (orderData.status === 'fulfilled' && orderData.value.length > 0) {
          setOrders(orderData.value.map(mapOrder));
        }

        if (addressData.status === 'fulfilled' && addressData.value.length > 0) {
          setAddresses(addressData.value);
        }

        if (wishlistData.status === 'fulfilled' && wishlistData.value.length > 0) {
          setWishlist(wishlistData.value);
        }
      } catch (error) {
        console.error('Fetch account data error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  const spending = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);
  const completedOrders = useMemo(() => orders.filter((order) => order.status === 'completed').length, [orders]);
  const processingOrders = useMemo(() => orders.filter((order) => order.status === 'processing' || order.status === 'shipping').length, [orders]);
  const defaultAddress = addresses.find((address) => address.isDefault) || addresses[0];
  const displayName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.username || 'Khách hàng';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'US';

  const navItems = useMemo(
    () =>
      sections.map((section) => ({
        ...section,
        count:
          section.key === 'orders'
            ? orders.length
            : section.key === 'wishlist'
              ? wishlist.length
              : section.key === 'addresses'
                ? addresses.length
                : undefined,
      })),
    [addresses.length, orders.length, wishlist.length]
  );

  const handleLogout = () => {
    tokenStore.clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-5 py-3 text-sm text-gray-600">
        <Link href="/" className="hover:text-[#ff6600]">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-[#ff6600]">Tài khoản của tôi</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-7 text-center">
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#d68a45] to-[#5b321f] text-2xl font-bold text-white">
              {initials}
            </div>
            <h2 className="font-bold text-gray-950">{displayName}</h2>
            <p className="text-sm text-gray-600">{profile.email || fallbackProfile.email}</p>
            <span className="mt-2 inline-flex rounded bg-orange-50 px-2 py-1 text-xs font-bold text-[#ff6600]">
              Thành viên vàng
            </span>
          </div>

          <nav className="py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = selectedSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSelectedSection(item.key)}
                  className={`flex h-12 w-full items-center gap-3 border-l-2 px-5 text-sm ${
                    active
                      ? 'border-[#ff6600] bg-orange-50 font-bold text-[#ff6600]'
                      : 'border-transparent text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count ? <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-[#ff6600]">{item.count}</span> : null}
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              className="flex h-12 w-full items-center gap-3 px-5 text-sm text-red-500 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </nav>
        </aside>

        <main className="space-y-5 bg-[#faf8f3] p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Tổng đơn hàng" value={orders.length} icon={Package} className="bg-orange-50 text-[#ff6600]" />
            <StatCard label="Đang xử lý" value={processingOrders} icon={Truck} className="bg-blue-50 text-blue-600" />
            <StatCard label="Đã hoàn thành" value={completedOrders} icon={CheckCircle2} className="bg-green-50 text-green-600" />
            <StatCard label="Tổng chi tiêu" value={formatVnd(spending || 1200000)} icon={WalletCards} className="bg-purple-50 text-purple-600" />
          </div>

          {loading ? (
            <section className="rounded-lg border border-gray-200 bg-white p-10 text-center text-gray-500">
              Đang tải dữ liệu tài khoản...
            </section>
          ) : null}

          {!loading && selectedSection === 'overview' ? (
            <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <Panel title="Đơn hàng gần đây" actionLabel="Xem tất cả" onAction={() => setSelectedSection('orders')}>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <OrderRow key={order.id} order={order} compact />
                  ))}
                </div>
              </Panel>

              <div className="space-y-5">
                <Panel title="Thông tin cá nhân">
                  <div className="space-y-3 text-sm">
                    <InfoRow label="Họ tên" value={displayName} />
                    <InfoRow label="Email" value={profile.email || fallbackProfile.email} />
                    <InfoRow label="Tài khoản" value={profile.username || fallbackProfile.username} />
                  </div>
                </Panel>

                <Panel title="Địa chỉ mặc định" actionLabel="Quản lý" onAction={() => setSelectedSection('addresses')}>
                  {defaultAddress ? (
                    <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-4 text-sm text-gray-700">
                      <div className="mb-2 font-bold text-gray-950">{defaultAddress.label || 'Địa chỉ mặc định'}</div>
                      <div>{defaultAddress.street}</div>
                      <div>{defaultAddress.district}, {defaultAddress.city}</div>
                      <div>{defaultAddress.country}</div>
                    </div>
                  ) : (
                    <EmptyState title="Chưa có địa chỉ" description="Thêm địa chỉ giao hàng để đặt hàng nhanh hơn." />
                  )}
                </Panel>
              </div>
            </div>
          ) : null}

          {!loading && selectedSection === 'orders' ? (
            <Panel title="Đơn hàng của tôi" subtitle={`Có ${orders.length} đơn hàng trong tài khoản của bạn`}>
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </div>
            </Panel>
          ) : null}

          {!loading && selectedSection === 'wishlist' ? (
            <Panel title="Sản phẩm yêu thích" subtitle={`Đã lưu ${wishlist.length} sản phẩm`}>
              {wishlist.length === 0 ? (
                <EmptyState title="Danh sách yêu thích trống" description="Nhấn biểu tượng trái tim tại trang sản phẩm để lưu lại." />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {wishlist.map((item, index) => (
                    <article key={item.id} className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className={`mb-4 flex aspect-[4/3] items-center justify-center rounded-lg ${visualStyles[index % visualStyles.length]}`}>
                        <Heart className="h-10 w-10" />
                      </div>
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff6600]">Wishlist</div>
                      <h3 className="mt-2 font-bold text-gray-950">{item.productName}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Thêm ngày {new Date(item.addedAt).toLocaleDateString('vi-VN')}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Link href={`/products/${item.productId}`} className="inline-flex h-10 flex-1 items-center justify-center rounded-md border border-gray-300 text-sm font-semibold hover:border-[#ff6600] hover:text-[#ff6600]">
                          Xem sản phẩm
                        </Link>
                        <button type="button" className="inline-flex h-10 items-center justify-center rounded-md bg-[#ff6600] px-4 text-sm font-semibold text-white hover:bg-orange-600">
                          Thêm giỏ
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Panel>
          ) : null}

          {!loading && selectedSection === 'profile' ? (
            <Panel title="Thông tin cá nhân" subtitle="Cập nhật hồ sơ cơ bản dùng cho mua hàng và chăm sóc khách hàng">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Họ" value={profileForm.firstName} onChange={(value) => setProfileForm((prev) => ({ ...prev, firstName: value }))} />
                <Field label="Tên" value={profileForm.lastName} onChange={(value) => setProfileForm((prev) => ({ ...prev, lastName: value }))} />
                <Field label="Email" value={profileForm.email} onChange={(value) => setProfileForm((prev) => ({ ...prev, email: value }))} />
                <Field label="Tên đăng nhập" value={profileForm.username} onChange={(value) => setProfileForm((prev) => ({ ...prev, username: value }))} />
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" className="inline-flex h-11 items-center justify-center rounded-md bg-[#ff6600] px-5 font-bold text-white hover:bg-orange-600">
                  Lưu thay đổi
                </button>
                <button type="button" className="inline-flex h-11 items-center justify-center rounded-md border border-gray-300 px-5 font-bold text-gray-700 hover:border-[#ff6600] hover:text-[#ff6600]">
                  Khôi phục
                </button>
              </div>
            </Panel>
          ) : null}

          {!loading && selectedSection === 'addresses' ? (
            <Panel title="Địa chỉ giao hàng" subtitle={`Bạn đang có ${addresses.length} địa chỉ đã lưu`}>
              <div className="grid gap-4 xl:grid-cols-2">
                {addresses.map((address) => (
                  <article key={address.id ?? `${address.label}-${address.street}`} className={`rounded-lg border p-4 ${address.isDefault ? 'border-[#ff6600] bg-orange-50/50' : 'border-gray-200 bg-white'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-950">{address.label || 'Địa chỉ'}</h3>
                        <p className="mt-1 text-sm text-gray-700">{address.street}</p>
                        <p className="text-sm text-gray-700">{address.district}, {address.city}</p>
                        <p className="text-sm text-gray-700">{address.country}</p>
                      </div>
                      {address.isDefault ? <span className="rounded bg-[#ff6600] px-2 py-1 text-xs font-bold text-white">Mặc định</span> : null}
                    </div>
                    <div className="mt-4 flex gap-3 text-sm font-semibold">
                      <button type="button" className="text-[#ff6600] hover:underline">Sửa</button>
                      <button type="button" className="text-gray-700 hover:text-[#ff6600]">Đặt mặc định</button>
                      <button type="button" className="ml-auto text-red-500 hover:underline">Xóa</button>
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
          ) : null}

          {!loading && selectedSection === 'payments' ? (
            <Panel title="Phương thức thanh toán" subtitle="Quản lý các lựa chọn thanh toán bạn dùng thường xuyên">
              <div className="grid gap-4 lg:grid-cols-3">
                <PaymentCard title="Ví điện tử" description="Liên kết ví để thanh toán nhanh hơn ở bước checkout." icon={WalletCards} />
                <PaymentCard title="Thẻ ngân hàng" description="Lưu thẻ an toàn cho các đơn hàng tiếp theo." icon={CreditCard} />
                <PaymentCard title="Mã giảm giá" description="Theo dõi coupon và ưu đãi còn hiệu lực trong tài khoản." icon={Ticket} />
              </div>
            </Panel>
          ) : null}

          {!loading && selectedSection === 'settings' ? (
            <Panel title="Cài đặt tài khoản" subtitle="Tùy chỉnh bảo mật, thông báo và quyền riêng tư">
              <div className="grid gap-4 lg:grid-cols-2">
                <SettingCard icon={ShieldCheck} title="Bảo mật đăng nhập" description="Đổi mật khẩu, kiểm tra phiên đăng nhập và tăng cường bảo vệ tài khoản." />
                <SettingCard icon={Bell} title="Thông báo" description="Nhận cập nhật về trạng thái đơn hàng, ưu đãi và thay đổi từ hệ thống." />
                <SettingCard icon={Star} title="Đánh giá & phản hồi" description="Quản lý lịch sử đánh giá và chất lượng phản hồi của bạn." />
                <SettingCard icon={User} title="Quyền riêng tư" description="Kiểm soát dữ liệu cá nhân được sử dụng trong mua sắm và chăm sóc khách hàng." />
              </div>
            </Panel>
          ) : null}
        </main>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  className: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-md ${className}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-950">{value}</div>
        <div className="text-sm leading-tight text-gray-700">{label}</div>
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
        <div>
          <h2 className="font-bold text-gray-950">{title}</h2>
          {subtitle ? <p className="text-sm text-gray-600">{subtitle}</p> : null}
        </div>
        {actionLabel && onAction ? (
          <button type="button" onClick={onAction} className="text-sm font-semibold text-[#ff6600] hover:underline">
            {actionLabel}
          </button>
        ) : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function OrderRow({ order, compact = false }: { order: DisplayOrder; compact?: boolean }) {
  const StatusIcon = statusIcons[order.status];

  return (
    <article className={`flex gap-4 ${compact ? '' : 'rounded-lg border border-gray-200 p-4'}`}>
      <ProductIcon className={order.iconClassName} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-xs text-gray-700">#{order.id}</p>
            <h3 className="line-clamp-2 font-bold text-gray-950">{order.title}</h3>
            <p className="mt-1 text-sm text-gray-700">{order.itemCount} sản phẩm</p>
            <span className={`mt-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-bold ${statusStyles[order.status]}`}>
              <StatusIcon className="h-3 w-3" />
              {order.statusLabel}
            </span>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-bold text-[#ff6600]">{formatVnd(order.total)}</div>
            <div className="text-xs text-gray-600">{order.date}</div>
            {!compact ? (
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-semibold hover:border-[#ff6600] hover:text-[#ff6600]">
                  Theo dõi
                </button>
                <button type="button" className="rounded-md bg-[#ff6600] px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600">
                  Chi tiết
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-950">{value}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-gray-900">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-gray-300 px-4 text-sm focus:border-[#ff6600] focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}

function PaymentCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <article className="rounded-lg border border-gray-200 bg-gray-50 p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-orange-50 text-[#ff6600]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-bold text-gray-950">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
      <button type="button" className="mt-4 text-sm font-semibold text-[#ff6600] hover:underline">
        Cấu hình
      </button>
    </article>
  );
}

function SettingCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-gray-100 text-gray-800">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-bold text-gray-950">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
      <button type="button" className="mt-4 text-sm font-semibold text-[#ff6600] hover:underline">
        Quản lý
      </button>
    </article>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <div className="font-bold text-gray-950">{title}</div>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}
