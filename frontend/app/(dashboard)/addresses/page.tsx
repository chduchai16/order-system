'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, MapPin, Plus, Star, Trash2, Edit3, Building2 } from 'lucide-react';
import { userService } from '@/lib/api/userService';
import { Address } from '@/lib/utils/types';

const fallbackAddresses: Address[] = [
  {
    id: 1,
    label: 'Nhà riêng',
    street: '123 Đường Lê Lợi, Phường Bến Nghé',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    country: 'Vietnam',
    isDefault: true,
  },
  {
    id: 2,
    label: 'Văn phòng',
    street: '456 Nguyễn Huệ, Phường Bến Nghé',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    country: 'Vietnam',
    isDefault: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    city: '',
    district: '',
    country: 'Vietnam',
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await userService.getAddresses();
      setAddresses(data.length > 0 ? data : fallbackAddresses);
    } catch (err) {
      console.error('Failed to fetch addresses', err);
      setAddresses(fallbackAddresses);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.addMyAddress(newAddress);
      setShowAddForm(false);
      setNewAddress({ label: '', street: '', city: '', district: '', country: 'Vietnam', isDefault: false });
      fetchAddresses();
    } catch (err) {
      console.error('Failed to add address', err);
    }
  };

  if (loading) {
    return <div className="bg-white border border-gray-200 rounded-lg py-16 text-center text-gray-500">Đang tải địa chỉ...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        <Link href="/" className="hover:text-[#ff6600]">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-[#ff6600] font-semibold">Địa chỉ giao hàng</span>
      </div>

      <section className="bg-[#182337] text-white rounded-lg p-6 lg:p-8 flex flex-col lg:flex-row justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#ff6600]/10 text-[#ff8a3d] text-sm font-bold mb-4">
            <MapPin className="w-4 h-4" />
            Sổ địa chỉ
          </div>
          <h1 className="text-3xl lg:text-4xl font-black mb-2">Quản lý địa chỉ giao hàng</h1>
          <p className="text-gray-300 max-w-2xl">Lưu địa chỉ thường dùng để đặt hàng nhanh hơn trong các lần mua tiếp theo.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 min-w-[260px]">
          <div className="border border-white/10 rounded-lg p-4 bg-white/5">
            <div className="text-2xl font-black text-[#ff6600]">{addresses.length}</div>
            <div className="text-sm text-gray-300">Địa chỉ đã lưu</div>
          </div>
          <div className="border border-white/10 rounded-lg p-4 bg-white/5">
            <div className="text-2xl font-black text-[#ff6600]">{addresses.filter((address) => address.isDefault).length}</div>
            <div className="text-sm text-gray-300">Mặc định</div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-950">Địa chỉ của tôi</h2>
            <p className="text-sm text-gray-600">Chọn địa chỉ mặc định cho giao hàng</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm((value) => !value)}
            className="h-10 px-4 rounded-md bg-[#ff6600] text-white font-bold flex items-center gap-2 hover:bg-orange-600"
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? 'Đóng' : 'Thêm địa chỉ'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddAddress} className="p-5 border-b border-gray-200 bg-orange-50/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nhãn địa chỉ" value={newAddress.label} onChange={(value) => setNewAddress({ ...newAddress, label: value })} placeholder="Nhà riêng, Văn phòng" />
              <Input label="Quận/Huyện" value={newAddress.district} onChange={(value) => setNewAddress({ ...newAddress, district: value })} placeholder="Quận 1" />
              <div className="md:col-span-2">
                <Input label="Địa chỉ chi tiết" value={newAddress.street} onChange={(value) => setNewAddress({ ...newAddress, street: value })} placeholder="Số nhà, tên đường, phường/xã" />
              </div>
              <Input label="Tỉnh/Thành phố" value={newAddress.city} onChange={(value) => setNewAddress({ ...newAddress, city: value })} placeholder="TP. Hồ Chí Minh" />
              <label className="flex items-center gap-2 text-sm text-gray-700 pt-7">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(event) => setNewAddress({ ...newAddress, isDefault: event.target.checked })}
                  className="w-4 h-4 accent-[#ff6600]"
                />
                Đặt làm địa chỉ mặc định
              </label>
            </div>
            <button type="submit" className="mt-5 h-11 px-5 rounded-md bg-[#ff6600] text-white font-bold hover:bg-orange-600">
              Lưu địa chỉ
            </button>
          </form>
        )}

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => {
            const Icon = address.label.toLowerCase().includes('văn') ? Building2 : Home;
            return (
              <article key={address.id ?? `${address.label}-${address.street}`} className={`border rounded-lg p-5 ${address.isDefault ? 'border-[#ff6600] bg-orange-50/40' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-orange-50 text-[#ff6600] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-950">{address.label || 'Địa chỉ'}</h3>
                      <p className="text-sm text-gray-600">0901 234 567</p>
                    </div>
                  </div>
                  {address.isDefault && <span className="px-2 py-1 rounded bg-[#ff6600] text-white text-xs font-bold">Mặc định</span>}
                </div>

                <p className="mt-4 text-sm text-gray-700">
                  {address.street}, {address.district}, {address.city}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                  <button type="button" className="text-sm font-semibold text-[#ff6600] flex items-center gap-1 hover:underline">
                    <Edit3 className="w-4 h-4" />
                    Sửa
                  </button>
                  {!address.isDefault && (
                    <button type="button" className="text-sm font-semibold text-gray-600 flex items-center gap-1 hover:text-[#ff6600]">
                      <Star className="w-4 h-4" />
                      Đặt mặc định
                    </button>
                  )}
                  <button type="button" className="text-sm font-semibold text-red-500 flex items-center gap-1 hover:underline ml-auto">
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-gray-900 mb-2">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        className="w-full h-11 px-4 border border-gray-300 rounded-md focus:border-[#ff6600] focus:ring-2 focus:ring-orange-100 text-sm"
      />
    </label>
  );
}
