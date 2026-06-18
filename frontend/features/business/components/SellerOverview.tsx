'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  ArrowRight, 
  AlertTriangle, 
  Plus, 
  Ticket, 
  Settings, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck 
} from 'lucide-react';
import { sellerService, ShopSettings } from '../api/sellerService';
import { Product, Order } from '@/features/shared/types';

export default function SellerOverview() {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setSettings(sellerService.getShopSettings());
        const prodList = await sellerService.getProducts();
        setProducts(prodList);
        const ordList = await sellerService.getOrders();
        setOrders(ordList);
      } catch (err) {
        console.error('Error loading overview data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}đ`;

  // Compute stats
  const totalRevenue = settings?.walletBalance || 0;
  const totalOrdersCount = orders.length;
  const activeProductsCount = products.filter(p => p.stock > 0).length;
  const lowStockProducts = products.filter(p => p.stock >= 0 && p.stock <= 15).slice(0, 3);

  // Status badge style helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-green-200">
            <CheckCircle className="w-3 h-3 text-green-600" />
            Đã giao hàng
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 bg-[#EBF2EE] text-[#1E5C3F] px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#1e5c3f]/25">
            <Clock className="w-3 h-3 text-[#1E5C3F]" />
            Đã thanh toán
          </span>
        );
      case 'SHIPPING':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-blue-200">
            <Truck className="w-3 h-3 text-blue-600" />
            Đang vận chuyển
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-red-200">
            <XCircle className="w-3 h-3 text-red-600" />
            Đã hủy đơn
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-yellow-200">
            <Clock className="w-3 h-3 text-yellow-600" />
            Chờ xác nhận
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-sm font-semibold text-gray-500 bg-white border border-[#EAE3D2]/50 rounded-2xl">
        Đang tải dữ liệu báo cáo kinh doanh...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      {settings && (
        <div className="bg-[#0e4a42] text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-20 -translate-y-20 blur-xl group-hover:scale-110 transition-transform duration-700" />
          <div className="space-y-3 relative z-10 text-left max-w-lg">
            <span className="text-[#FBBF24] font-extrabold text-[10px] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
              Kênh quản lý ShopVN
            </span>
            <h2 className="font-serif text-2.5xl md:text-3.5xl font-black leading-tight">
              Xin chào, {settings.shopName}!
            </h2>
            <p className="text-xs text-gray-200 leading-relaxed font-medium">
              Chào mừng nghệ nhân quay lại hệ thống. Shop của bạn hiện đang vận hành ổn định. Cùng kiểm tra kết quả kinh doanh và chuẩn bị đơn gửi khách hôm nay nhé!
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0 relative z-10 w-full md:w-auto">
            <Link href="/business/products" className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#FDFAF7] hover:bg-white text-[#0e4a42] font-bold text-xs px-5 py-3 rounded-full transition-all shadow-md">
              <Plus className="w-4 h-4" />
              Đăng bán tác phẩm
            </Link>
            <Link href="/business/orders" className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs px-5 py-3 rounded-full transition-all">
              Xử lý đơn hàng
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-[#EAE3D2]/50 p-5 rounded-2xl shadow-sm text-left relative overflow-hidden group hover:border-[#1E5C3F]/30 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Doanh thu tích luỹ</span>
            <span className="p-2 bg-[#EBF2EE] text-[#1E5C3F] rounded-xl group-hover:scale-105 transition-all">
              <TrendingUp className="w-4.5 h-4.5" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">{formatVnd(totalRevenue)}</h3>
            <div className="flex items-center gap-1.5 mt-2 text-[10.5px] text-[#1E5C3F] font-bold">
              <span>+18.4%</span>
              <span className="text-gray-400 font-medium">so với tháng trước</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-[#EAE3D2]/50 p-5 rounded-2xl shadow-sm text-left relative overflow-hidden group hover:border-[#F1641E]/30 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Đơn hàng nhận được</span>
            <span className="p-2 bg-[#FDFAF7] text-[#F1641E] rounded-xl group-hover:scale-105 transition-all">
              <ShoppingBag className="w-4.5 h-4.5" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">{totalOrdersCount} đơn</h3>
            <div className="flex items-center gap-1.5 mt-2 text-[10.5px] text-green-600 font-bold">
              <span>+12.0%</span>
              <span className="text-gray-400 font-medium">tuần này</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-[#EAE3D2]/50 p-5 rounded-2xl shadow-sm text-left relative overflow-hidden group hover:border-[#1E5C3F]/30 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tác phẩm đang bán</span>
            <span className="p-2 bg-[#EBF2EE] text-[#1E5C3F] rounded-xl group-hover:scale-105 transition-all">
              <Users className="w-4.5 h-4.5" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">{activeProductsCount} sản phẩm</h3>
            <div className="flex items-center gap-1.5 mt-2 text-[10.5px] text-gray-500 font-bold">
              <span>98.6%</span>
              <span className="text-gray-400 font-medium">tỷ lệ hiển thị</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-[#EAE3D2]/50 p-5 rounded-2xl shadow-sm text-left relative overflow-hidden group hover:border-[#F1641E]/30 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Đơn hoàn tất</span>
            <span className="p-2 bg-[#FDFAF7] text-[#F1641E] rounded-xl group-hover:scale-105 transition-all">
              <CheckCircle className="w-4.5 h-4.5" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">85.5%</h3>
            <div className="flex items-center gap-1.5 mt-2 text-[10.5px] text-red-500 font-bold">
              <span>1 đơn bị huỷ</span>
              <span className="text-gray-400 font-medium">trong tháng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Side Columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts: Sales revenue over 6 months */}
        <div className="lg:col-span-2 bg-white border border-[#EAE3D2]/50 p-6 rounded-3xl shadow-sm text-left">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-serif font-black text-base text-gray-800">Biểu đồ doanh thu 2026</h3>
              <p className="text-[10px] text-gray-450 mt-0.5">Thống kê theo 6 tháng đầu năm (triệu VNĐ)</p>
            </div>
            <span className="text-[10.5px] bg-[#EBF2EE] text-[#1E5C3F] font-bold px-3 py-1 rounded-full border border-[#1e5c3f]/10">
              Tổng quan năm
            </span>
          </div>

          {/* Simple custom responsive SVG Area/Column chart */}
          <div className="w-full h-64 relative">
            <svg viewBox="0 0 500 220" className="w-full h-full">
              {/* Grid lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#EAE3D2" strokeDasharray="3,3" strokeWidth="0.5" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="#EAE3D2" strokeDasharray="3,3" strokeWidth="0.5" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="#EAE3D2" strokeDasharray="3,3" strokeWidth="0.5" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="#EAE3D2" strokeDasharray="3,3" strokeWidth="0.5" />
              <line x1="40" y1="180" x2="480" y2="180" stroke="#222222" strokeWidth="1" />

              {/* Data points mapping (Month values: Jan=5m, Feb=8m, Mar=12m, Apr=9m, May=18m, Jun=24.8m) */}
              {/* Normalized Y positions: 180 is 0m, 20 is 30m */}
              {/* Coordinates: Jan(80, 150), Feb(150, 130), Mar(220, 100), Apr(290, 120), May(360, 60), Jun(430, 20) */}
              
              {/* Area path */}
              <path 
                d="M 80 180 L 80 150 L 150 130 L 220 100 L 290 120 L 360 60 L 430 20 L 430 180 Z" 
                fill="url(#area-gradient)" 
                opacity="0.25" 
              />

              {/* Area line path */}
              <path 
                d="M 80 150 L 150 130 L 220 100 L 290 120 L 360 60 L 430 20" 
                fill="none" 
                stroke="#1E5C3F" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points */}
              <circle cx="80" cy="150" r="4.5" fill="#1E5C3F" stroke="#FDFAF7" strokeWidth="1.5" />
              <circle cx="150" cy="130" r="4.5" fill="#1E5C3F" stroke="#FDFAF7" strokeWidth="1.5" />
              <circle cx="220" cy="100" r="4.5" fill="#1E5C3F" stroke="#FDFAF7" strokeWidth="1.5" />
              <circle cx="290" cy="120" r="4.5" fill="#1E5C3F" stroke="#FDFAF7" strokeWidth="1.5" />
              <circle cx="360" cy="60" r="4.5" fill="#1E5C3F" stroke="#FDFAF7" strokeWidth="1.5" />
              <circle cx="430" cy="20" r="4.5" fill="#F1641E" stroke="#FDFAF7" strokeWidth="1.5" />

              {/* Value labels */}
              <text x="80" y="140" fontSize="9" fontWeight="bold" fill="#222222" textAnchor="middle">5M</text>
              <text x="150" y="120" fontSize="9" fontWeight="bold" fill="#222222" textAnchor="middle">8M</text>
              <text x="220" y="90" fontSize="9" fontWeight="bold" fill="#222222" textAnchor="middle">12M</text>
              <text x="290" y="110" fontSize="9" fontWeight="bold" fill="#222222" textAnchor="middle">9M</text>
              <text x="360" y="50" fontSize="9" fontWeight="bold" fill="#222222" textAnchor="middle">18M</text>
              <text x="430" y="12" fontSize="9" fontWeight="bold" fill="#F1641E" textAnchor="middle">24.8M</text>

              {/* Month Labels */}
              <text x="80" y="195" fontSize="10" fontWeight="bold" fill="#555555" textAnchor="middle">Tháng 1</text>
              <text x="150" y="195" fontSize="10" fontWeight="bold" fill="#555555" textAnchor="middle">Tháng 2</text>
              <text x="220" y="195" fontSize="10" fontWeight="bold" fill="#555555" textAnchor="middle">Tháng 3</text>
              <text x="290" y="195" fontSize="10" fontWeight="bold" fill="#555555" textAnchor="middle">Tháng 4</text>
              <text x="360" y="195" fontSize="10" fontWeight="bold" fill="#555555" textAnchor="middle">Tháng 5</text>
              <text x="430" y="195" fontSize="10" fontWeight="bold" fill="#555555" textAnchor="middle">Tháng 6</text>

              {/* Definitions */}
              <defs>
                <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E5C3F" />
                  <stop offset="100%" stopColor="#FDFAF7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Side panels: Inventory alerts & Quick Actions */}
        <div className="space-y-6">
          {/* Inventory warning panel */}
          <div className="bg-white border border-[#EAE3D2]/50 p-5 rounded-3xl shadow-sm text-left">
            <h3 className="font-serif font-black text-base text-gray-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Cảnh báo hết hàng</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Vui lòng cập nhật thêm tồn kho sớm</p>

            <div className="mt-4 space-y-3">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2.5 bg-[#FDFAF7] border border-[#EAE3D2]/40 rounded-xl">
                  <div className="min-w-0 flex-grow text-left">
                    <h4 className="font-semibold text-xs text-gray-850 truncate">{p.name}</h4>
                    <span className="text-[9px] text-[#1E5C3F] bg-[#EBF2EE] font-bold px-2 py-0.5 rounded-sm inline-block mt-1">
                      {p.categoryName || 'Tác phẩm'}
                    </span>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="text-xs font-black text-red-500">{p.stock} sản phẩm</span>
                    <Link href="/business/products" className="text-[9.5px] text-[#F1641E] font-bold block hover:underline mt-0.5">
                      Cập nhật +
                    </Link>
                  </div>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <div className="py-8 text-center text-xs text-gray-400 font-semibold">
                  Tồn kho dồi dào, không có cảnh báo!
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white border border-[#EAE3D2]/50 p-5 rounded-3xl shadow-sm text-left">
            <h3 className="font-serif font-black text-base text-gray-800">Lối tắt nhanh</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Quản lý nhanh các chương trình</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link href="/business/products" className="flex flex-col items-center justify-center p-3 border border-gray-150 hover:border-[#F1641E]/40 hover:bg-[#FDFAF7] rounded-2xl transition-all text-center group cursor-pointer">
                <Plus className="w-5 h-5 text-[#F1641E] mb-1.5" />
                <span className="text-[10px] font-bold text-gray-750">Thêm sản phẩm</span>
              </Link>
              <Link href="/business/vouchers" className="flex flex-col items-center justify-center p-3 border border-gray-150 hover:border-[#1E5C3F]/40 hover:bg-[#EBF2EE] rounded-2xl transition-all text-center group cursor-pointer">
                <Ticket className="w-5 h-5 text-[#1E5C3F] mb-1.5" />
                <span className="text-[10px] font-bold text-gray-750">Mã voucher</span>
              </Link>
              <Link href="/business/settings" className="flex flex-col items-center justify-center p-3 border border-gray-150 hover:border-[#222222]/30 hover:bg-[#F5EFE6]/35 rounded-2xl transition-all text-center group cursor-pointer col-span-2">
                <Settings className="w-5 h-5 text-gray-600 mb-1" />
                <span className="text-[10px] font-bold text-gray-755">Cấu hình gian hàng</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-[#EAE3D2]/50 p-6 rounded-3xl shadow-sm text-left">
        <div className="flex justify-between items-center mb-5 border-b border-[#EAE3D2]/40 pb-3">
          <div>
            <h3 className="font-serif font-black text-base text-gray-800">Đơn hàng mới nhận</h3>
            <p className="text-[10px] text-gray-450">Danh sách các đơn hàng chờ vận chuyển hoặc vừa hoàn thành</p>
          </div>
          <Link href="/business/orders" className="text-xs font-bold text-[#F1641E] hover:underline flex items-center gap-1">
            Quản lý đơn hàng
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5EFE6]/30 border-b border-[#EAE3D2]/50 text-gray-600 font-bold">
                <th className="p-3">Mã đơn hàng</th>
                <th className="p-3">Ngày đặt</th>
                <th className="p-3">Sản phẩm mua</th>
                <th className="p-3">Tổng giá trị</th>
                <th className="p-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D2]/35">
              {orders.slice(0, 4).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="p-3 font-mono font-bold text-gray-800">{order.orderNumber || `ORD-${order.id.slice(0, 8)}`}</td>
                  <td className="p-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="p-3 font-medium max-w-[200px] truncate" title={order.items.map(item => item.productName).join(', ')}>
                    {order.items[0]?.productName} {order.items.length > 1 && `và ${order.items.length - 1} món khác`}
                  </td>
                  <td className="p-3 font-bold text-[#F1641E]">{formatVnd(order.totalPrice)}</td>
                  <td className="p-3">{getStatusBadge(order.status)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-gray-400 font-semibold">
                    Gian hàng chưa phát sinh đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
