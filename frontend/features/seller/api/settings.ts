import { ShopSettings } from '../types';

const SHOP_SETTINGS_KEY = 'shop_vn_seller_settings';

const defaultSettings: ShopSettings = {
  shopName: 'Gốm Sứ & Đồ Da Mộc ShopVN',
  description: 'Gia đình nghệ nhân 3 thế hệ chế tác gốm sứ men hoả biến độc bản Bát Tràng và khâu tay ví da bò cao cấp mộc mạc.',
  avatarUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=200&auto=format&fit=crop&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?w=1200&auto=format&fit=crop&q=80',
  phone: '0987.654.321',
  email: 'lienhe@moccrafts.vn',
  street: 'Làng gốm Bát Tràng, xã Bát Tràng',
  city: 'Hà Nội',
  district: 'Gia Lâm',
  country: 'Việt Nam',
  walletBalance: 24850000,
  joinedDate: 'Tháng 5, 2024',
};

const isBrowser = () => typeof window !== 'undefined';

export const sellerSettingsService = {
  getShopSettings: (): ShopSettings => {
    if (!isBrowser()) return defaultSettings;
    try {
      const data = localStorage.getItem(SHOP_SETTINGS_KEY);
      return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  },

  updateShopSettings: (settings: Partial<ShopSettings>): ShopSettings => {
    const current = sellerSettingsService.getShopSettings();
    const updated = { ...current, ...settings };
    if (isBrowser()) {
      localStorage.setItem(SHOP_SETTINGS_KEY, JSON.stringify(updated));
    }
    return updated;
  },
};
