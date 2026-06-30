'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Award,
  Trash2,
} from 'lucide-react';
import { productService } from '@/features/product/api';
import { useCartStore } from '@/features/cart/store';
import { Product, ProductAttribute, ProductVariant, ProductReview } from '@/features/product/types';
import { userService } from '@/features/account/api/userService';
import { tokenStore } from '@/features/shared/api/tokenStore';
import { toast } from '@/components/layout/Toast';

const colorOptions = [
  { name: 'Đen mờ', className: 'bg-[#2E2E2E]' },
  { name: 'Cam đất', className: 'bg-[#D55D24]' },
  { name: 'Đỏ gạch', className: 'bg-[#B24C4C]' },
  { name: 'Xanh rêu', className: 'bg-[#556B2F]' },
];

const fallbackSpecs: ProductAttribute[] = [
  { name: 'Thương hiệu', value: 'Sony' },
  { name: 'Model', value: 'Pro X1' },
  { name: 'Kết nối', value: 'Bluetooth 5.3' },
  { name: 'Thời lượng pin', value: '30 giờ (ANC bật)' },
  { name: 'Chống ồn', value: 'ANC chủ động' },
  { name: 'Driver', value: '40mm Dynamic' },
  { name: 'Trọng lượng', value: '254g' },
  { name: 'Bảo hành', value: '12 tháng chính hãng' },
];

