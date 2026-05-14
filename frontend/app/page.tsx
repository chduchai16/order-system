import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Headphones,
  Heart,
  Laptop,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Shirt,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  Truck,
  Zap,
} from 'lucide-react';
import Footer from '@/features/shared/components/Footer';
import Navbar from '@/features/shared/components/Navbar';

const categories = [
  { name: 'Điện thoại', href: '/products?category=electronics', icon: Smartphone, count: '234' },
  { name: 'Laptop', href: '/products?category=laptop', icon: Laptop, count: '89' },
  { name: 'Âm thanh', href: '/products?category=audio', icon: Headphones, count: '156' },
  { name: 'Thời trang', href: '/products?category=fashion', icon: Shirt, count: '412' },
  { name: 'Làm đẹp', href: '/products?category=beauty', icon: Sparkles, count: '98' },
  { name: 'Thể thao', href: '/products?category=sports', icon: Activity, count: '76' },
  { name: 'Sách', href: '/products?category=books', icon: BookOpen, count: '120' },
  { name: 'Flash Sale', href: '/products', icon: Zap, count: '24h' },
];

const featuredProducts = [
  { name: 'Tai nghe Bluetooth Sony Pro X1', brand: 'Sony', price: '290.000đ', oldPrice: '450.000đ', color: 'bg-[#dff1ff] text-blue-500' },
  { name: 'Samsung Galaxy Watch 6 Graphite', brand: 'Samsung', price: '850.000đ', oldPrice: '1.000.000đ', color: 'bg-pink-100 text-purple-500' },
  { name: 'Áo thun Uniqlo cotton cao cấp', brand: 'Uniqlo', price: '240.000đ', oldPrice: '380.000đ', color: 'bg-green-100 text-green-600' },
  { name: 'Balo laptop 15.6 inch cao cấp', brand: 'Balo', price: '350.000đ', oldPrice: '520.000đ', color: 'bg-yellow-100 text-yellow-600' },
];

const benefits = [
  { title: 'Giao hàng nhanh', description: 'Toàn quốc 2-3 ngày', icon: Truck },
  { title: 'Thanh toán bảo mật', description: 'Mã hóa SSL 256-bit', icon: ShieldCheck },
  { title: 'Đổi trả dễ dàng', description: 'Trong vòng 30 ngày', icon: RefreshCw },
  { title: 'Hàng chính hãng', description: 'Cam kết 100%', icon: PackageCheck },
];

