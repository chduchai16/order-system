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
  Gift,
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
    title: 'Nhẫn bạc đính đá thạch anh tự nhiên + 2 sản phẩm khác',
    itemCount: 4,
    status: 'shipping',
    statusLabel: 'Đang giao hàng',
    total: 1040000,
    date: '12/05/2026',
    iconClassName: 'bg-[#FDFAF2]',
  },
  {
    id: 'ORD-202605-00016',
    title: 'Bát gốm tráng men mờ thủ công Nhật Bản',
    itemCount: 1,
    status: 'completed',
    statusLabel: 'Đã hoàn thành',
    total: 850000,
    date: '08/05/2026',
    iconClassName: 'bg-[#F6F5F2]',
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
    label: 'Văn phòng làm việc',
    street: '456 Nguyễn Huệ, Phường Bến Nghé',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    country: 'Việt Nam',
    isDefault: false,
  },
];

const fallbackWishlist: WishlistItem[] = [
  { id: 1, productId: '1', productName: 'Nhẫn bạc đính đá thạch anh tự nhiên', addedAt: '2026-05-12T00:00:00Z' },
  { id: 2, productId: '2', productName: 'Bát gốm tráng men mờ thủ công Nhật Bản', addedAt: '2026-05-08T00:00:00Z' },
];

const fallbackProfile: UserProfile = {
  id: '1',
  username: 'nguyenthanh',
  email: 'thanh@email.com',
  firstName: 'Nguyễn',
  lastName: 'Thành',
};

const sections: Array<{
  key: SectionKey;
  label: string;
  icon: React.ElementType;
}> = [
  { key: 'overview', label: 'Tổng quan tài khoản', icon: Home },
  { key: 'orders', label: 'Đơn hàng của tôi', icon: Box },
  { key: 'wishlist', label: 'Sản phẩm đã lưu', icon: Heart },
  { key: 'profile', label: 'Hồ sơ cá nhân', icon: User },
  { key: 'addresses', label: 'Địa chỉ nhận hàng', icon: MapPin },
  { key: 'payments', label: 'Cổng thanh toán', icon: CreditCard },
  { key: 'settings', label: 'Cài đặt tài khoản', icon: Settings },
];

const statusStyles: Record<OrderStatus, string> = {
  processing: 'bg-[#EBF2EE] text-[#1E5C3F]',
  shipping: 'bg-orange-50 text-[#F1641E]',
  completed: 'bg-green-55/40 text-green-700',
  cancelled: 'bg-red-50 text-red-650',
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
          ? 'Đã hủy đơn'
          : status === 'shipping'
            ? 'Đang giao hàng'
            : 'Đang chuẩn bị',
    total: order.totalPrice || 0,
    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '',
    iconClassName: index % 2 === 0 ? 'bg-[#FDFAF2]' : 'bg-[#F6F5F2]',
  };
}

