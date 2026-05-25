'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Heart, PackageCheck, ShoppingCart, Star, Trash2, Zap } from 'lucide-react';
import { userService } from '@/features/account/api/userService';
import { useCartStore } from '@/features/cart/store/cartStore';
import { WishlistItem } from '@/features/shared/types';

const fallbackWishlist: WishlistItem[] = [
  { id: 1, productId: '1', productName: 'Tai nghe Bluetooth Sony Pro X1', addedAt: '2026-05-12T00:00:00Z' },
  { id: 2, productId: '2', productName: 'Samsung Galaxy Watch 6 Graphite', addedAt: '2026-05-08T00:00:00Z' },
  { id: 3, productId: '3', productName: 'Áo thun Uniqlo cotton cao cấp', addedAt: '2026-05-01T00:00:00Z' },
];

const visualColors = ['bg-[#dff1ff] text-blue-500', 'bg-pink-100 text-purple-500', 'bg-green-100 text-green-600', 'bg-yellow-100 text-yellow-600'];
const recentThreshold = new Date('2026-04-25T00:00:00Z').getTime();

const formatDate = (date: string) => {
  try {
    return new Date(date).toLocaleDateString('vi-VN');
  } catch {
    return '';
  }
};

function ProductVisual({ index }: { index: number }) {
  return (
    <div className={`aspect-square rounded-lg flex items-center justify-center ${visualColors[index % visualColors.length]}`}>
      <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1c-1.657 0-3-1.343-3-3v-2c0-1.657 1.343-3 3-3h3v8z" />
        <path d="M3 19a2 2 0 0 0 2 2h1c1.657 0 3-1.343 3-3v-2c0-1.657-1.343-3-3-3H3v8z" />
      </svg>
    </div>
  );
}

export default function WishlistPage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const items = await userService.getWishlist();
        setWishlist(items);
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
        setWishlist(fallbackWishlist);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const totalCount = wishlist.length;
  const recentCount = wishlist.filter((item) => new Date(item.addedAt).getTime() >= recentThreshold).length;

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      productId: item.productId,
      productName: item.productName,
      quantity: 1,
      unitPrice: 2000,
    });
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg py-16 text-center text-gray-500">
        Đang tải sản phẩm yêu thích...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        <Link href="/" className="hover:text-[#ff6600]">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-[#ff6600] font-semibold">Sản phẩm yêu thích</span>
      </div>

      <section className="bg-[#182337] text-white rounded-lg overflow-hidden">
        <div className="p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#ff6600]/10 text-[#ff8a3d] text-sm font-bold mb-4">
              <Heart className="w-4 h-4 fill-current" />
              Danh sách yêu thích
            </div>
            <h1 className="text-3xl lg:text-4xl font-black mb-2">Lưu sản phẩm bạn muốn mua</h1>
            <p className="text-gray-300 max-w-2xl">
              Theo dõi giá, thêm nhanh vào giỏ và quay lại mua sắm bất cứ lúc nào.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[260px]">
            <div className="border border-white/10 rounded-lg p-4 bg-white/5">
              <div className="text-2xl font-black text-[#ff6600]">{totalCount}</div>
              <div className="text-sm text-gray-300">Sản phẩm đã lưu</div>
            </div>
            <div className="border border-white/10 rounded-lg p-4 bg-white/5">
              <div className="text-2xl font-black text-[#ff6600]">{recentCount}</div>
              <div className="text-sm text-gray-300">Thêm trong 30 ngày</div>
            </div>
          </div>
        </div>
      </section>

      {wishlist.length === 0 ? (
        <section className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-[#ff6600] mx-auto flex items-center justify-center mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-950 mb-2">Chưa có sản phẩm yêu thích</h2>
          <p className="text-gray-600 mb-6">Hãy khám phá sản phẩm và bấm trái tim để lưu lại.</p>
          <Link href="/products" className="inline-flex h-11 px-6 rounded-md bg-[#ff6600] text-white font-bold items-center justify-center hover:bg-orange-600">
            Khám phá sản phẩm
          </Link>
        </section>
      ) : (
        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-950">Sản phẩm yêu thích của tôi</h2>
              <p className="text-sm text-gray-600">Có {wishlist.length} sản phẩm đang được lưu</p>
            </div>
            <Link href="/products" className="text-[#ff6600] text-sm font-bold hover:underline">
              Tiếp tục mua sắm
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
            {wishlist.map((item, index) => {
              const price = 2000;
              const oldPrice = Math.round(price * 1.45);

              return (
                <article key={item.id} className="border border-gray-100 rounded-lg overflow-hidden bg-white hover:shadow-md transition group">
                  <div className="relative">
                    <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">-30%</span>
                    <button type="button" className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white text-red-500 flex items-center justify-center shadow-sm" aria-label="Đã yêu thích">
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                    <ProductVisual index={index} />
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-[#ff6600] font-bold">ShopVN</p>
                    <h3 className="font-bold line-clamp-2 h-12 text-gray-950">{item.productName}</h3>
                    <p className="text-xs text-gray-500 mt-1">Đã lưu ngày {formatDate(item.addedAt)}</p>

                    <div className="flex items-center gap-1 mt-2 text-[#ffb800]">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-xs text-gray-500">(128 đánh giá)</span>
                    </div>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-lg font-black text-[#ff6600]">{price.toLocaleString('vi-VN')}đ</span>
                      <span className="text-sm text-gray-400 line-through">{oldPrice.toLocaleString('vi-VN')}đ</span>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_auto] gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="h-10 border border-gray-300 rounded-md font-bold flex items-center justify-center gap-2 hover:border-[#ff6600] hover:text-[#ff6600]"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Thêm
                      </button>
                      <Link href={`/products/${item.productId}`} className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:border-[#ff6600] hover:text-[#ff6600]" aria-label="Xem chi tiết">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button type="button" className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:border-red-400 hover:text-red-500" aria-label="Xóa khỏi yêu thích">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start gap-3">
          <Zap className="w-8 h-8 text-[#ff6600] shrink-0" />
          <div>
            <h3 className="font-bold text-gray-950">Theo dõi ưu đãi</h3>
            <p className="text-sm text-gray-600 mt-1">Sản phẩm yêu thích giúp bạn quay lại mua nhanh hơn.</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start gap-3">
          <PackageCheck className="w-8 h-8 text-[#ff6600] shrink-0" />
          <div>
            <h3 className="font-bold text-gray-950">Hàng chính hãng</h3>
            <p className="text-sm text-gray-600 mt-1">ShopVN ưu tiên sản phẩm có bảo hành rõ ràng.</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start gap-3">
          <ShoppingCart className="w-8 h-8 text-[#ff6600] shrink-0" />
          <div>
            <h3 className="font-bold text-gray-950">Thêm vào giỏ nhanh</h3>
            <p className="text-sm text-gray-600 mt-1">Chọn sản phẩm đã lưu và đặt hàng trong vài bước.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
