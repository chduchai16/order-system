'use client';

import Link from 'next/link';
import { Mail, Globe, MapPin, Phone, ShieldCheck, Heart, Award } from 'lucide-react';

const footerLinks = [
  {
    title: 'Cửa hàng',
    links: [
      { label: 'Tất cả sản phẩm', href: '/products' },
      { label: 'Ý tưởng quà tặng', href: '/products?category=gifts' },
      { label: 'Quà Ngày của Cha', href: '/products?category=fathers-day' },
      { label: 'Đồ thủ công nghệ thuật', href: '/products?category=crafts' },
      { label: 'Sản phẩm giảm giá %', href: '/products?category=sale' },
    ],
  },
  {
    title: 'Bán hàng cùng ShopVN',
    links: [
      { label: 'Mở cửa hàng riêng', href: '/register' },
      { label: 'Quy định cộng đồng', href: '/products' },
      { label: 'Cổng thông tin người bán', href: '/login' },
      { label: 'Phí dịch vụ & Hoa hồng', href: '/products' },
    ],
  },
  {
    title: 'Về chúng tôi',
    links: [
      { label: 'Giới thiệu ShopVN', href: '/products' },
      { label: 'Cam kết cộng đồng', href: '/products' },
      { label: 'Nhà sáng tạo độc lập', href: '/products' },
      { label: 'Báo chí & Truyền thông', href: '/products' },
    ],
  },
  {
    title: 'Trợ giúp & Hỗ trợ',
    links: [
      { label: 'Trung tâm trợ giúp', href: '/products' },
      { label: 'Chính sách đổi trả', href: '/products' },
      { label: 'Bảo mật thanh toán', href: '/checkout' },
      { label: 'Quyền riêng tư dữ liệu', href: '/products' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#231F2D] text-gray-300 font-sans border-t border-[#342F42]">
      {/* Newsletter / Subscription banner */}
      <div className="bg-[#302B3E] py-8 px-4 border-b border-[#3E384D]">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-white font-serif text-lg md:text-xl font-bold mb-1">
              Nhận thông tin cập nhật từ ShopVN!
            </h3>
            <p className="text-xs text-gray-400">
              Đăng ký để nhận các ưu đãi độc quyền, ý tưởng quà tặng độc đáo và mẹo mua sắm cá nhân hóa từ các nhà sáng tạo độc lập.
            </p>
          </div>
          <form className="w-full max-w-md flex h-11" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn..."
              className="flex-grow px-4 bg-white text-[#222222] rounded-l-full text-xs focus:outline-none border-0"
              required
            />
            <button className="bg-[#F1641E] hover:bg-[#d85213] text-white px-6 rounded-r-full font-bold text-xs transition-colors cursor-pointer shrink-0">
              Đăng ký
            </button>
          </form>
        </div>
      </div>

      {/* Top Banner Guarantees */}
      <div className="bg-[#231F2D] border-b border-[#302B3E] py-4 px-4">
        <div className="max-w-screen-2xl mx-auto flex flex-wrap justify-around gap-4 text-xs font-semibold text-gray-300">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F1641E]" />
            Thanh toán an toàn 256-bit
          </span>
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#F1641E]" />
            100% Đồ handmade & Tuyển chọn
          </span>
          <span className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#F1641E] fill-[#F1641E]" />
            Đồng hành cùng nghệ nhân Việt
          </span>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_2.8fr] gap-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-white font-serif font-black text-3xl">
              ShopVN
            </Link>
            <p className="text-xs leading-relaxed text-gray-400 max-w-xs">
              Nơi kết nối các nhà sáng tạo độc lập của Việt Nam với những người yêu thích sản phẩm thủ công, quà tặng tinh xảo và thời trang độc bản.
            </p>
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center gap-2 hover:text-[#F1641E] transition-colors">
                <Phone className="w-4 h-4 text-gray-400" />
                Hotline chăm sóc: 1800 6789 (miễn phí)
              </div>
              <div className="flex items-center gap-2 hover:text-[#F1641E] transition-colors">
                <Mail className="w-4 h-4 text-gray-400" />
                trogiup@shopvn.art
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                Hà Nội & TP. Hồ Chí Minh, Việt Nam
              </div>
            </div>
          </div>

          {/* Links Cols */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerLinks.map((group) => (
              <div key={group.title} className="space-y-3">
                <h4 className="text-white font-semibold text-xs uppercase tracking-wider">{group.title}</h4>
                <ul className="space-y-2 text-xs">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-gray-400 hover:text-white hover:underline transition-all">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-[#302B3E] mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 hover:text-white cursor-pointer">
              <Globe className="w-4 h-4" />
              Việt Nam | Tiếng Việt | VNĐ
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <span>© {new Date().getFullYear()} ShopVN, Inc. Mọi quyền được bảo lưu.</span>
            <div className="flex gap-3">
              <Link href="/products" className="hover:text-white">Điều khoản</Link>
              <Link href="/products" className="hover:text-white">Bảo mật</Link>
              <Link href="/products" className="hover:text-white">Quảng cáo dựa trên sở thích</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
