'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Heart, ShoppingCart, Sparkles, Gift, Trash2 } from 'lucide-react';
import { userService } from '@/features/account/api/userService';
import { useCartStore } from '@/features/cart/store';
import { WishlistItem } from '@/components/types';
import { productService } from '@/features/product/api';
import { toast } from '@/components/layout/Toast';

interface WishlistDisplayItem extends WishlistItem {
  imageUrl?: string | null;
}

const fallbackWishlist: WishlistDisplayItem[] = [
  { id: 1, productId: '1', productName: 'Nhẫn bạc đính đá thạch anh tự nhiên', addedAt: '2026-05-12T00:00:00Z', imageUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&auto=format&fit=crop&q=80' },
  { id: 2, productId: '2', productName: 'Ly gốm tráng men hoả biến mộc mạc', addedAt: '2026-05-08T00:00:00Z', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80' },
  { id: 3, productId: '3', productName: 'Ví da nam khắc tên theo yêu cầu', addedAt: '2026-05-01T00:00:00Z', imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format&fit=crop&q=80' },
];

const formatDate = (date: string) => {
  try {
    return new Date(date).toLocaleDateString('vi-VN');
  } catch {
    return '';
  }
};



export default function WishlistPage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const initializeCart = useCartStore((state) => state.initializeCart);
  const [wishlist, setWishlist] = useState<WishlistDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => String(item.productId) !== productId));
    toast.success('Đã xóa sản phẩm khỏi danh sách yêu thích!');
  };

  useEffect(() => {
    void initializeCart();

    const fetchWishlist = async () => {
      try {
        const items = await userService.getWishlist();
        
        // Fetch product details to retrieve image urls
        const itemsWithDetails = await Promise.all(
          items.map(async (item) => {
            try {
              const product = await productService.getProductById(String(item.productId));
              const primaryImage = product.images?.find((img) => img.isPrimary && img.url);
              const firstImage = product.images?.find((img) => img.url);
              const imageUrl = primaryImage?.url ?? firstImage?.url ?? product.image ?? null;
              return { ...item, imageUrl };
            } catch (err) {
              console.error(`Failed to fetch details for product ID ${item.productId}:`, err);
              return { ...item, imageUrl: null };
            }
          })
        );
        
        setWishlist(itemsWithDetails);
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
        setWishlist(fallbackWishlist);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalCount = wishlist.length;

  const handleAddToCart = async (item: WishlistItem) => {
    await addToCart({
      productId: item.productId,
      productName: item.productName,
      quantity: 1,
      unitPrice: 280000,
    });
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#EAE3D2]/50 rounded-2xl py-20 text-center text-gray-500 text-sm font-semibold">
        Đang tải danh sách lưu trữ của bạn...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="text-xs text-gray-500 flex items-center gap-1.5 py-1">
        <Link href="/" className="hover:text-[#F1641E] transition-colors">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-400 font-medium">Sản phẩm yêu thích</span>
      </div>

      {/* Styled Top Banner */}
      <section className="bg-[#F8F2EC] border border-[#EBE0D5] rounded-2xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
        <div className="p-6 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EBF2EE] text-[#1E5C3F] text-xs font-bold rounded-full">
              <Heart className="w-3.5 h-3.5 fill-[#1E5C3F]" />
              <span>Thư viện lưu trữ</span>
            </div>
            <h1 className="font-serif text-3xl font-black text-[#5A3A22]">Lưu giữ các tác phẩm yêu thích</h1>
            <p className="text-xs text-[#7D5C45] max-w-xl">
              Theo dõi biến động giá, lưu lại ý tưởng quà tặng và dễ dàng thêm nhanh vào giỏ hàng bất cứ lúc nào.
            </p>
          </div>

          <div className="border border-[#EBE0D5] bg-white rounded-xl p-4 text-center w-32 shrink-0 shadow-sm">
            <div className="text-2xl font-serif font-black text-[#F1641E]">{totalCount}</div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Tác phẩm đã lưu</div>
          </div>
        </div>
      </section>

      {wishlist.length === 0 ? (
        <section className="bg-white border border-[#EAE3D2]/60 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-55/40 text-[#ff3333] mx-auto flex items-center justify-center mb-4 border border-red-100">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-950 mb-2">Chưa lưu sản phẩm nào</h2>
          <p className="text-xs text-gray-500 mb-6">Hãy duyệt xem cửa hàng và bấm biểu tượng trái tim để lưu lại những thứ bạn yêu thích.</p>
          <Link href="/products" className="inline-flex h-11 px-6 rounded-full bg-[#F1641E] hover:bg-[#d85213] text-white font-bold text-xs items-center justify-center transition-colors">
            Khám phá sản phẩm ngay
          </Link>
        </section>
      ) : (
        <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[#F5EFE6]/10">
            <div>
              <h2 className="font-serif font-black text-[#222222] text-base">Danh sách yêu thích của tôi</h2>
              <p className="text-[11px] text-gray-500">Đang lưu trữ {wishlist.length} tác phẩm</p>
            </div>
            <Link href="/products" className="text-[#F1641E] text-xs font-bold hover:underline">
              Tiếp tục tìm kiếm
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F5EFE6]/5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Sản phẩm</th>
                  <th className="py-4 px-4">Giá bán</th>
                  <th className="py-4 px-4">Ngày lưu</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {wishlist.map((item, index) => {
                  const price = 280000 + (index * 50000);
                  const oldPrice = Math.round(price * 1.45);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-xl border border-[#EAE3D2]/40 bg-[#FDFAF7]/60 overflow-hidden flex items-center justify-center p-2 shrink-0 shadow-inner">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.productName}
                                fill
                                className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <Gift className="w-6 h-6 text-[#F1641E] opacity-75" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <span className="inline-flex text-[9px] text-[#1E5C3F] bg-[#EBF2EE] font-bold px-1.5 py-0.5 rounded-sm">
                              Giảm 30%
                            </span>
                            <h3 className="font-bold text-xs md:text-sm text-gray-800 line-clamp-1 max-w-[280px] hover:text-[#F1641E] transition-colors leading-tight">
                              <Link href={`/products/${item.productId}`}>{item.productName}</Link>
                            </h3>
                            <span className="text-[10px] text-gray-400 font-semibold block">ShopVN Tuyển chọn</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#F1641E]">{price.toLocaleString('vi-VN')}đ</span>
                          <span className="text-[10px] text-gray-400 line-through">{oldPrice.toLocaleString('vi-VN')}đ</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-505 font-medium">
                        {formatDate(item.addedAt)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(item)}
                            className="h-8 px-4 border border-[#222222] hover:bg-[#222222] hover:text-white rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Thêm vào giỏ
                          </button>
                          <Link 
                            href={`/products/${item.productId}`} 
                            className="w-8 h-8 border border-gray-300 hover:border-[#222222] hover:text-[#222222] rounded-full flex items-center justify-center transition-colors text-gray-500 hover:text-[#222222]" 
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromWishlist(String(item.productId))}
                            className="w-8 h-8 border border-red-100 hover:border-red-500 text-red-500 rounded-full flex items-center justify-center bg-red-50/20 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Xóa khỏi yêu thích"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Value props block */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EAE3D2]/50 rounded-2xl p-5 flex items-start gap-3 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow">
          <Sparkles className="w-7 h-7 text-[#F1641E] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif font-bold text-xs md:text-sm text-gray-800">Theo dõi ưu đãi tức thì</h4>
            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Tự động cập nhật thông báo khi tác phẩm bạn lưu có đợt giảm giá hoặc sắp hết hàng.</p>
          </div>
        </div>
        <div className="bg-white border border-[#EAE3D2]/50 rounded-2xl p-5 flex items-start gap-3 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow">
          <Gift className="w-7 h-7 text-[#F1641E] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif font-bold text-xs md:text-sm text-gray-800">Lên ý tưởng quà tặng</h4>
            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Dễ dàng chuẩn bị quà tặng cho người thân trước những dịp lễ đặc biệt hoặc sinh nhật.</p>
          </div>
        </div>
        <div className="bg-white border border-[#EAE3D2]/50 rounded-2xl p-5 flex items-start gap-3 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow">
          <ShoppingCart className="w-7 h-7 text-[#F1641E] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif font-bold text-xs md:text-sm text-gray-800">Thanh toán tức thời</h4>
            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Đặt hàng nhanh chóng chỉ với 2 click chuột trực tiếp từ danh mục yêu thích.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
