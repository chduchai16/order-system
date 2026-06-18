'use client';

import { useState, useEffect } from 'react';
import { sellerService, ShopSettings } from '../api/sellerService';
import { Save, Store, Mail, Phone, MapPin, Eye, Calendar, Sparkles } from 'lucide-react';

export default function SellerSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Shop settings state
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [country, setCountry] = useState('');
  
  // Read-only states
  const [walletBalance, setWalletBalance] = useState(0);
  const [joinedDate, setJoinedDate] = useState('');

  useEffect(() => {
    const loadSettings = () => {
      const data = sellerService.getShopSettings();
      setShopName(data.shopName);
      setDescription(data.description);
      setAvatarUrl(data.avatarUrl);
      setCoverUrl(data.coverUrl);
      setPhone(data.phone);
      setEmail(data.email);
      setStreet(data.street);
      setCity(data.city);
      setDistrict(data.district);
      setCountry(data.country);
      setWalletBalance(data.walletBalance);
      setJoinedDate(data.joinedDate);
      setLoading(false);
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) return alert('Vui lòng nhập tên gian hàng');

    setSaving(true);
    try {
      sellerService.updateShopSettings({
        shopName,
        description,
        avatarUrl,
        coverUrl,
        phone,
        email,
        street,
        city,
        district,
        country,
      });

      // Dispatch global event to update Sidebar Layout profile
      window.dispatchEvent(new Event('shop_settings_updated'));
      alert('Đã cập nhật cấu hình gian hàng thành công!');
    } catch (err) {
      console.error(err);
      alert('Lỗi khi lưu cấu hình');
    } finally {
      setSaving(false);
    }
  };

  const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}đ`;

  if (loading) {
    return (
      <div className="py-16 text-center text-sm font-semibold text-gray-500 bg-white border border-[#EAE3D2]/50 rounded-2xl">
        Đang tải thông tin cấu hình cửa hàng...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Settings Form - Left/Center Column */}
      <div className="lg:col-span-2 bg-white border border-[#EAE3D2]/50 p-6 rounded-3xl shadow-sm text-left">
        <div className="flex justify-between items-center mb-6 border-b border-[#EAE3D2]/40 pb-3">
          <div>
            <h3 className="font-serif font-black text-base text-gray-800 flex items-center gap-1.5">
              <Store className="w-5 h-5 text-[#F1641E]" />
              <span>Hồ sơ gian hàng</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Thay đổi thông tin hiển thị với khách mua sắm trên ShopVN</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs font-medium">
          {/* Shop Name */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tên gian hàng nghệ thuật *</label>
            <input 
              type="text" 
              value={shopName} 
              onChange={e => setShopName(e.target.value)}
              placeholder="Tên cửa hàng..."
              required
              className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222]"
            />
          </div>

          {/* Description / Bio */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tiểu sử & Giới thiệu</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              placeholder="Kể câu chuyện về thương hiệu của bạn, vật liệu chế tác, giá trị cốt lõi..."
              rows={3}
              className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222] resize-none"
            />
          </div>

          {/* Grid: Brand Images URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Logo cửa hàng (URL)</label>
              <input 
                type="url" 
                value={avatarUrl} 
                onChange={e => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222]"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Cover banner lớn (URL)</label>
              <input 
                type="url" 
                value={coverUrl} 
                onChange={e => setCoverUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222]"
              />
            </div>
          </div>

          {/* Grid: Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                Số điện thoại liên hệ
              </label>
              <input 
                type="text" 
                value={phone} 
                onChange={e => setPhone(e.target.value)}
                placeholder="09xx.xxx.xxx"
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222]"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                Email giao dịch
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="email@cuahang.vn"
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222]"
              />
            </div>
          </div>

          {/* Location details */}
          <div className="space-y-3 pt-3 border-t border-gray-150/60">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              Địa chỉ kho / Cơ sở sản xuất
            </label>
            
            <div className="flex flex-col space-y-1">
              <input 
                type="text" 
                value={street} 
                onChange={e => setStreet(e.target.value)}
                placeholder="Địa chỉ số nhà, ngõ/đường..."
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col space-y-1">
                <input 
                  type="text" 
                  value={district} 
                  onChange={e => setDistrict(e.target.value)}
                  placeholder="Quận / Huyện"
                  className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222]"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <input 
                  type="text" 
                  value={city} 
                  onChange={e => setCity(e.target.value)}
                  placeholder="Tỉnh / Thành phố"
                  className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222]"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <input 
                  type="text" 
                  value={country} 
                  onChange={e => setCountry(e.target.value)}
                  placeholder="Quốc gia"
                  className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:border-[#F1641E] bg-white text-[#222222]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-[#1E5C3F] hover:bg-[#113a26] text-white px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu cấu hình...' : 'Lưu thông tin cửa hàng'}
            </button>
          </div>
        </form>
      </div>

      {/* Right Column: Profile Live Preview */}
      <div className="space-y-6">
        {/* Profile Card Preview */}
        <div className="bg-white border border-[#EAE3D2]/50 rounded-3xl overflow-hidden shadow-sm text-left">
          <div className="px-5 py-4 border-b border-[#EAE3D2]/40 bg-[#F5EFE6]/10 flex items-center justify-between">
            <h3 className="font-serif font-black text-xs md:text-sm text-gray-800 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#F1641E]" />
              Xem trước hiển thị
            </h3>
            <span className="text-[9.5px] bg-[#EBF2EE] text-[#1E5C3F] font-bold px-2 py-0.5 rounded-sm">
              Live Preview
            </span>
          </div>

          {/* Shop Card rendering */}
          <div className="p-5 space-y-5">
            {/* Banner block */}
            <div className="relative h-28 w-full rounded-2xl overflow-hidden border border-gray-150 bg-gray-100 shadow-sm">
              {coverUrl ? (
                <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-150 flex items-center justify-center text-gray-400">
                  Cover Banner
                </div>
              )}
            </div>

            {/* Avatar & shop meta info block */}
            <div className="flex gap-4.5 items-start">
              <div className="w-14 h-14 relative rounded-full overflow-hidden border border-[#EAE3D2] -mt-10 bg-white shadow-md shrink-0 flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-6 h-6 text-gray-300" />
                )}
              </div>
              <div className="min-w-0 text-left -mt-2">
                <h4 className="font-serif font-black text-sm text-gray-850 truncate leading-snug">{shopName || 'Tên gian hàng'}</h4>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400 font-semibold">
                  <Calendar className="w-3 h-3" />
                  <span>Hoạt động từ: {joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-xs text-gray-550 leading-relaxed italic bg-[#FDFAF7] border border-[#EAE3D2]/35 p-3 rounded-xl">
              "{description || 'Chưa cấu hình mô tả tiểu sử về gian hàng thủ công của bạn.'}"
            </p>

            {/* Quick Stats list */}
            <div className="border-t border-[#EAE3D2]/40 pt-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block text-[9.5px] font-bold uppercase tracking-wider">Người bán được xác thực</span>
                <span className="font-bold text-[#1E5C3F] flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Nghệ nhân ShopVN
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9.5px] font-bold uppercase tracking-wider">Ví bảo lãnh (Sepay)</span>
                <span className="font-bold text-gray-800 block mt-0.5">{formatVnd(walletBalance)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
