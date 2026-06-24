'use client';

import { useState, useEffect, useMemo } from 'react';
import { Voucher } from '@/components/types';
import { sellerVouchersService } from '../api/vouchers';
import VoucherModal from './VoucherModal';
import { 
  Plus, 
  Search, 
  Percent, 
  DollarSign, 
  Truck, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

export default function SellerVouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const data = await sellerVouchersService.getVouchers();
      setVouchers(data);
    } catch (err) {
      console.error('Failed to load vouchers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVouchers();
  }, []);

  const formatVnd = (price: number | null) => {
    if (price === null || price === undefined) return '0đ';
    return `${Math.round(price).toLocaleString('vi-VN')}đ`;
  };

  // Filter vouchers
  const filteredVouchers = useMemo(() => {
    return vouchers.filter(v => 
      v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.name && v.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [vouchers, searchQuery]);

  // Toggle active handler
  const handleToggleActive = async (voucher: Voucher) => {
    const nextState = !voucher.active;
    try {
      await sellerVouchersService.toggleVoucherActive(voucher.id, nextState);
      setVouchers(vouchers.map(v => v.id === voucher.id ? { ...v, active: nextState } : v));
    } catch (err) {
      console.error(err);
      alert('Không thể cập nhật trạng thái voucher');
    }
  };

  // Save new voucher
  const handleSaveVoucher = async (payload: Omit<Voucher, 'id' | 'usedQuantity'>) => {
    const created = await sellerVouchersService.createVoucher(payload);
    setVouchers([created, ...vouchers]);
  };

  // Format discount value description
  const formatDiscountDesc = (v: Voucher) => {
    if (v.discountType === 'PERCENT') {
      return (
        <span className="inline-flex items-center gap-1.5 font-bold text-[#F1641E]">
          <Percent className="w-3.5 h-3.5" />
          Giảm {v.discountValue}%
        </span>
      );
    }
    if (v.discountType === 'FREESHIP') {
      return (
        <span className="inline-flex items-center gap-1.5 font-bold text-blue-600">
          <Truck className="w-3.5 h-3.5" />
          Freeship
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 font-bold text-[#F1641E]">
        <DollarSign className="w-3.5 h-3.5" />
        Giảm -{formatVnd(v.discountValue)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#EAE3D2]/50 p-4 rounded-2xl shadow-sm">
        <div className="text-left">
          <h2 className="font-serif text-lg md:text-xl font-black text-gray-900">Mã giảm giá cửa hàng</h2>
          <p className="text-[10px] text-gray-500 mt-0.5">Quản lý và kích hoạt các mã khuyến mãi dành cho người mua sản phẩm</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-[#F1641E] hover:bg-[#D64F13] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4.5 h-4.5" />
          Tạo mã giảm giá mới
        </button>
      </div>

      {/* Search filter */}
      <div className="relative bg-white border border-[#EAE3D2]/50 p-4 rounded-2xl shadow-sm">
        <input 
          type="text" 
          placeholder="Tìm kiếm mã coupon (Ví dụ: HE2026), tên chiến dịch..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full text-xs pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222]"
        />
        <Search className="w-4.5 h-4.5 text-gray-400 absolute left-7 top-1/2 -translate-y-1/2" />
      </div>

      {/* Main Vouchers Table */}
      <div className="bg-white border border-[#EAE3D2]/50 rounded-3xl overflow-hidden shadow-sm text-left">
        {loading ? (
          <div className="py-16 text-center text-xs font-semibold text-gray-400">Đang tải danh sách mã ưu đãi...</div>
        ) : filteredVouchers.length === 0 ? (
          <div className="py-16 text-center text-xs font-semibold text-gray-400">Không tìm thấy voucher nào phù hợp.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5EFE6]/30 border-b border-[#EAE3D2]/65 text-gray-600 font-bold">
                  <th className="p-4 w-28">Mã ưu đãi</th>
                  <th className="p-4">Tên chiến dịch / Mô tả điều kiện</th>
                  <th className="p-4 w-32">Chiết khấu</th>
                  <th className="p-4 w-32">Đơn tối thiểu</th>
                  <th className="p-4 w-28">Đã dùng</th>
                  <th className="p-4 w-44">Hạn áp dụng</th>
                  <th className="p-4 w-28 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D2]/35">
                {filteredVouchers.map((v) => {
                  const isActive = v.active !== false;
                  
                  // Compute date format
                  const formatDate = (dateStr: string) => {
                    return new Date(dateStr).toLocaleDateString('vi-VN');
                  };

                  // Compute progress percentage
                  const usagePercent = Math.min(100, Math.round((v.usedQuantity / v.totalQuantity) * 100));

                  return (
                    <tr key={v.id} className="hover:bg-[#FDFAF7]/30 transition-all">
                      <td className="p-4 font-mono font-bold text-gray-900 uppercase">
                        <span className="bg-[#F5EFE6] border border-[#EAE3D2] px-2.5 py-1.5 rounded-lg text-[11px] block text-center text-gray-800">
                          {v.code}
                        </span>
                      </td>
                      <td className="p-4">
                        <h4 className="font-semibold text-gray-855 line-clamp-1 leading-snug">{v.name}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{v.description || 'Không có mô tả thêm'}</p>
                      </td>
                      <td className="p-4">{formatDiscountDesc(v)}</td>
                      <td className="p-4 font-bold text-gray-700">{formatVnd(v.minOrderValue ?? null)}</td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="font-bold text-gray-755">{v.usedQuantity} / {v.totalQuantity}</span>
                          <div className="w-full bg-[#EAE3D2]/40 rounded-full h-1">
                            <div className="bg-[#F1641E] h-1 rounded-full" style={{ width: `${usagePercent}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 font-medium leading-relaxed">
                        <span className="block text-[10.5px]">{formatDate(v.startDate)}</span>
                        <span className="block text-[10px] text-gray-400">đến {formatDate(v.endDate)}</span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(v)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-[#FFF2EB] text-[#F1641E] border-[#F1641E]/25 hover:bg-red-55 hover:text-red-650 hover:border-red-200'
                              : 'bg-red-50 text-red-650 border-red-200 hover:bg-green-50 hover:text-green-705 hover:border-green-200'
                          }`}
                        >
                          {isActive ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Hoạt động</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Tạm ngưng</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Voucher modal form */}
      <VoucherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveVoucher}
      />

    </div>
  );
}
