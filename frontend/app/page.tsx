'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  Heart,
  Star,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Gift,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import Footer from '@/features/shared/components/Footer';
import Navbar from '@/features/shared/components/Navbar';

// Warm, Etsy-style interests with matching aesthetic image URLs
const interests = [
  {
    name: 'Đèn treo tường sáng tạo',
    subtitle: 'Nghệ thuật chiếu sáng',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Nhẫn gỗ & keo Resin',
    subtitle: 'Tác phẩm độc bản',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Túi dệt thủ công',
    subtitle: 'Phong cách tối giản',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Kệ gỗ mây đám mây',
    subtitle: 'Trang trí phòng trẻ em',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80',
  },
];

const summerCollections = [
  { name: 'Quà Ngày của Cha', imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&auto=format&fit=crop&q=80' },
  { name: 'Bướm kính Stained Glass', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&auto=format&fit=crop&q=80' },
  { name: 'Nhẫn đá màu tím oải hương', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80' },
  { name: 'Trang sức cổ điển hoàng gia', imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&auto=format&fit=crop&q=80' },
  { name: 'Đồ thủy tinh Vintage', imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80' },
];

const birthdayGifts = [
  { name: 'Hộp máy ảnh cổ điển da bò', imageUrl: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=500&auto=format&fit=crop&q=80', category: 'Thiết bị & Da' },
  { name: 'Chân dung vẽ tay theo yêu cầu', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=80', category: 'Tranh chân dung' },
  { name: 'Rượu vang nhãn gỗ khắc tên', imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&auto=format&fit=crop&q=80', category: 'Quà tặng ẩm thực' },
];

const smallPills = [
  { title: 'Áo thun thêu tay', imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80' },
  { title: 'Móc khóa khắc chữ', imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=200&auto=format&fit=crop&q=80' },
  { title: 'Nhẫn bạc đính đá', imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&auto=format&fit=crop&q=80' },
  { title: 'Thiệp cưới Pop-up', imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=200&auto=format&fit=crop&q=80' },
  { title: 'Bóp da bò tối giản', imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&auto=format&fit=crop&q=80' },
];

const vintageFinds = [
  { title: 'Tranh in thực vật học 1890', category: 'Tranh treo tường', imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80' },
  { title: 'Ghế đôn gỗ Teak xưa', category: 'Nội thất & Decor', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&auto=format&fit=crop&q=80' },
  { title: 'Váy kẻ hồng Vintage', category: 'Thời trang nữ', imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&auto=format&fit=crop&q=80' },
  { title: 'Ly sứ tráng men mộc', category: 'Cốc chén Vintage', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80' },
  { title: 'Tranh thêu tay hoa cúc', category: 'Nghệ thuật thêu', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=80' },
  { title: 'Khăn len choàng cổ tay', category: 'Phụ kiện len', imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&auto=format&fit=crop&q=80' },
];

const flashSaleProducts = [
  { id: '1', name: 'Nhẫn đôi đính đá thạch anh tím tự nhiên', brand: 'An Nhiên Silver', price: '380.000đ', oldPrice: '480.000đ', discount: '20%', imageUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&auto=format&fit=crop&q=80' },
  { id: '2', name: 'Ly gốm tráng men hoả biến mộc mạc', brand: 'Gốm Sứ Đông Gia', price: '160.000đ', oldPrice: '220.000đ', discount: '27%', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80' },
  { id: '3', name: 'Ví da nam khâu tay khắc tên theo yêu cầu', brand: 'Đồ Da Khang Huy', price: '290.000đ', oldPrice: '390.000đ', discount: '25%', imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format&fit=crop&q=80' },
  { id: '4', name: 'Tranh in Canvas vẽ tay sơn dầu dã ngoại', brand: 'Lộc Art Studio', price: '240.000đ', oldPrice: '320.000đ', discount: '25%', imageUrl: 'https://images.unsplash.com/photo-1501472312651-726afd116ff1?w=400&auto=format&fit=crop&q=80' },
];

const personalizationGrid = [
  { title: 'Túi vải Canvas thêu tên riêng', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=450&auto=format&fit=crop&q=80' },
  { title: 'Khung ảnh gỗ thông khắc thông điệp', imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=450&auto=format&fit=crop&q=80' },
  { title: 'Tranh chữ nổi cúc họa mi', imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=450&auto=format&fit=crop&q=80' },
  { title: 'Khay sứ đựng nhẫn trái tim xanh', imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=450&auto=format&fit=crop&q=80' },
];

const standoutStyles = [
  { name: 'Cốc sứ Ngày của Cha', imageUrl: 'https://images.unsplash.com/photo-1536304997881-a372c179924b?w=400&auto=format&fit=crop&q=80' },
  { name: 'Con dấu bánh Burger khắc gỗ', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&auto=format&fit=crop&q=80' },
  { name: 'Áo Hoodie in họa tiết sơn mài', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&auto=format&fit=crop&q=80' },
  { name: 'Găng tay làm vườn thêu hoa', imageUrl: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?w=400&auto=format&fit=crop&q=80' },
  { name: 'Đệm nằm thú cưng đan len sợi lớn', imageUrl: 'https://images.unsplash.com/photo-1541599540903-216a46ca1df0?w=400&auto=format&fit=crop&q=80' },
];

const benefits = [
  { title: 'Hỗ trợ nghệ nhân Việt', description: 'Đồng hành cùng 500+ hộ kinh doanh thủ công mỹ nghệ', icon: Gift },
  { title: 'Thanh toán bảo mật', description: 'Bảo vệ giao dịch an toàn 100% tự động qua SePay', icon: ShieldCheck },
  { title: 'Đổi trả dễ dàng', description: 'Đổi trả miễn phí trong 30 ngày nếu móp vỡ', icon: RefreshCw },
  { title: 'Giao hàng nhanh chóng', description: 'Đóng gói tái chế chống sốc, vận chuyển toàn quốc', icon: Truck },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFAF7] text-[#222222] font-sans antialiased">
      <Navbar />

      <main className="max-w-[1360px] mx-auto px-5 py-6 md:py-10 space-y-16">
        
        {/* Double Hero Split-Screen Banner */}
        <section className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4">
          {/* Left Hero */}
          <div className="bg-[#0e4a42] rounded-2xl overflow-hidden relative min-h-[380px] md:min-h-[440px] flex flex-col md:flex-row items-center justify-between p-8 md:p-12 text-white group shadow-sm">
            <div className="space-y-5 max-w-sm relative z-10 text-left">
              <h2 className="font-serif text-3.5xl md:text-5xl font-black leading-tight">
                Tuyển chọn Quà Ngày của Cha tốt nhất
              </h2>
              <p className="text-sm text-gray-200 leading-relaxed font-sans font-medium">
                Dành tặng bố những món quà làm thủ công đong đầy ý nghĩa, những chiếc ví da bò khắc tên hoặc quà tặng lưu niệm chạm trổ tinh xảo nhất.
              </p>
              <div className="pt-2">
                <Link href="/products?category=fathers-day" className="inline-flex items-center gap-2 bg-[#FDFAF7] hover:bg-white text-[#0e4a42] font-bold text-xs px-6 py-3.5 rounded-full transition-all duration-300 shadow-md">
                  Xem ngay ý tưởng
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            {/* Image section inside the card */}
            <div className="w-full md:w-[280px] h-[220px] md:h-[320px] relative rounded-2xl overflow-hidden mt-6 md:mt-0 shrink-0 border border-white/10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?w=800&auto=format&fit=crop&q=80" 
                alt="Quà Ngày của Cha" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/5"></div>
            </div>
          </div>

          {/* Right Hero */}
          <div className="rounded-2xl overflow-hidden relative min-h-[380px] md:min-h-[440px] flex flex-col justify-end p-8 md:p-10 text-white group shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&auto=format&fit=crop&q=80" 
              alt="Bộ sưu tập cung Song Tử" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10"></div>
            <div className="relative z-10 space-y-4 text-left">
              <span className="bg-[#F1641E] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider self-start inline-block">
                Quà Tặng Chiêm Tinh
              </span>
              <h2 className="font-serif text-3xl md:text-4.5xl font-black leading-tight">
                Gợi ý độc bản cho chòm sao của bạn
              </h2>
              <p className="text-xs md:text-sm text-gray-200 font-medium max-w-sm">
                Từ những món đồ trang sức đá thiên thạch lung linh đến các phụ kiện mang đậm chất vũ trụ huyền bí.
              </p>
              <div className="pt-2">
                <Link href="/products?category=gifts" className="inline-flex items-center gap-2 bg-[#F1641E] hover:bg-[#d85213] text-white font-bold text-xs px-6 py-3.5 rounded-full transition-all duration-300 shadow-md">
                  Khám phá BST Song Tử
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Jump Into Your Interests */}
        <section className="space-y-8 text-center">
          <h2 className="font-serif text-2.5xl md:text-3.5xl font-black text-[#222222]">
            Khám phá các chủ đề được quan tâm nhiều nhất
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {interests.map((item) => (
              <Link key={item.name} href="/products" className="flex flex-col items-center text-center group cursor-pointer">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border border-[#EAE3D2]/60 hover:shadow-lg hover:border-[#F1641E]/40 transition-all duration-300 relative">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/5 hover:bg-black/10 transition-colors"></div>
                </div>
                <h3 className="font-serif font-black text-sm md:text-base text-gray-800 mt-4 group-hover:text-[#F1641E] transition-colors leading-tight">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-medium">{item.subtitle}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Section: Discover our best of summer 2026 */}
        <section className="space-y-6">
          <div className="flex justify-between items-end border-b border-[#EAE3D2]/50 pb-4">
            <h2 className="font-serif text-xl md:text-2.5xl font-black text-[#222222]">
              Tuyển chọn tốt nhất mùa Hè 2026
            </h2>
            <Link href="/products" className="text-xs md:text-sm font-bold text-[#F1641E] hover:underline flex items-center gap-1">
              Xem tất cả danh mục
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {summerCollections.map((col) => (
              <Link key={col.name} href="/products" className="bg-white border border-[#EAE3D2]/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:shadow-md hover:border-[#F1641E]/30 transition-all duration-300 group cursor-pointer">
                <div className="w-full aspect-square rounded-xl mb-4 overflow-hidden border border-gray-100">
                  <img 
                    src={col.imageUrl} 
                    alt={col.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="font-serif font-black text-xs md:text-sm group-hover:text-[#F1641E] transition-colors line-clamp-1 leading-snug">
                  {col.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section: Birthday Gifts Showcase */}
        <section className="bg-white border border-[#EAE3D2]/60 rounded-2xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-[1.1fr_2.2fr] gap-10 items-center shadow-sm">
          <div className="space-y-5 text-center lg:text-left">
            <span className="text-[#F1641E] font-bold text-xs uppercase tracking-widest bg-[#FDFAF7] px-4 py-1.5 rounded-full border border-[#EAE3D2]/60 inline-block">
              Quà tặng Sinh nhật
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-black leading-tight text-[#222222]">
              Quà sinh nhật độc đáo & ý nghĩa nhất
            </h2>
            <p className="text-xs md:text-sm text-gray-500 max-w-sm mx-auto lg:mx-0 leading-relaxed font-medium">
              Tìm kiếm các tác phẩm nghệ thuật chế tác thủ công tỉ mỉ để lưu giữ những khoảnh khắc đặc sắc nhất trong ngày sinh nhật của người thương yêu.
            </p>
            <div className="pt-2">
              <Link href="/products" className="inline-flex h-11 px-6 rounded-full border-2 border-[#222222] hover:bg-[#222222] hover:text-white text-xs font-bold items-center justify-center transition-all duration-200">
                Tìm kiếm quà tặng sinh nhật
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {birthdayGifts.map((gift) => (
                <div key={gift.name} className="border border-gray-250 bg-[#FDFAF7]/40 rounded-xl overflow-hidden shadow-sm group">
                  <div className="aspect-[4/3] w-full overflow-hidden relative">
                    <img 
                      src={gift.imageUrl} 
                      alt={gift.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 text-left">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{gift.category}</span>
                    <h3 className="font-serif font-bold text-xs md:text-sm text-gray-800 line-clamp-1 mt-1 leading-tight">
                      {gift.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Small Pills sub-section */}
            <div className="border-t border-[#EAE3D2]/50 pt-5">
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {smallPills.map((pill) => (
                  <Link 
                    key={pill.title} 
                    href="/products" 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#EAE3D2] bg-white text-[11px] font-bold text-gray-700 hover:border-[#F1641E] hover:text-[#F1641E] transition-all duration-200"
                  >
                    <img src={pill.imageUrl} alt={pill.title} className="w-5 h-5 rounded-full object-cover" />
                    {pill.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section: Shop our most-loved vintage finds */}
        <section className="space-y-6">
          <div className="flex justify-between items-end border-b border-[#EAE3D2]/50 pb-4">
            <h2 className="font-serif text-xl md:text-2.5xl font-black text-[#222222]">
              Sản phẩm Vintage được yêu thích nhất
            </h2>
            <Link href="/products" className="text-xs md:text-sm font-bold text-[#F1641E] hover:underline flex items-center gap-1">
              Khám phá đồ cổ cổ điển
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {vintageFinds.map((item) => (
              <Link key={item.title} href="/products" className="group flex flex-col cursor-pointer bg-white border border-[#EAE3D2]/40 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300">
                <div className="aspect-[4/5] w-full overflow-hidden bg-gray-50 border-b border-gray-100">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 text-left">
                  <span className="text-[9px] text-[#1E5C3F] bg-[#EBF2EE] font-bold px-2 py-0.5 rounded-sm inline-block mb-1">
                    {item.category}
                  </span>
                  <h4 className="font-semibold text-xs text-gray-800 line-clamp-1 leading-snug group-hover:text-[#F1641E] transition-colors" title={item.title}>
                    {item.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section: Today's top deals (Flash Sale) */}
        <section className="bg-[#FDFAF7] border border-[#EAE3D2]/70 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[#EAE3D2]/50 flex flex-wrap items-center justify-between gap-3 bg-[#F5EFE6]/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#EBF2EE] text-[#1E5C3F] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h2 className="font-serif text-lg md:text-xl font-extrabold text-[#222222]">Ưu đãi hấp dẫn nhất hôm nay</h2>
                <p className="text-[11px] text-gray-500">Ưu đãi độc quyền giới hạn số lượng và thời gian</p>
              </div>
            </div>
            <Link href="/products?category=sale" className="text-[#F1641E] font-bold text-xs flex items-center gap-1 hover:underline">
              Xem tất cả ưu đãi
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white">
            {flashSaleProducts.map((product) => (
              <Link key={product.name} href={`/products/${product.id}`} className="border border-gray-150 rounded-xl overflow-hidden bg-white hover:shadow-md transition duration-300 group flex flex-col h-full relative cursor-pointer">
                <span className="absolute top-2.5 left-2.5 z-10 bg-[#EBF2EE] text-[#1E5C3F] text-[10px] font-bold px-2.5 py-0.5 rounded-sm">
                  Giảm {product.discount}
                </span>
                <button type="button" className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white text-gray-400 flex items-center justify-center shadow-sm hover:text-red-500 transition-colors cursor-pointer" aria-label="Yêu thích">
                  <Heart className="w-4 h-4" />
                </button>
                {/* Product Image */}
                <div className="aspect-square w-full overflow-hidden bg-gray-50/50 flex items-center justify-center relative border-b border-gray-100">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between text-left">
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.brand}</p>
                    <h3 className="font-semibold text-xs md:text-sm text-gray-800 line-clamp-2 leading-tight h-9 group-hover:text-[#F1641E] transition-colors" title={product.name}>
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[#ffb800] pt-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-[10px] text-gray-500 font-semibold">4.9 (182)</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-[#F1641E]">{product.price}</span>
                      <span className="text-xs text-gray-400 line-through font-medium">{product.oldPrice}</span>
                    </div>
                    <span className="text-[10px] text-[#1E5C3F] font-bold block mt-1.5 bg-[#EBF2EE] px-2 py-0.5 rounded-sm w-fit">
                      Miễn phí vận chuyển
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section: The Personalization Shop */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_2.2fr] gap-10 items-stretch bg-white border border-[#EAE3D2]/60 rounded-2xl overflow-hidden p-6 md:p-10 shadow-sm">
          {/* Left Column Description */}
          <div className="flex flex-col justify-between py-2 text-center lg:text-left space-y-6">
            <div className="space-y-4">
              <span className="text-[#1E5C3F] font-bold text-xs uppercase tracking-widest bg-[#EBF2EE] px-4 py-1.5 rounded-full inline-block">
                Cá Nhân Hóa
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-black leading-tight text-[#222222]">
                Cửa hàng quà tặng cá nhân hóa
              </h2>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium">
                Khắc tên, in thông điệp đặc biệt lên tranh gỗ, ví da, túi vải, hoặc cốc sứ để tạo nên món quà độc bản gửi tặng người trân quý.
              </p>
            </div>
            <div>
              <Link href="/products" className="inline-flex h-11 px-6 rounded-full bg-[#1E5C3F] hover:bg-[#15412c] text-white font-bold text-xs items-center justify-center transition-all duration-300 shadow-sm">
                Bắt đầu thiết kế riêng
              </Link>
            </div>
          </div>

          {/* Right Column Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {personalizationGrid.map((item) => (
              <div key={item.title} className="flex flex-col bg-[#FDFAF7]/30 border border-[#EAE3D2]/45 rounded-xl overflow-hidden group shadow-sm">
                <div className="aspect-square w-full overflow-hidden relative">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                </div>
                <div className="p-3 text-left flex-grow flex items-center">
                  <h4 className="font-serif font-black text-xs text-gray-800 line-clamp-2 leading-tight">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Save now on standout styles */}
        <section className="space-y-8 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-black text-[#222222]">
            Tiết kiệm thông minh với các thiết kế nổi bật
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {standoutStyles.map((item) => (
              <Link key={item.name} href="/products" className="flex flex-col items-center group cursor-pointer">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border border-[#EAE3D2]/60 hover:shadow-lg transition-all duration-300 relative">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-semibold text-xs md:text-sm text-gray-700 mt-4 leading-tight group-hover:text-[#F1641E] transition-colors max-w-[140px] text-center">
                  {item.name}
                </h4>
              </Link>
            ))}
          </div>
        </section>

        {/* Section: What is ShopVN (Brand Value Prop) */}
        <section className="bg-[#F5EFE6]/30 border border-[#EAE3D2]/50 rounded-2xl p-8 md:p-12 text-center space-y-8">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="font-serif text-3xl md:text-4xl font-black text-[#222222]">ShopVN là gì?</h2>
            <p className="text-xs md:text-sm text-gray-600 font-serif italic">Nơi trao gửi tình yêu thủ công nghệ thuật và sự độc bản</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            <div className="space-y-3 p-2">
              <h3 className="font-serif font-black text-base md:text-lg text-gray-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F1641E]"></span>
                Cộng đồng nghệ nhân bền vững
              </h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium">
                Chúng tôi hướng tới một hệ sinh thái thương mại thủ công hỗ trợ trực tiếp các nghệ nhân và nhà thiết kế độc lập, bảo tồn các giá trị làng nghề Việt Nam.
              </p>
            </div>
            <div className="space-y-3 p-2">
              <h3 className="font-serif font-black text-base md:text-lg text-gray-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E5C3F]"></span>
                Sản phẩm độc bản không sản xuất hàng loạt
              </h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium">
                Nói không với hàng hóa công nghiệp sản xuất đại trà. Mỗi tác phẩm đều được dồn hết tâm huyết sáng tạo của các nghệ nhân tỉ mỉ khâu, nặn, sơn, gọt.
              </p>
            </div>
            <div className="space-y-3 p-2">
              <h3 className="font-serif font-black text-base md:text-lg text-gray-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5A3A22]"></span>
                Đảm bảo sự an tâm mua sắm
              </h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium">
                Hệ thống xác thực giao dịch chuyển khoản VietQR nhanh chóng bảo mật, chính sách đóng gói chuyên dụng, hỗ trợ bảo hiểm móp vỡ sản phẩm.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#EAE3D2]/50 max-w-md mx-auto">
            <p className="text-xs text-gray-600 font-bold">Bạn có bất kỳ câu hỏi nào? Đội ngũ ShopVN sẵn sàng trợ giúp.</p>
            <Link href="/products" className="inline-flex mt-3 text-xs font-bold text-[#F1641E] hover:underline items-center gap-1">
              Truy cập trung tâm trợ giúp người mua
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Subscribe newsletter banner */}
        <section className="bg-[#EBE8F5] border border-[#DDD8EF] rounded-2xl p-8 md:p-12 text-center flex flex-col items-center justify-center space-y-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-serif text-2xl md:text-3.5xl font-black text-[#231F2D] leading-tight">
              Nhận thông báo ưu đãi độc quyền & ý tưởng quà tặng
            </h2>
            <p className="text-xs md:text-sm text-[#504A62] font-medium leading-relaxed">
              Nhập email để đồng hành cùng ShopVN. Chúng tôi sẽ gửi các bản tin về nghệ nhân và các ưu đãi đặc biệt sớm nhất.
            </p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); alert('Đăng ký email nhận tin thành công!'); }} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <input 
              type="email" 
              placeholder="Nhập email của bạn..." 
              required
              className="flex-grow h-11 px-5 rounded-full border border-gray-300 focus:border-[#F1641E] focus:outline-none focus:ring-1 focus:ring-[#F1641E]/30 text-xs bg-white text-[#222222]"
            />
            <button 
              type="submit" 
              className="h-11 px-6 rounded-full bg-[#231F2D] hover:bg-[#17141E] text-white font-bold text-xs transition-colors shrink-0 shadow-sm"
            >
              Đăng ký nhận tin
            </button>
          </form>
        </section>

        {/* Brand Guarantees Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="bg-white border border-[#EAE3D2]/50 rounded-2xl p-5 shadow-[0_2px_4px_rgba(0,0,0,0.01)] flex gap-4 items-start group hover:shadow-md transition-all duration-300 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#F5EFE6]/50 text-[#F1641E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs md:text-sm text-gray-800">{b.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug font-medium">{b.description}</p>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <Footer />
    </div>
  );
}
