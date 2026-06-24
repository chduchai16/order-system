'use client';

import { useState, useEffect } from 'react';
import { Voucher } from '@/components/types';
import { X, Calendar, DollarSign, Percent, ShieldCheck } from 'lucide-react';

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (voucher: Omit<Voucher, 'id' | 'usedQuantity'>) => Promise<void>;
}

export default function VoucherModal({ isOpen, onClose, onSave }: VoucherModalProps) {
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'FIXED' | 'PERCENT' | 'FREESHIP'>('FIXED');
  const [discountValue, setDiscountValue] = useState(30000);
  const [maxDiscountValue, setMaxDiscountValue] = useState<number | ''>('');
  const [minOrderValue, setMinOrderValue] = useState(150000);
  const [totalQuantity, setTotalQuantity] = useState(100);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [active, setActive] = useState(true);

  // Reset form when modal opens
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (isOpen) {
      setCode('');
      setName('');
      setDescription('');
      setDiscountType('FIXED');
      setDiscountValue(30000);
      setMaxDiscountValue('');
      setMinOrderValue(150000);
      setTotalQuantity(100);
      setActive(true);

      // Set default start/end dates
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + 30); // 30 days validity

      // Format to datetime-local input string YYYY-MM-DDThh:mm
      const formatDate = (d: Date) => {
        const offset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - offset * 60 * 1000);
        return local.toISOString().slice(0, 16);
      };

      setStartDate(formatDate(start));
      setEndDate(formatDate(end));
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return alert('Vui lòng nhập mã giảm giá');
    if (!name.trim()) return alert('Vui lòng nhập tên chương trình');
    if (new Date(startDate) >= new Date(endDate)) {
      return alert('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
    }

    setSubmitting(true);
    try {
      const payload = {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim(),
        discountType,
        discountValue: Number(discountValue),
        maxDiscountValue: maxDiscountValue === '' ? null : Number(maxDiscountValue),
        minOrderValue: Number(minOrderValue),
        totalQuantity: Number(totalQuantity),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        active,
        conditions: [],
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Đã có lỗi xảy ra khi tạo mã giảm giá');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="bg-[#FDFAF7] border border-[#EAE3D2] rounded-3xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden relative z-10 animate-fade-in font-sans">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#EAE3D2]/50 flex items-center justify-between bg-[#F5EFE6]/20">
          <div className="text-left">
            <h3 className="font-serif text-lg font-black text-gray-900">
              Tạo mã giảm giá mới
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
              Khuyến khích người mua sắm bằng các ưu đãi đặc biệt
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-gray-250 hover:bg-gray-150 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer bg-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form Scroll container */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left max-h-[80vh] overflow-y-auto">
          {/* Grid: Code & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.8fr] gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mã Code *</label>
              <input 
                type="text" 
                value={code} 
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="Ví dụ: HE2026"
                required
                maxLength={20}
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F1641E] focus:ring-4 focus:ring-[#F1641E]/10 bg-white text-[#222222] font-mono font-bold transition-all duration-200"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tên chương trình *</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="Ví dụ: Giảm giá hè đón nắng"
                required
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F1641E] focus:ring-4 focus:ring-[#F1641E]/10 bg-white text-[#222222] transition-all duration-200"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mô tả điều kiện</label>
            <input 
              type="text" 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              placeholder="Ví dụ: Áp dụng cho đơn hàng gốm sứ từ 300k"
              className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F1641E] focus:ring-4 focus:ring-[#F1641E]/10 bg-white text-[#222222] transition-all duration-200"
            />
          </div>

          {/* Discount Type Selection */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Loại hình chiết khấu</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'FIXED', label: 'Cố định (đ)', icon: DollarSign },
                { type: 'PERCENT', label: 'Phần trăm (%)', icon: Percent },
                { type: 'FREESHIP', label: 'Miễn phí ship', icon: ShieldCheck },
              ].map(opt => {
                const Icon = opt.icon;
                const isSelected = discountType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => {
                      setDiscountType(opt.type as 'FIXED' | 'PERCENT' | 'FREESHIP');
                      if (opt.type === 'FREESHIP') setDiscountValue(0);
                      else if (opt.type === 'PERCENT') setDiscountValue(10);
                      else setDiscountValue(30000);
                    }}
                    className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFF2EB] border-[#F1641E] text-[#F1641E]'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Value, Min, Max values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Value */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Giá trị giảm {discountType === 'PERCENT' ? '(%)' : '(đ)'}
              </label>
              <input 
                type="number" 
                value={discountValue} 
                onChange={e => setDiscountValue(Number(e.target.value))}
                min={0}
                disabled={discountType === 'FREESHIP'}
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F1641E] focus:ring-4 focus:ring-[#F1641E]/10 bg-white text-[#222222] disabled:bg-gray-100 disabled:text-gray-400 transition-all duration-200"
              />
            </div>

            {/* Max discount cap */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Giảm tối đa (đ)</label>
              <input 
                type="number" 
                value={maxDiscountValue} 
                onChange={e => setMaxDiscountValue(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Không giới hạn"
                disabled={discountType !== 'PERCENT'}
                min={0}
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F1641E] focus:ring-4 focus:ring-[#F1641E]/10 bg-white text-[#222222] disabled:bg-gray-100 disabled:text-gray-400 transition-all duration-200"
              />
            </div>

            {/* Min order value */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Đơn tối thiểu (đ)</label>
              <input 
                type="number" 
                value={minOrderValue} 
                onChange={e => setMinOrderValue(Number(e.target.value))}
                min={0}
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F1641E] focus:ring-4 focus:ring-[#F1641E]/10 bg-white text-[#222222] transition-all duration-200"
              />
            </div>
          </div>

          {/* Grid: Quantity & Active status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tổng số lượng phát hành</label>
              <input 
                type="number" 
                value={totalQuantity} 
                onChange={e => setTotalQuantity(Number(e.target.value))}
                min={1}
                required
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F1641E] focus:ring-4 focus:ring-[#F1641E]/10 bg-white text-[#222222] transition-all duration-200"
              />
            </div>

            <div className="flex items-center space-x-3 pt-6">
              <input
                type="checkbox"
                id="voucher-active-chk"
                checked={active}
                onChange={e => setActive(e.target.checked)}
                className="w-4.5 h-4.5 text-[#F1641E] border-gray-300 rounded-sm focus:ring-[#F1641E]"
              />
              <label htmlFor="voucher-active-chk" className="text-xs font-bold text-gray-700 cursor-pointer">
                Kích hoạt sử dụng ngay lập tức
              </label>
            </div>
          </div>

          {/* Grid: Validity Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Ngày bắt đầu áp dụng
              </label>
              <input 
                type="datetime-local" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)}
                required
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F1641E] focus:ring-4 focus:ring-[#F1641E]/10 bg-white text-[#222222] transition-all duration-200"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Ngày hết hạn áp dụng
              </label>
              <input 
                type="datetime-local" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)}
                required
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#F1641E] focus:ring-4 focus:ring-[#F1641E]/10 bg-white text-[#222222] transition-all duration-200"
              />
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-[#EAE3D2]/50 flex justify-end gap-3 bg-[#FDFAF7] sticky bottom-0 z-10 py-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#222222] hover:bg-gray-150 rounded-full text-xs font-bold transition-all cursor-pointer bg-white"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#F1641E] hover:bg-[#D64F13] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              {submitting ? 'Đang tạo...' : 'Tạo mã voucher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