function ProductIcon() {
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#F5EFE6]/70 border border-[#EAE3D2]/40">
      <Gift className="h-7 w-7 text-[#F1641E] opacity-75" />
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
  const displayName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.username || 'Nghệ nhân Việt';
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
    <div className="space-y-8 font-sans pb-16">
      {/* Breadcrumbs */}
      <div className="text-xs text-gray-500 flex items-center gap-1.5 py-1">
        <Link href="/" className="hover:text-[#F1641E] transition-colors">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-400 font-semibold">Tài khoản của tôi</span>
      </div>

      {/* Hero Profile Banner Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#EAE3D2]/50 bg-gradient-to-br from-[#F8F2EC] via-white to-[#FDFAF7] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#EBF2EE] rounded-full filter blur-3xl opacity-50 -z-10 translate-x-24 -translate-y-24"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F5EFE6] rounded-full filter blur-3xl opacity-50 -z-10 -translate-x-24 translate-y-24"></div>
        
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1E5C3F] to-[#5A3A22] text-xl md:text-2xl font-serif font-black text-white shadow-md ring-4 ring-white">
            {initials}
          </div>
          <div className="space-y-1">
            <h1 className="font-serif font-black text-2xl md:text-3xl text-gray-900 leading-tight">Chào mừng quay lại, {displayName}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="text-gray-500 font-medium">{profile.email || fallbackProfile.email}</span>
              <span className="text-gray-300">•</span>
              <span className="bg-[#EBF2EE] text-[#1E5C3F] px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
                Khách hàng Thân thiết
              </span>
            </div>
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-650 hover:text-red-650 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm md:shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Đăng xuất</span>
        </button>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Đơn hàng đã mua" value={orders.length} icon={Package} className="bg-orange-50 text-[#F1641E]" />
        <StatCard label="Đang vận chuyển" value={processingOrders} icon={Truck} className="bg-blue-50 text-blue-600" />
        <StatCard label="Đã hoàn thành" value={completedOrders} icon={CheckCircle2} className="bg-[#EBF2EE] text-[#1E5C3F]" />
        <StatCard label="Tổng chi tiêu" value={formatVnd(spending || 1200000)} icon={WalletCards} className="bg-purple-50 text-purple-600" />
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 items-start">
        {/* Navigation Sidebar Card */}
        <aside className="lg:sticky lg:top-24 space-y-2 bg-white border border-[#EAE3D2]/50 rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.01)]">
          <p className="px-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Bảng điều khiển</p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = selectedSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSelectedSection(item.key)}
                  className={`flex h-11 w-full items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-[#F5EFE6] text-[#F1641E]'
                      : 'text-gray-650 hover:bg-[#FDFAF7]'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-[#F1641E]' : 'text-gray-400'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count ? (
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      active ? 'bg-[#F1641E]/15 text-[#F1641E]' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Dynamic Panels */}
        <div className="space-y-6">
          {loading ? (
            <section className="rounded-3xl border border-[#EAE3D2]/50 bg-white p-24 text-center text-xs font-semibold text-gray-400">
              Đang tải dữ liệu hồ sơ...
            </section>
          ) : null}

          {/* Tab: Overview */}
          {!loading && selectedSection === 'overview' ? (
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <Panel title="Đơn hàng gần đây" actionLabel="Xem tất cả" onAction={() => setSelectedSection('orders')}>
                <div className="divide-y divide-gray-100">
                  {orders.slice(0, 3).map((order) => (
                    <OrderRow key={order.id} order={order} compact />
                  ))}
                </div>
              </Panel>

              <div className="space-y-6">
                <Panel title="Thông tin cơ bản">
                  <div className="space-y-3 text-xs">
                    <InfoRow label="Họ và tên" value={displayName} />
                    <InfoRow label="Địa chỉ email" value={profile.email || fallbackProfile.email} />
                    <InfoRow label="Tên đăng nhập" value={profile.username || fallbackProfile.username} />
                  </div>
                </Panel>

                <Panel title="Địa chỉ mặc định" actionLabel="Thay đổi" onAction={() => setSelectedSection('addresses')}>
                  {defaultAddress ? (
                    <div className="rounded-2xl border border-[#EAE3D2]/60 bg-[#FDFAF7] p-4 text-xs text-gray-650 leading-relaxed shadow-inner">
                      <div className="mb-2 font-bold text-gray-800">{defaultAddress.label || 'Địa chỉ mặc định'}</div>
                      <div>{defaultAddress.street}</div>
                      <div>{defaultAddress.district}, {defaultAddress.city}</div>
                      <div>{defaultAddress.country}</div>
                    </div>
                  ) : (
                    <EmptyState title="Chưa có địa chỉ nào" description="Thêm địa chỉ giao nhận của bạn để thanh toán nhanh hơn." />
                  )}
                </Panel>
              </div>
            </div>
          ) : null}

          {/* Tab: Orders List */}
          {!loading && selectedSection === 'orders' ? (
            <Panel title="Lịch sử đơn hàng" subtitle={`Tài khoản của bạn đã mua hàng ${orders.length} lần`}>
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </div>
            </Panel>
          ) : null}

          {/* Tab: Wishlist */}
          {!loading && selectedSection === 'wishlist' ? (
            <Panel title="Đồ đã lưu trữ" subtitle={`Đã lưu ${wishlist.length} sản phẩm`}>
              {wishlist.length === 0 ? (
                <EmptyState title="Danh sách sản phẩm trống" description="Bấm biểu tượng trái tim tại trang chi tiết để lưu lại các tác phẩm bạn thích." />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {wishlist.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-gray-100 bg-white p-4 flex flex-col justify-between group hover:shadow-md transition duration-200">
                      <div>
                        <div className="mb-3.5 flex aspect-[4/3] items-center justify-center rounded-xl bg-[#F5EFE6]/50 border border-gray-50/50">
                          <Heart className="h-8 w-8 text-[#F1641E]" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F1641E]">ShopVN</span>
                        <h3 className="mt-1 font-bold text-xs md:text-sm text-[#222222] line-clamp-2 h-10 group-hover:text-[#F1641E] transition-colors leading-tight">{item.productName}</h3>
                        <p className="mt-1 text-[10px] text-gray-400 font-medium">
                          Đã lưu ngày {new Date(item.addedAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="mt-4 flex gap-2 pt-2 border-t border-gray-55">
                        <Link href={`/products/${item.productId}`} className="inline-flex h-9 flex-1 items-center justify-center rounded-full border border-gray-300 text-xs font-bold hover:border-[#222222] hover:text-black transition-all">
                          Xem chi tiết
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Panel>
          ) : null}

          {/* Tab: Profile form */}
          {!loading && selectedSection === 'profile' ? (
            <Panel title="Thông tin cá nhân" subtitle="Quản lý hồ sơ tài khoản cơ bản dùng khi mua bán và thanh toán">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Họ đệm" value={profileForm.firstName} onChange={(value) => setProfileForm((prev) => ({ ...prev, firstName: value }))} />
                <Field label="Tên gọi" value={profileForm.lastName} onChange={(value) => setProfileForm((prev) => ({ ...prev, lastName: value }))} />
                <Field label="Địa chỉ Email" value={profileForm.email} onChange={(value) => setProfileForm((prev) => ({ ...prev, email: value }))} />
                <Field label="Tên tài khoản (username)" value={profileForm.username} onChange={(value) => setProfileForm((prev) => ({ ...prev, username: value }))} />
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" className="inline-flex h-11 items-center justify-center rounded-full bg-[#F1641E] px-6 font-bold text-xs text-white hover:bg-[#d85213] cursor-pointer transition-colors shadow-sm">
                  Lưu thay đổi hồ sơ
                </button>
                <button type="button" className="inline-flex h-11 items-center justify-center rounded-full border border-gray-300 px-6 font-bold text-xs text-gray-700 hover:border-[#222222] hover:text-black cursor-pointer transition-all">
                  Khôi phục ban đầu
                </button>
              </div>
            </Panel>
          ) : null}

          {/* Tab: Addresses */}
          {!loading && selectedSection === 'addresses' ? (
            <Panel title="Địa chỉ giao nhận" subtitle={`Bạn đang thiết lập lưu trữ ${addresses.length} địa chỉ nhận hàng`}>
              <div className="grid gap-4 xl:grid-cols-2">
                {addresses.map((address) => (
                  <article key={address.id ?? `${address.label}-${address.street}`} className={`rounded-2xl border p-5 flex flex-col justify-between ${address.isDefault ? 'border-[#F1641E] bg-[#FDFAF7]' : 'border-gray-200 bg-white'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="font-bold text-xs md:text-sm text-gray-800">{address.label || 'Địa chỉ'}</h3>
                        <p className="text-xs text-gray-650 leading-relaxed">{address.street}</p>
                        <p className="text-[11px] text-gray-400 font-semibold">{address.district}, {address.city}</p>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{address.country}</p>
                      </div>
                      {address.isDefault ? (
                        <span className="rounded-full bg-[#1E5C3F] px-2.5 py-0.5 text-[9px] font-bold text-white">
                          Mặc định
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-5 flex gap-3 text-[11px] font-bold border-t border-gray-50 pt-3.5">
                      <button type="button" className="text-[#F1641E] hover:underline cursor-pointer">Sửa địa chỉ</button>
                      <button type="button" className="text-gray-500 hover:text-black cursor-pointer">Đặt mặc định</button>
                      <button type="button" className="ml-auto text-red-500 hover:underline cursor-pointer">Xóa</button>
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
          ) : null}

          {/* Tab: Payments */}
          {!loading && selectedSection === 'payments' ? (
            <Panel title="Cổng thanh toán liên kết" subtitle="Quản lý các thông tin và phương thức liên kết giao dịch của bạn">
              <div className="grid gap-4 lg:grid-cols-3">
                <PaymentCard title="Ví điện tử MoMo/ZaloPay" description="Cấu hình ví để hoàn tất giao dịch tự động trong 2 giây." icon={WalletCards} />
                <PaymentCard title="Thẻ ghi nợ / Tín dụng" description="Mã hóa lưu thông tin thẻ Visa, MasterCard an toàn bảo mật." icon={CreditCard} />
                <PaymentCard title="Voucher & Mã giảm giá" description="Quản lý danh sách các mã ưu đãi đặc biệt độc quyền của bạn." icon={Ticket} />
              </div>
            </Panel>
          ) : null}

          {/* Tab: Settings */}
          {!loading && selectedSection === 'settings' ? (
            <Panel title="Cài đặt tài khoản nâng cao" subtitle="Quản lý tùy chỉnh thông tin bảo mật đăng nhập và quyền truy cập dữ liệu">
              <div className="grid gap-4 lg:grid-cols-2">
                <SettingCard icon={ShieldCheck} title="Mật khẩu & Bảo mật" description="Thay đổi mật khẩu đăng nhập định kỳ, tăng cường xác thực 2 lớp." />
                <SettingCard icon={Bell} title="Thiết lập Nhận tin thông báo" description="Đăng ký nhận cập nhật đơn hàng hoặc tin tức khuyến mãi qua Email/SMS." />
                <SettingCard icon={Star} title="Đánh giá tài khoản" description="Lịch sử đánh giá chất lượng sản phẩm và mức độ uy tín của bạn." />
                <SettingCard icon={User} title="Quyền riêng tư dữ liệu" description="Kiểm soát toàn bộ lịch sử truy vấn dữ liệu cá nhân của bạn trên ShopVN." />
              </div>
            </Panel>
          ) : null}
        </div>
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
    <div className="flex items-center gap-4 rounded-3xl border border-[#EAE3D2]/50 bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${className} shrink-0`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <div className="text-xl md:text-2xl font-serif font-black text-[#222222]">{value}</div>
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{label}</div>
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
    <section className="overflow-hidden rounded-3xl border border-[#EAE3D2]/50 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.015)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-5">
        <div>
          <h2 className="font-serif font-black text-gray-900 text-base md:text-lg">{title}</h2>
          {subtitle ? <p className="text-xs text-gray-400 font-medium mt-0.5">{subtitle}</p> : null}
        </div>
        {actionLabel && onAction ? (
          <button 
            type="button" 
            onClick={onAction} 
            className="text-xs font-bold text-[#F1641E] hover:text-[#d85213] hover:underline cursor-pointer transition-colors"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function OrderRow({ order, compact = false }: { order: DisplayOrder; compact?: boolean }) {
  const StatusIcon = statusIcons[order.status];

  return (
    <article className={`flex gap-5 items-start ${
      compact 
        ? 'py-4 first:pt-0 last:pb-0 border-b last:border-0 border-gray-100' 
        : 'rounded-2xl border border-[#EAE3D2]/50 p-5 bg-white hover:border-[#222222]/20 hover:shadow-md transition-all duration-300'
    }`}>
      <ProductIcon />
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-3 md:flex-row md:justify-between items-start">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10.5px] text-gray-400 font-bold">#{order.id}</span>
              <span className="text-gray-300">•</span>
              <span className="text-[11px] text-gray-400 font-bold">{order.date}</span>
            </div>
            
            <h4 className="font-serif font-black text-sm md:text-base text-gray-800 leading-tight truncate">{order.title}</h4>
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-medium">{order.itemCount} sản phẩm</span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-bold ${statusStyles[order.status]}`}>
                <StatusIcon className="h-3.5 w-3.5" />
                {order.statusLabel}
              </span>
            </div>
          </div>
          
          <div className="shrink-0 w-full md:w-auto flex md:flex-col justify-between md:items-end gap-3 pt-2 md:pt-0 border-t md:border-0 border-gray-100">
            <div className="font-serif font-black text-lg text-[#F1641E]">{formatVnd(order.total)}</div>
            {!compact ? (
              <div className="flex gap-2">
                <button type="button" className="rounded-full border border-gray-300 px-4 py-2 text-[11px] font-bold hover:border-[#222222] hover:bg-gray-50 transition-all cursor-pointer">
                  Theo dõi vận đơn
                </button>
                <button type="button" className="rounded-full bg-[#222222] hover:bg-[#F1641E] px-4 py-2 text-[11px] font-bold text-white transition-all cursor-pointer">
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
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-[#FDFAF7] px-5 py-3.5 text-xs shadow-inner">
      <span className="text-gray-500 font-bold">{label}</span>
      <span className="font-serif font-black text-gray-800">{value}</span>
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
    <label className="block space-y-2">
      <span className="block text-xs font-bold text-gray-650 uppercase tracking-wider">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-gray-350 px-4 text-xs focus:border-[#F1641E] focus:outline-none focus:ring-4 focus:ring-[#F1641E]/10 bg-white transition-all duration-200"
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
    <article className="rounded-3xl border border-[#EAE3D2]/60 bg-white p-6 flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5EFE6] text-[#F1641E] shadow-sm border border-[#EAE3D2]/40">
          <Icon className="h-5.5 w-5.5" />
        </div>
        <h4 className="font-serif font-black text-sm text-gray-900 leading-snug">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
      <button type="button" className="mt-5 text-xs font-bold text-[#F1641E] hover:text-[#d85213] hover:underline text-left cursor-pointer transition-colors">
        Thiết lập cấu hình
      </button>
    </article>
  );
}

// REST OF FILE (redefined SettingCard and EmptyState unchanged)
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
    <article className="rounded-3xl border border-gray-100 bg-white p-6 flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.015)] hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-50 border border-gray-150 text-gray-550 shadow-sm">
          <Icon className="h-5.5 w-5.5" />
        </div>
        <h4 className="font-serif font-black text-sm text-gray-900 leading-snug">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
      <button type="button" className="mt-5 text-xs font-bold text-[#F1641E] hover:text-[#d85213] hover:underline text-left cursor-pointer transition-colors">
        Quản lý thiết lập
      </button>
    </article>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center space-y-1 shadow-inner">
      <div className="font-bold text-xs md:text-sm text-gray-700">{title}</div>
      <p className="text-xs text-gray-400 font-medium">{description}</p>
    </div>
  );
}