const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}đ`;

function getProductImage(product: Product | null) {
  if (!product) return null;
  const primaryImage = product.images?.find((image) => image.isPrimary && image.url);
  const firstImage = product.images?.find((image) => image.url);
  return primaryImage?.url ?? firstImage?.url ?? product.image ?? null;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: productId } = use(params);
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const initializeCart = useCartStore((state) => state.initializeCart);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].name);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeTab, setActiveTab] = useState('specs');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Review states
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const currentUserId = useMemo<number | null>(() => {
    const userId = tokenStore.getUserId();
    return userId ? Number(userId) : null;
  }, []);

  useEffect(() => {
    void initializeCart();
  }, [initializeCart]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(productId);
        setProduct(data);
        setSelectedVariant(data.variants?.[0] ?? null);
        setSelectedImageIndex(0);

        // Pre-fetch reviews count
        const reviewsData = await productService.getProductReviews(productId, 0, 1);
        if (reviewsData) {
          setTotalReviews(reviewsData.totalElements ?? 0);
        }
      } catch (err) {
        console.error('Fetch product error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  useEffect(() => {
    if (activeTab !== 'reviews') return;

    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const data = await productService.getProductReviews(productId);
        if (data && data.content) {
          setReviews(data.content);
          setTotalReviews(data.totalElements ?? data.content.length);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [productId, activeTab]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || !newTitle.trim()) {
      toast.warning('Vui lòng điền đầy đủ tiêu đề và nội dung nhận xét!');
      return;
    }
    setSubmittingReview(true);
    try {
      const addedReview = await productService.createProductReview(productId, newRating, newTitle, newContent);
      toast.success('Gửi nhận xét thành công!');
      setReviews((prev) => [addedReview, ...prev]);
      setTotalReviews((prev) => prev + 1);
      
      // Clear form
      setNewTitle('');
      setNewContent('');
      setNewRating(5);
    } catch (err) {
      console.error('Failed to submit review:', err);
      toast.error('Gửi nhận xét thất bại. Vui lòng thử lại!');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhận xét này không?')) return;
    try {
      await productService.deleteProductReview(reviewId);
      toast.success('Đã xóa nhận xét thành công!');
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setTotalReviews((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to delete review:', err);
      toast.error('Xóa nhận xét thất bại!');
    }
  };



  const displayProduct = useMemo<Product>(
    () =>
      product ?? {
        id: productId,
        sku: 'SONY-PRO-X1',
        name: 'Tai nghe Bluetooth Sony Pro X1 - Chống ồn ANC, 30h pin',
        price: 2000,
        stock: 248,
        description:
          'Tai nghe Bluetooth cao cấp với chống ồn chủ động, âm thanh cân bằng và thời lượng pin dài.',
        categoryName: 'Âm thanh',
        attributes: fallbackSpecs,
      },
    [productId, product]
  );

  const unitPrice = selectedVariant ? selectedVariant.price : displayProduct.price;
  const displayPrice = unitPrice;
  const originalPrice = Math.round(displayPrice * 1.55);
  const saving = originalPrice - displayPrice;
  const stock = selectedVariant ? selectedVariant.stock : displayProduct.availableStock ?? displayProduct.stock;
  const specs = displayProduct.attributes?.length ? displayProduct.attributes : fallbackSpecs;
  const productImages = displayProduct.images?.filter((image) => image.url) ?? [];
  const displayImage = productImages[selectedImageIndex]?.url ?? getProductImage(displayProduct);

  const handleAddToCart = async () => {
    await addToCart({
      productId: displayProduct.id,
      quantity,
      productName: selectedVariant ? `${displayProduct.name} - ${selectedVariant.name}` : displayProduct.name,
      unitPrice,
      sku: selectedVariant ? selectedVariant.skuCode : displayProduct.sku,
    });
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/cart');
  };

  const handleAddToWishlist = async () => {
    try {
      const userId = tokenStore.getUserId();
      if (!userId) {
        toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích!');
        return;
      }
      await userService.addToWishlist(userId, Number(displayProduct.id), displayProduct.name);
      toast.success('Đã thêm sản phẩm vào danh sách yêu thích!');
    } catch (err) {
      console.error('Failed to add to wishlist', err);
      toast.error('Có lỗi xảy ra khi thêm sản phẩm vào danh sách yêu thích.');
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-gray-500 font-semibold text-sm">Đang tải thông tin chi tiết tác phẩm...</div>;
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumb bar */}
      <div className="text-xs text-gray-500 flex flex-wrap items-center gap-1.5 py-2 px-1 border-b border-gray-100">
        <Link href="/" className="hover:text-[#F1641E] transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#F1641E] transition-colors">Tuyển chọn</Link>
        <span>/</span>
        <span className="text-gray-400 font-medium line-clamp-1 max-w-xs">{displayProduct.name}</span>
      </div>

      <div className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden shadow-sm">
        <section className="grid grid-cols-1 lg:grid-cols-[55%_45%]">
          
          {/* Left Column: Image Preview Gallery */}
          <div className="p-6 lg:border-r border-[#EAE3D2]/50">
            <div className="max-w-[500px] w-full mx-auto flex flex-col gap-2">
            <div className="relative aspect-square w-full bg-[#FDFAF7]/60 rounded-xl flex items-center justify-center overflow-hidden border border-[#EAE3D2]/30 shadow-inner">
              <span className="absolute top-4 left-4 bg-[#EBF2EE] text-[#1E5C3F] text-[10px] font-bold px-2.5 py-0.5 rounded-sm">
                Độ độc quyền cao
              </span>
              <span className="absolute top-4 right-4 bg-[#ff3333] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                Giảm 35%
              </span>
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={displayProduct.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-12 hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-[#F1641E] opacity-50 flex flex-col items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-24 h-24">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                </div>
              )}
            </div>

            {/* Micro visual thumb previews */}
            <div className="mt-0">
              {productImages.length > 0 ? (
                <div className="flex gap-2 justify-center flex-wrap">
                  {productImages.map((image, index) => (
                    <button
                      key={image.id ?? `${image.mediaId}-${index}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-14 h-14 rounded-lg border overflow-hidden bg-white flex items-center justify-center transition-all duration-200 shadow-sm ${
                        index === selectedImageIndex
                          ? 'border-[#F1641E] ring-1 ring-[#F1641E]'
                          : 'border-gray-200 hover:border-[#F1641E]'
                      }`}
                      aria-label={`Ảnh xem trước ${index + 1}`}
                    >
                      <Image
                        src={image.url as string}
                        alt={`${displayProduct.name} ${index + 1}`}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`w-14 h-14 rounded-lg border flex items-center justify-center bg-gray-50/50 cursor-default transition-all duration-200 ${
                        num === 1 ? 'border-[#F1641E] ring-1 ring-[#F1641E]' : 'border-gray-200'
                      }`}
                      aria-label={`Ảnh xem trước ${num}`}
                      disabled
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gray-400">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      </svg>
                    </button>
                  ))}
                </div>
              )}
            </div>
            </div>
          </div>

          {/* Right Column: Sticky Order Panel */}
          <div className="p-6 md:p-8 space-y-6 bg-white">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F1641E] tracking-wider uppercase">
                <Award className="w-4 h-4 shrink-0" />
                <span>{displayProduct.categoryName || 'Tác phẩm độc bản'}</span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-black leading-tight text-[#222222]">
                {displayProduct.name}
              </h1>
              
              <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                <div className="flex text-[#ffb800]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-bold text-gray-700">4.9 (128 đánh giá)</span>
                <span>•</span>
                <span>Đã bán 1.2k sản phẩm</span>
              </div>
            </div>

            {/* Price Details Box */}
            <div className="bg-[#FDFAF7] border border-[#EAE3D2]/60 rounded-2xl p-5 space-y-3 shadow-inner">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-serif font-black text-[#F1641E]">{formatVnd(displayPrice)}</span>
                <span className="text-sm text-gray-400 line-through">{formatVnd(originalPrice)}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="bg-[#EBF2EE] text-[#1E5C3F] px-2.5 py-1 rounded font-bold">
                  Tiết kiệm {formatVnd(saving)} (-35%)
                </span>
                <span className="text-gray-500 font-semibold">
                  Trả góp 0% chỉ từ <strong className="text-[#F1641E]">{formatVnd(displayPrice / 3)}/tháng</strong>
                </span>
              </div>
            </div>

            {/* Color selection layout */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-[#222222] text-xs uppercase tracking-wider">Màu sắc tuyển chọn</h4>
              <div className="flex gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full ${color.className} cursor-pointer transition-all duration-200 ${
                      selectedColor === color.name ? 'ring-2 ring-[#F1641E] ring-offset-2 scale-105' : 'border border-gray-200'
                    }`}
                    title={color.name}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Variant version layout */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-[#222222] text-xs uppercase tracking-wider">Phiên bản chế tác</h4>
              <div className="flex flex-wrap gap-2">
                {(displayProduct.variants?.length ? displayProduct.variants : [
                  { id: 1, name: 'Bản Tiêu chuẩn', skuCode: displayProduct.sku || 'STD', price: displayProduct.price, stock },
                  { id: 2, name: 'Bản Cao cấp Pro', skuCode: 'PRO', price: displayProduct.price * 1.15, stock },
                  { id: 3, name: 'Bản Giới hạn Limited', skuCode: 'LIMITED', price: displayProduct.price * 1.35, stock },
                ]).map((variant) => {
                  const active = selectedVariant?.id === variant.id || (!selectedVariant && variant.name === 'Bản Tiêu chuẩn');
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2.5 rounded-full border text-xs font-bold transition-all duration-200 cursor-pointer ${
                        active 
                          ? 'bg-[#222222] border-[#222222] text-white shadow-sm' 
                          : 'bg-white border-gray-300 text-gray-700 hover:border-[#222222]'
                      }`}
                    >
                      {variant.name} (+{formatVnd(variant.price - displayProduct.price)})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector Layout */}
            <div className="flex items-center gap-4 pt-1">
              <span className="font-bold text-[#222222] text-xs uppercase tracking-wider">Số lượng mua</span>
              <div className="inline-flex items-center border border-gray-300 rounded-full h-10 px-1.5 bg-white">
                <button 
                  type="button" 
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))} 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-9 text-center text-sm font-bold">{quantity}</span>
                <button 
                  type="button" 
                  onClick={() => setQuantity((value) => Math.min(stock || 999, value + 1))} 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[#1E5C3F] text-xs font-semibold bg-[#EBF2EE] px-2.5 py-1 rounded-full">
                Sẵn có: {stock} sản phẩm
              </span>
            </div>

            {/* Order Action Buttons - Pill Shaped */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button 
                type="button" 
                onClick={handleAddToCart} 
                className="flex-1 min-h-[46px] border-2 border-[#222222] bg-white hover:bg-gray-50 text-[#222222] rounded-full font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                Thêm vào giỏ hàng
              </button>
              <button 
                type="button" 
                onClick={handleBuyNow} 
                className="flex-1 min-h-[46px] bg-[#F1641E] hover:bg-[#d85213] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
              >
                Mua ngay lập tức
              </button>
              <button 
                type="button" 
                onClick={handleAddToWishlist}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-400 bg-white shadow-sm cursor-pointer transition-all duration-200" 
                aria-label="Yêu thích"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Trust highlights */}
            <div className="border-t border-gray-100 pt-5 grid grid-cols-2 gap-3.5 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4.5 h-4.5 text-[#1E5C3F]" />
                <span>Miễn phí giao hàng</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-[#1E5C3F]" />
                <span>Giao dịch an toàn 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4.5 h-4.5 text-[#1E5C3F]" />
                <span>Đổi trả trong 30 ngày</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-[#1E5C3F]" />
                <span>Thương hiệu nghệ nhân</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Tabs description section */}
      <section className="bg-white border border-[#EAE3D2]/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex border-b border-[#EAE3D2]/50 bg-[#F5EFE6]/25">
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
              activeTab === 'specs' 
                ? 'text-[#F1641E] border-[#F1641E]' 
                : 'text-gray-500 border-transparent hover:text-black'
            }`}
          >
            Thông số sản phẩm
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('description')}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
              activeTab === 'description' 
                ? 'text-[#F1641E] border-[#F1641E]' 
                : 'text-gray-500 border-transparent hover:text-black'
            }`}
          >
            Mô tả chi tiết
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
              activeTab === 'reviews' 
                ? 'text-[#F1641E] border-[#F1641E]' 
                : 'text-gray-500 border-transparent hover:text-black'
            }`}
          >
            Nhận xét khách hàng ({totalReviews})
          </button>
        </div>

        <div className="p-6 md:p-8">
          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <table className="w-full text-xs border-collapse rounded-xl overflow-hidden">
                <tbody>
                  {specs.map((spec, index) => (
                    <tr key={`${spec.name}-${index}`} className={index % 2 === 0 ? 'bg-[#F9F6F0]' : 'bg-white'}>
                      <td className="w-2/5 px-5 py-3.5 text-gray-500 border-b border-[#EAE3D2]/30 font-medium">{spec.name}</td>
                      <td className="px-5 py-3.5 font-bold text-gray-800 border-b border-[#EAE3D2]/30">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'description' && (
            <div className="max-w-3xl space-y-4 text-sm text-gray-650 leading-relaxed">
              <p className="font-semibold text-gray-800 text-base">Về tác phẩm này:</p>
              <p>{displayProduct.description}</p>
              <p>
                Tất cả các sản phẩm được trưng bày trên ShopVN đều trải qua quy trình kiểm định chất lượng gắt gao. 
                Sản phẩm được chế tác hoàn toàn từ vật liệu tự nhiên, thân thiện với môi trường và an toàn cho người sử dụng.
              </p>
              <p className="italic text-xs text-gray-400">
                * Lưu ý: Vì sản phẩm được làm thủ công bằng tay từ vật liệu tự nhiên, màu sắc và các đường vân nhỏ có thể có sự sai lệch nhẹ so với hình ảnh minh họa, tạo nên nét độc bản duy nhất của tác phẩm bạn nhận được.
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-8">
              {/* Score rating summary and Form */}
              <div className="space-y-6">
                <div className="bg-[#FDFAF7] border border-[#EAE3D2]/40 rounded-2xl p-6 text-center lg:text-left space-y-4">
                  <div className="flex flex-col lg:items-start items-center">
                    <span className="text-6xl font-serif font-black text-[#F1641E]">{averageRating || '0.0'}</span>
                    <div className="flex text-[#ffb800] my-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(averageRating) ? 'fill-current' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-xs text-gray-550 uppercase tracking-wider">
                      Điểm đánh giá trung bình
                    </span>
                  </div>
                  <p className="text-xs text-gray-455 leading-relaxed border-t border-[#EAE3D2]/30 pt-3">
                    Tất cả đánh giá đến từ các thành viên đã thực hiện giao dịch mua bán thực tế tại ShopVN.
                  </p>
                </div>

                {/* Form to submit review */}
                <div className="bg-white border border-[#EAE3D2]/50 rounded-2xl p-6 space-y-4 shadow-sm">
                  <h4 className="font-serif font-black text-sm text-[#222222]">Viết nhận xét của bạn</h4>
                  {currentUserId ? (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      {/* Star rating selector */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-gray-555 uppercase tracking-wider">
                          Đánh giá số sao
                        </label>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewRating(star)}
                              className="focus:outline-none cursor-pointer p-0.5"
                            >
                              <Star
                                className={`w-6 h-6 transition-all hover:scale-110 ${
                                  star <= newRating ? 'text-[#ffb800] fill-current' : 'text-gray-200'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Title input */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-gray-555 uppercase tracking-wider">
                          Tiêu đề nhận xét
                        </label>
                        <input
                          type="text"
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="Ví dụ: Sản phẩm rất tốt, đóng gói kỹ..."
                          className="h-10 w-full rounded-xl border border-gray-300 px-4 text-xs focus:border-[#F1641E] focus:outline-none focus:ring-4 focus:ring-[#F1641E]/10 bg-white transition-all duration-200"
                        />
                      </div>

                      {/* Content textarea */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-gray-555 uppercase tracking-wider">
                          Nội dung nhận xét chi tiết
                        </label>
                        <textarea
                          required
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                          placeholder="Hãy chia sẻ trải nghiệm thực tế của bạn về chất lượng và độ hoàn thiện của sản phẩm..."
                          rows={4}
                          className="w-full rounded-xl border border-gray-300 p-4 text-xs focus:border-[#F1641E] focus:outline-none focus:ring-4 focus:ring-[#F1641E]/10 bg-white transition-all duration-200"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="w-full h-10 bg-[#F1641E] hover:bg-[#d85213] text-white rounded-full font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingReview ? 'Đang gửi nhận xét...' : 'Gửi nhận xét của tôi'}
                      </button>
                    </form>
                  ) : (
                    <div className="bg-[#FDFAF7]/80 rounded-xl p-4 text-center border border-dashed border-[#EAE3D2]/60">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Bạn cần đăng nhập tài khoản khách hàng để có thể gửi đánh giá cho sản phẩm này.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsLoading ? (
                  <div className="py-12 text-center text-gray-400 text-xs font-semibold">
                    Đang tải các nhận xét từ hệ thống...
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="bg-[#FDFAF7]/40 border border-dashed border-[#EAE3D2]/40 rounded-2xl p-10 text-center text-gray-400 text-xs font-semibold">
                    Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên nhận xét!
                  </div>
                ) : (
                  reviews.map((review) => {
                    const initials = `KH`;
                    const displayName = `Khách hàng ShopVN #${review.userId}`;
                    const formattedDate = new Date(review.createdAt).toLocaleDateString('vi-VN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    });

                    return (
                      <article
                        key={review.id}
                        className="bg-[#FDFAF7] border border-[#EAE3D2]/40 rounded-2xl p-5 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all duration-200 hover:shadow-sm"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black bg-[#EBF2EE] text-[#1E5C3F]">
                              {initials}
                            </span>
                            <div className="space-y-0.5">
                              <strong className="text-xs font-bold text-gray-800 block">
                                {displayName}
                              </strong>
                              <span className="text-[10px] text-gray-400 font-semibold block">
                                {formattedDate}
                              </span>
                            </div>
                          </div>

                          {/* Delete button if the logged-in user is the author of this review */}
                          {currentUserId === review.userId && (
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(review.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer rounded-full hover:bg-red-50"
                              title="Xóa nhận xét"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex text-[#ffb800]">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= review.rating ? 'fill-current' : 'text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <h5 className="font-bold text-xs md:text-sm text-gray-850">
                            {review.title}
                          </h5>
                          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                            {review.content}
                          </p>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
