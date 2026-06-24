'use client';

import { useState, useEffect, useMemo } from 'react';
import { Order } from '@/components/types';
import { orderService } from '@/features/order/api';
import { sellerSettingsService } from '../api/settings';
import { 
  Search, 
  Eye, 
  Truck, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Calendar, 
  User, 
  X, 
  AlertCircle 
} from 'lucide-react';

export default function SellerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'PAID' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'>('ALL');
  
  // Selected order details modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Ship form modal
  const [shippingOrderId, setShippingOrderId] = useState<string | null>(null);
  const [carrier, setCarrier] = useState('GHN');
  const [trackingNumber, setTrackingNumber] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getSellerOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, []);

  const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}đ`;

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        const orderIdStr = o.orderNumber || `ORD-${o.id}`;
        const matchesSearch = orderIdStr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (o.shippingAddress?.street.toLowerCase().includes(searchQuery.toLowerCase())) ||
                              (o.shippingAddress?.city.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesStatus = activeTab === 'ALL' || o.status === activeTab;
        
        return matchesSearch && matchesStatus;
      })
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  }, [orders, searchQuery, activeTab]);

  // Tab configurations
  const tabs = [
    { key: 'ALL', label: 'Tất cả đơn' },
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'PAID', label: 'Đã thanh toán' },
    { key: 'SHIPPING', label: 'Đang vận chuyển' },
    { key: 'DELIVERED', label: 'Đã giao' },
    { key: 'CANCELLED', label: 'Đã huỷ' },
  ] as const;

  // Status Badge UI helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-[10px] font-bold">Đã giao</span>;
      case 'PAID':
        return <span className="bg-[#FFF2EB] text-[#F1641E] border border-[#F1641E]/20 px-2.5 py-1 rounded-full text-[10px] font-bold">Đã thanh toán</span>;
      case 'SHIPPING':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-[10px] font-bold">Đang giao</span>;
      case 'CANCELLED':
        return <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-[10px] font-bold">Đã huỷ</span>;
      default:
        return <span className="bg-yellow-50 text-yellow-750 border border-yellow-250 px-2.5 py-1 rounded-full text-[10px] font-bold">Chờ xác nhận</span>;
    }
  };

  // Ship order handler
  const handleOpenShipModal = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShippingOrderId(orderId);
    setCarrier('GHN');
    // Generate a pseudo-random tracking number based on the order ID to avoid Date.now() in render
    const suffix = orderId.toString().replace(/\D/g, '').slice(-6).padStart(6, '0');
    setTrackingNumber(`GHN-${suffix}`);
  };

  const handleConfirmShip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingOrderId) return;
    if (!trackingNumber.trim()) return alert('Vui lòng điền mã vận đơn');

    try {
      await orderService.updateOrderStatus(shippingOrderId, 'SHIPPING', carrier, trackingNumber);
      setShippingOrderId(null);
      
      // Update selected order view if it's currently open
      if (selectedOrder && selectedOrder.id === shippingOrderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: 'SHIPPING',
          shippingInfo: {
            ...selectedOrder.shippingInfo,
            carrier,
            trackingNumber,
            shippingFee: selectedOrder.shippingInfo?.shippingFee || 30000,
          }
        });
      }

      await fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Không thể cập nhật vận chuyển');
    }
  };

  // Mark Delivered handler
  const handleMarkDelivered = async (orderId: string, amount: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Đánh dấu đơn hàng này đã giao thành công và hoàn thành giao dịch?')) return;
    try {
      await orderService.updateOrderStatus(orderId, 'DELIVERED');
      
      // Increment shop wallet balance (mock payout)
      const currentSettings = sellerSettingsService.getShopSettings();
      sellerSettingsService.updateShopSettings({
        walletBalance: currentSettings.walletBalance + amount
      });
      // Dispatch setting update event
      window.dispatchEvent(new Event('shop_settings_updated'));

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: 'DELIVERED'
        });
      }

      await fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Không thể cập nhật trạng thái');
    }
  };

  // Cancel order handler
  const handleCancelOrder = async (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const reason = prompt('Vui lòng nhập lý do huỷ đơn hàng:');
    if (reason === null) return; // cancel clicked
    if (!reason.trim()) return alert('Lý do huỷ không được bỏ trống');

    try {
      await orderService.updateOrderStatus(orderId, 'CANCELLED');
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: 'CANCELLED'
        });
      }

      await fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Không thể huỷ đơn');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top dashboard summary header */}
      <div className="bg-white border border-[#EAE3D2]/50 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left">
          <h2 className="font-serif text-lg md:text-xl font-black text-gray-900">Quản lý Đơn hàng</h2>
          <p className="text-[10px] text-gray-500 mt-0.5">Xử lý đóng gói, bàn giao vận chuyển và chăm sóc khách hàng</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold bg-[#F5EFE6]/30 border border-[#EAE3D2]/50 px-4 py-2 rounded-xl">
          <AlertCircle className="w-4 h-4 text-[#F1641E]" />
          <span className="text-[#7D5C45]">{orders.filter(o => o.status === 'PAID').length} đơn cần chuẩn bị gấp</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#EAE3D2]/50 overflow-x-auto no-scrollbar text-xs font-bold gap-2 bg-white px-4 rounded-2xl py-1 border shadow-xs">
        {tabs.map((tab) => {
          const count = tab.key === 'ALL' 
            ? orders.length 
            : orders.filter(o => o.status === tab.key).length;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3.5 px-4.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive 
                  ? 'border-[#F1641E] text-[#F1641E]' 
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
              type="button"
            >
              <span>{tab.label}</span>
              <span className={`text-[9.5px] px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-[#F1641E] text-white' : 'bg-gray-155 text-gray-500'
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search Filter bar */}
      <div className="relative bg-white border border-[#EAE3D2]/50 p-4 rounded-2xl shadow-sm">
        <input 
          type="text" 
          placeholder="Tìm đơn hàng theo mã đơn, địa chỉ người mua..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full text-xs pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222]"
        />
        <Search className="w-4.5 h-4.5 text-gray-400 absolute left-7 top-1/2 -translate-y-1/2" />
      </div>

      {/* Orders Table list */}
      <div className="bg-white border border-[#EAE3D2]/50 rounded-3xl overflow-hidden shadow-sm text-left">
        {loading ? (
          <div className="py-16 text-center text-xs font-semibold text-gray-400">Đang tải danh sách đơn hàng...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs font-semibold text-gray-400">Không tìm thấy đơn hàng nào khớp bộ lọc.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5EFE6]/30 border-b border-[#EAE3D2]/65 text-gray-600 font-bold">
                  <th className="p-4">Mã đơn hàng</th>
                  <th className="p-4">Ngày đặt đơn</th>
                  <th className="p-4">Địa chỉ giao</th>
                  <th className="p-4 w-44">Tác phẩm mua</th>
                  <th className="p-4 w-32">Tổng trị giá</th>
                  <th className="p-4 w-32 text-center">Trạng thái</th>
                  <th className="p-4 w-44 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D2]/35">
                {filteredOrders.map((order) => {
                  const orderNo = order.orderNumber || `ORD-${String(order.id).slice(0, 8)}`;
                  const addressStr = order.shippingAddress 
                    ? `${order.shippingAddress.street}, ${order.shippingAddress.district}, ${order.shippingAddress.city}`
                    : 'N/A';
                  
                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-[#FDFAF7]/35 transition-all cursor-pointer"
                    >
                      <td className="p-4 font-mono font-bold text-gray-900">{orderNo}</td>
                      <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleString('vi-VN')}</td>
                      <td className="p-4 text-gray-655 truncate max-w-[180px]" title={addressStr}>{addressStr}</td>
                      <td className="p-4 font-medium max-w-[170px] truncate" title={order.items.map(i => i.productName).join(', ')}>
                        {order.items[0]?.productName} {order.items.length > 1 && `và ${order.items.length - 1} món`}
                      </td>
                      <td className="p-4 font-bold text-[#F1641E]">{formatVnd(order.totalPrice)}</td>
                      <td className="p-4 text-center">{getStatusBadge(order.status)}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {order.status === 'PAID' && (
                            <button
                              type="button"
                              onClick={(e) => handleOpenShipModal(order.id, e)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F1641E] hover:bg-[#D64F13] text-white text-[10.5px] font-bold rounded-lg cursor-pointer transition-all shadow-sm"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              Gửi hàng
                            </button>
                          )}
                          {order.status === 'SHIPPING' && (
                            <button
                              type="button"
                              onClick={(e) => handleMarkDelivered(order.id, order.totalPrice, e)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10.5px] font-bold rounded-lg cursor-pointer transition-all shadow-sm"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Đã giao khách
                            </button>
                          )}
                          {(order.status === 'PENDING' || order.status === 'PAID') && (
                            <button
                              type="button"
                              onClick={(e) => handleCancelOrder(order.id, e)}
                              className="p-1.5 border border-red-200 hover:bg-red-50 text-red-650 rounded-lg cursor-pointer transition-all"
                              title="Huỷ đơn hàng"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            className="p-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-550 cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="bg-[#FDFAF7] border border-[#EAE3D2] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 animate-fade-in flex flex-col max-h-[85vh] text-left font-sans">
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-[#EAE3D2]/50 flex justify-between items-center bg-[#F5EFE6]/20">
              <div>
                <h3 className="font-serif font-black text-base md:text-lg text-gray-800">
                  Chi tiết đơn hàng: {selectedOrder.orderNumber || `ORD-${selectedOrder.id}`}
                </h3>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full border border-gray-250 hover:bg-gray-150 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer bg-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Grid: Address & Shipping Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Details */}
                <div className="space-y-3">
                  <h4 className="font-serif font-black text-sm text-gray-700 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                    <MapPin className="w-4 h-4 text-[#F1641E]" />
                    Thông tin giao hàng
                  </h4>
                  <div className="text-xs space-y-1 text-gray-650">
                    <p className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-bold text-gray-800">Mã đơn hàng: #{selectedOrder.orderNumber || selectedOrder.id}</span>
                    </p>
                    <p className="font-medium pl-5">
                      Địa chỉ: {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.district}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country}
                    </p>
                  </div>
                </div>

                {/* Carrier info */}
                <div className="space-y-3">
                  <h4 className="font-serif font-black text-sm text-gray-700 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                    <Truck className="w-4 h-4 text-[#F1641E]" />
                    Trạng thái & Vận chuyển
                  </h4>
                  <div className="text-xs space-y-1.5 text-gray-655">
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-gray-400">Trạng thái:</span>
                      {getStatusBadge(selectedOrder.status)}
                    </p>
                    {selectedOrder.shippingInfo?.carrier && (
                      <p className="font-medium">
                        <span className="text-gray-400 font-normal">Hãng vận chuyển:</span> {selectedOrder.shippingInfo.carrier}
                      </p>
                    )}
                    {selectedOrder.shippingInfo?.trackingNumber && (
                      <p className="font-mono font-bold text-gray-800 bg-[#F5EFE6]/40 px-2.5 py-1 rounded-md w-fit mt-1 border border-[#EAE3D2]/40">
                        <span className="text-gray-400 font-sans font-normal">Mã vận đơn:</span> {selectedOrder.shippingInfo.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Purchased table */}
              <div className="space-y-3">
                <h4 className="font-serif font-black text-sm text-gray-700 border-b border-gray-100 pb-1.5">
                  Tác phẩm đặt mua ({selectedOrder.items.length})
                </h4>
                <div className="border border-[#EAE3D2]/50 rounded-2xl overflow-hidden bg-white">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F5EFE6]/20 border-b border-[#EAE3D2]/40 text-gray-600 font-bold">
                        <th className="p-3">Tác phẩm</th>
                        <th className="p-3 w-24 text-center font-bold">Đơn giá</th>
                        <th className="p-3 w-16 text-center font-bold">Số lượng</th>
                        <th className="p-3 w-28 text-right font-bold">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE3D2]/35">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/30">
                          <td className="p-3 font-semibold text-gray-800">{item.productName}</td>
                          <td className="p-3 text-center text-gray-600 font-medium">{formatVnd(item.unitPrice)}</td>
                          <td className="p-3 text-center text-gray-700 font-bold">{item.quantity}</td>
                          <td className="p-3 text-right font-bold text-gray-800">{formatVnd(item.unitPrice * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pricing breakdown summary */}
              <div className="bg-[#F5EFE6]/15 border border-[#EAE3D2]/45 p-4.5 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between font-semibold text-gray-600">
                  <span>Tạm tính hàng hoá</span>
                  <span>{formatVnd(selectedOrder.totalPrice - (selectedOrder.shippingInfo?.shippingFee || 30000) + (selectedOrder.discount?.amount || 0))}</span>
                </div>
                {selectedOrder.discount && selectedOrder.discount.amount > 0 && (
                  <div className="flex justify-between font-bold text-red-500">
                    <span>Mã giảm giá áp dụng ({selectedOrder.discount.code || 'ShopVN Coupon'})</span>
                    <span>-{formatVnd(selectedOrder.discount.amount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-gray-600">
                  <span>Chi phí vận chuyển</span>
                  <span>+{formatVnd(selectedOrder.shippingInfo?.shippingFee || 30000)}</span>
                </div>
                <div className="border-t border-[#EAE3D2]/60 pt-2 flex justify-between font-serif font-black text-sm text-gray-900">
                  <span>Tổng tiền thanh toán</span>
                  <span className="text-[#F1641E] text-base font-extrabold">{formatVnd(selectedOrder.totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Footer Action buttons */}
            <div className="px-6 py-4.5 border-t border-[#EAE3D2]/50 flex justify-end gap-3 bg-[#FDFAF7]">
              {selectedOrder.status === 'PAID' && (
                <button
                  type="button"
                  onClick={(e) => handleOpenShipModal(selectedOrder.id, e)}
                  className="px-5 py-2 rounded-full bg-[#F1641E] hover:bg-[#D64F13] text-white text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1"
                >
                  <Truck className="w-4 h-4" />
                  Xác nhận & Giao hàng
                </button>
              )}
              {selectedOrder.status === 'SHIPPING' && (
                <button
                  type="button"
                  onClick={(e) => handleMarkDelivered(selectedOrder.id, selectedOrder.totalPrice, e)}
                  className="px-5 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Xác nhận đã giao khách
                </button>
              )}
              {(selectedOrder.status === 'PENDING' || selectedOrder.status === 'PAID') && (
                <button
                  type="button"
                  onClick={(e) => handleCancelOrder(selectedOrder.id, e)}
                  className="px-5 py-2 border border-red-200 hover:bg-red-50 text-red-655 rounded-full text-xs font-bold transition-all cursor-pointer"
                >
                  Huỷ đơn hàng
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 border border-gray-300 hover:bg-gray-100 rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                Đóng chi tiết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Details form modal */}
      {shippingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShippingOrderId(null)} />
          <div className="bg-[#FDFAF7] border border-[#EAE3D2] rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative z-10 animate-fade-in text-left font-sans">
            <div className="px-6 py-4 border-b border-[#EAE3D2]/50 bg-[#F5EFE6]/20">
              <h3 className="font-serif font-black text-sm md:text-base text-gray-800">Cấu hình Đơn vị vận chuyển</h3>
            </div>
            <form onSubmit={handleConfirmShip} className="p-6 space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Hãng vận chuyển</label>
                <select
                  value={carrier}
                  onChange={e => setCarrier(e.target.value)}
                  className="w-full text-xs p-3 border border-gray-300 rounded-xl bg-white text-[#222222] focus:border-[#F1641E]"
                >
                  <option value="GHN">Giao Hàng Nhanh (GHN)</option>
                  <option value="GHTK">Giao Hàng Tiết Kiệm (GHTK)</option>
                  <option value="VNPost">Vietnam Post (VNPost)</option>
                  <option value="ViettelPost">Viettel Post</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mã số vận đơn (Tracking)*</label>
                <input 
                  type="text" 
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  required
                  placeholder="Ví dụ: GHTK-837192"
                  className="w-full text-xs p-3 border border-gray-300 rounded-xl bg-white text-[#222222] focus:border-[#F1641E] font-mono font-bold"
                />
              </div>

              <div className="pt-3 border-t border-gray-200/50 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShippingOrderId(null)}
                  className="px-4 py-2 border border-gray-350 hover:bg-gray-100 rounded-full text-xs font-bold cursor-pointer"
                >
                  Bỏ qua
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#F1641E] hover:bg-[#D64F13] text-white rounded-full text-xs font-bold cursor-pointer transition-all"
                >
                  Xác nhận gửi hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
