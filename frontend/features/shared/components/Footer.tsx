import Link from 'next/link';
import { CreditCard, Mail, MapPin, Phone, ShieldCheck, Truck, Zap } from 'lucide-react';

const footerLinks = [
  {
    title: 'Mua sắm',
    links: [
      { label: 'Tất cả sản phẩm', href: '/products' },
      { label: 'Flash Sale', href: '/products' },
      { label: 'Giỏ hàng', href: '/cart' },
      { label: 'Theo dõi đơn hàng', href: '/orders' },
    ],
  },
  {
    title: 'Tài khoản',
    links: [
      { label: 'Đăng nhập', href: '/login' },
      { label: 'Đăng ký', href: '/register' },
      { label: 'Tài khoản của tôi', href: '/account' },
      { label: 'Yêu thích', href: '/wishlist' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Chính sách đổi trả', href: '/products' },
      { label: 'Bảo mật thanh toán', href: '/checkout' },
      { label: 'Phí vận chuyển', href: '/cart' },
      { label: 'Câu hỏi thường gặp', href: '/products' },
    ],
  },
];

const guarantees = [
  { label: 'Giao hàng nhanh', icon: Truck },
  { label: 'Thanh toán bảo mật', icon: ShieldCheck },
  { label: 'Hỗ trợ thẻ/ ví điện tử', icon: CreditCard },
];

export default function Footer() {
  return (
    <footer className="bg-[#182337] text-gray-300 border-t border-[#2d374b]">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-white font-bold text-2xl mb-4">
              <Zap className="w-6 h-6 text-[#ff6600] fill-current" />
              ShopVN
            </Link>
            <p className="text-sm leading-6 max-w-sm">
              Nền tảng mua sắm trực tuyến với sản phẩm chính hãng, thanh toán an toàn và giao hàng nhanh toàn quốc.
            </p>

            <div className="space-y-2 mt-5 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#ff6600]" />
                Hotline: 1800 6789
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#ff6600]" />
                support@shopvn.local
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ff6600]" />
                Hà Nội, Việt Nam
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h2 className="text-white font-bold mb-3">{group.title}</h2>
                <ul className="space-y-2 text-sm">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-[#ff6600] transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#2d374b] mt-8 pt-6 flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {guarantees.map((item) => {
              const Icon = item.icon;
              return (
                <span key={item.label} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 text-sm">
                  <Icon className="w-4 h-4 text-[#ff6600]" />
                  {item.label}
                </span>
              );
            })}
          </div>

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} ShopVN. Mua sắm thông minh mỗi ngày.
          </p>
        </div>
      </div>
    </footer>
  );
}