function ProductVisual({ className }: { className: string }) {
  return (
    <div className={`aspect-square rounded-lg flex items-center justify-center ${className}`}>
      <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1c-1.657 0-3-1.343-3-3v-2c0-1.657 1.343-3 3-3h3v8z" />
        <path d="M3 19a2 2 0 0 0 2 2h1c1.657 0 3-1.343 3-3v-2c0-1.657-1.343-3-3-3H3v8z" />
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f6f3ed] text-gray-900 font-sans">
      <Navbar />

      <main>
        <section className="bg-[#182337] text-white">
          <div className="max-w-7xl mx-auto px-4 py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div className="py-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#ff6600]/10 text-[#ff8a3d] text-sm font-bold mb-5">
                <Clock className="w-4 h-4" />
                Flash Sale hôm nay - kết thúc sau 02:47:18
              </div>
              <h1 className="text-4xl lg:text-6xl font-black leading-tight mb-5">
                Mua sắm thông minh
                <span className="block text-[#ff6600]">giảm đến 70%</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mb-7">
                Khám phá hàng nghìn sản phẩm chính hãng, giao nhanh toàn quốc, thanh toán an toàn và ưu đãi riêng cho thành viên ShopVN.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/products" className="h-12 px-6 rounded-md bg-[#ff6600] text-white font-bold flex items-center justify-center gap-2 hover:bg-orange-600">
                  Mua ngay
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/register" className="h-12 px-6 rounded-md border border-gray-500 text-white font-bold flex items-center justify-center hover:border-[#ff6600] hover:text-[#ff6600]">
                  Tạo tài khoản miễn phí
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-5 max-w-xl">
                <div>
                  <div className="text-2xl font-black text-[#ff6600]">500k+</div>
                  <div className="text-sm text-gray-300">Thành viên</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#ff6600]">10k+</div>
                  <div className="text-sm text-gray-300">Sản phẩm</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#ff6600]">4.9★</div>
                  <div className="text-sm text-gray-300">Đánh giá TB</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <div className="grid grid-cols-2 gap-4">
                {featuredProducts.map((product, index) => (
                  <Link key={product.name} href={`/products/${index + 1}`} className="bg-white rounded-lg p-3 text-gray-900 hover:-translate-y-1 transition-transform">
                    <div className="relative">
                      <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">-35%</span>
                      <ProductVisual className={product.color} />
                    </div>
                    <p className="text-xs text-[#ff6600] font-bold mt-3">{product.brand}</p>
                    <h2 className="text-sm font-bold line-clamp-2 h-10">{product.name}</h2>
                    <div className="flex items-center gap-1 mt-2 text-[#ffb800]">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs text-gray-500">(128)</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-black text-[#ff6600]">{product.price}</span>
                      <span className="text-xs text-gray-400 line-through ml-2">{product.oldPrice}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.name} href={category.href} className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-[#ff6600] hover:shadow-sm transition">
                  <div className="w-11 h-11 rounded-lg bg-orange-50 text-[#ff6600] mx-auto flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-bold text-sm">{category.name}</h2>
                  <p className="text-xs text-gray-500 mt-1">{category.count} sản phẩm</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 pb-8">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-orange-50 text-[#ff6600] flex items-center justify-center">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h2 className="text-xl font-black">Sản phẩm nổi bật</h2>
                  <p className="text-sm text-gray-600">Ưu đãi tốt nhất dành cho khách chưa đăng nhập</p>
                </div>
              </div>
              <Link href="/products" className="text-[#ff6600] font-bold text-sm flex items-center gap-1 hover:underline">
                Xem tất cả
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
              {featuredProducts.map((product, index) => (
                <Link key={product.name} href={`/products/${index + 1}`} className="border border-gray-100 rounded-lg overflow-hidden bg-white hover:shadow-md transition group">
                  <div className="relative">
                    <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">-35%</span>
                    <button type="button" className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white text-gray-400 flex items-center justify-center shadow-sm group-hover:text-red-500" aria-label="Yêu thích">
                      <Heart className="w-4 h-4" />
                    </button>
                    <ProductVisual className={product.color} />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-[#ff6600] font-bold">{product.brand}</p>
                    <h3 className="font-bold line-clamp-2 h-12">{product.name}</h3>
                    <div className="flex items-center gap-1 mt-2 text-[#ffb800]">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-xs text-gray-500">(128 đánh giá)</span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-lg font-black text-[#ff6600]">{product.price}</span>
                      <span className="text-sm text-gray-400 line-through">{product.oldPrice}</span>
                    </div>
                    <button type="button" className="mt-4 w-full h-10 border border-gray-300 rounded-md font-bold flex items-center justify-center gap-2 hover:border-[#ff6600] hover:text-[#ff6600]">
                      <ShoppingCart className="w-4 h-4" />
                      Thêm vào giỏ
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
            <div className="bg-[#182337] text-white rounded-lg p-7">
              <h2 className="text-2xl font-black mb-2">Tạo tài khoản nhận ưu đãi</h2>
              <p className="text-gray-300 mb-5">Voucher 50.000đ, miễn phí giao hàng 3 đơn đầu và theo dõi đơn hàng realtime.</p>
              <div className="space-y-3 mb-6">
                {['Lưu địa chỉ giao hàng', 'Quản lý đơn hàng dễ dàng', 'Tích điểm cho mỗi lần mua'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#ff6600]" />
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/register" className="inline-flex h-11 px-5 rounded-md bg-[#ff6600] text-white font-bold items-center justify-center hover:bg-orange-600">
                Đăng ký ngay
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="w-10 h-10 rounded-md bg-orange-50 text-[#ff6600] flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-black">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
