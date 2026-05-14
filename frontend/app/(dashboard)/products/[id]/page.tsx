'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  Heart,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react';
import { productService } from '@/features/products/api/productService';
import { useCartStore } from '@/features/cart/store/cartStore';
import { Product, ProductAttribute, ProductVariant } from '@/features/shared/types';

const colorOptions = [
  { name: 'Đen', className: 'bg-[#1d2535]' },
  { name: 'Cam', className: 'bg-orange-500' },
  { name: 'Đỏ', className: 'bg-red-500' },
  { name: 'Xanh', className: 'bg-green-500' },
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

const toDisplayPrice = (price: number) => (price >= 10000 ? price : price * 25000);
const formatVnd = (price: number) => `${Math.round(price).toLocaleString('vi-VN')}đ`;

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].name);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(params.id);
        setProduct(data);
        setSelectedVariant(data.variants?.[0] ?? null);
      } catch (err) {
        console.error('Fetch product error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const displayProduct = useMemo<Product>(
    () =>
      product ?? {
        id: params.id,
        sku: 'SONY-PRO-X1',
        name: 'Tai nghe Bluetooth Sony Pro X1 - Chống ồn ANC, 30h pin',
        price: 290000,
        stock: 248,
        description:
          'Tai nghe Bluetooth cao cấp với chống ồn chủ động, âm thanh cân bằng và thời lượng pin dài.',
        categoryName: 'Âm thanh',
        attributes: fallbackSpecs,
      },
    [params.id, product]
  );

  const unitPrice = selectedVariant ? selectedVariant.price : displayProduct.price;
  const displayPrice = toDisplayPrice(unitPrice);
  const originalPrice = Math.round(displayPrice * 1.55);
  const saving = originalPrice - displayPrice;
  const stock = selectedVariant ? selectedVariant.stock : displayProduct.availableStock ?? displayProduct.stock;
  const specs = displayProduct.attributes?.length ? displayProduct.attributes : fallbackSpecs;

  const handleAddToCart = () => {
    addToCart({
      productId: displayProduct.id,
      quantity,
      productName: selectedVariant ? `${displayProduct.name} - ${selectedVariant.name}` : displayProduct.name,
      unitPrice,
      sku: selectedVariant ? selectedVariant.skuCode : displayProduct.sku,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Đang tải thông tin sản phẩm...</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200 text-sm text-gray-600">
        <Link href="/" className="hover:text-[#ff6600]">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-[#ff6600]">Điện tử</Link>
        <span className="mx-2">/</span>
        <span>Âm thanh</span>
        <span className="mx-2">/</span>
        <span className="text-[#ff6600] font-medium">{displayProduct.name}</span>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-[48%_52%]">
        <div className="p-6 lg:border-r border-gray-200">
          <div className="relative aspect-square max-h-[420px] bg-[#dff1ff] rounded-lg flex items-center justify-center overflow-hidden">
            <span className="absolute top-4 left-4 bg-[#ff6600] text-white text-xs font-bold px-3 py-1 rounded">Mới</span>
            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">-35%</span>
            {displayProduct.image ? (
              <Image
                src={displayProduct.image}
                alt={displayProduct.name}
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-contain p-10"
              />
            ) : (
              <div className="text-blue-500">
                <svg className="w-28 h-28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1c-1.657 0-3-1.343-3-3v-2c0-1.657 1.343-3 3-3h3v8z" />
                  <path d="M3 19a2 2 0 0 0 2 2h1c1.657 0 3-1.343 3-3v-2c0-1.657-1.343-3-3-3H3v8z" />
                </svg>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3 mt-4 max-w-[300px]">
            {['bg-[#dff1ff] text-blue-500 border-[#ff6600]', 'bg-pink-100 text-purple-500 border-gray-200', 'bg-green-100 text-green-600 border-gray-200', 'bg-yellow-100 text-yellow-600 border-gray-200'].map((item) => (
              <button
                key={item}
                type="button"
                className={`aspect-square rounded-md border flex items-center justify-center ${item}`}
                aria-label="Ảnh sản phẩm"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1c-1.657 0-3-1.343-3-3v-2c0-1.657 1.343-3 3-3h3v8z" />
                  <path d="M3 19a2 2 0 0 0 2 2h1c1.657 0 3-1.343 3-3v-2c0-1.657-1.343-3-3-3H3v8z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="inline-flex px-2 py-1 rounded bg-orange-50 text-[#ff6600] text-xs font-semibold mb-3">
            {displayProduct.categoryName || 'Sony'}
          </div>
          <h1 className="text-2xl font-bold leading-snug text-gray-950 mb-3">{displayProduct.name}</h1>

          <div className="flex items-center gap-3 text-sm text-gray-700 mb-4">
            <span>4.5 (128 đánh giá)</span>
            <span className="text-gray-300">|</span>
            <span>Đã bán 1.2k</span>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 mb-5">
            <div className="flex items-end gap-4">
              <span className="text-3xl font-bold text-[#ff6600]">{formatVnd(displayPrice)}</span>
              <span className="text-gray-600 line-through pb-1">{formatVnd(originalPrice)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">Tiết kiệm {formatVnd(saving)}</span>
              <span>Trả góp 0% từ <strong className="text-[#ff6600]">{formatVnd(displayPrice / 3)}/tháng</strong></span>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-sm mb-2">Màu sắc</h3>
            <div className="flex gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-8 h-8 rounded-full ${color.className} ${
                    selectedColor === color.name ? 'ring-2 ring-[#ff6600] ring-offset-2' : 'border border-gray-200'
                  }`}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-sm mb-2">Phiên bản</h3>
            <div className="flex flex-wrap gap-2">
              {(displayProduct.variants?.length ? displayProduct.variants : [
                { id: 1, name: 'Standard', skuCode: displayProduct.sku || 'STD', price: displayProduct.price, stock },
                { id: 2, name: 'Pro', skuCode: 'PRO', price: displayProduct.price * 1.15, stock },
                { id: 3, name: 'Pro Max', skuCode: 'PRO-MAX', price: displayProduct.price * 1.3, stock },
              ]).map((variant) => {
                const active = selectedVariant?.id === variant.id || (!selectedVariant && variant.name === 'Standard');
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-md border text-sm font-semibold ${
                      active ? 'bg-[#ff6600] border-[#ff6600] text-white' : 'bg-white border-gray-300 text-gray-800 hover:border-[#ff6600]'
                    }`}
                  >
                    {variant.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-5">
            <span className="font-bold text-sm">Số lượng</span>
            <div className="inline-flex items-center border border-gray-300 rounded-md h-9">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="w-9 h-9 flex items-center justify-center">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center border-x border-gray-200">{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => Math.min(stock || 999, value + 1))} className="w-9 h-9 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-green-600 text-sm font-semibold">Còn {stock} sản phẩm</span>
          </div>

          <div className="grid grid-cols-[1fr_1fr_auto] gap-3 mb-5">
            <button type="button" onClick={handleAddToCart} className="min-h-12 border border-gray-300 rounded-md font-bold flex items-center justify-center gap-2 hover:border-[#ff6600] hover:text-[#ff6600]">
              <ShoppingCart className="w-5 h-5" />
              Thêm vào giỏ
            </button>
            <button type="button" onClick={handleBuyNow} className="min-h-12 border border-gray-300 rounded-md font-bold hover:bg-gray-50">
              Mua ngay
            </button>
            <button type="button" className="w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center hover:text-red-500 hover:border-red-400" aria-label="Yêu thích">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
            <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#ff6600]" />Giao hàng miễn phí</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#ff6600]" />Hàng chính hãng</div>
            <div className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-[#ff6600]" />Đổi trả 30 ngày</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#ff6600]" />Bảo hành 12 tháng</div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {['Thông số kỹ thuật', 'Mô tả sản phẩm', 'Đánh giá (128)', 'Câu hỏi thường gặp'].map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`px-6 py-3 text-sm font-semibold whitespace-nowrap ${
                index === 0 ? 'text-[#ff6600] border-b-2 border-[#ff6600]' : 'text-gray-700 hover:text-[#ff6600]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          <table className="w-full text-sm border-separate border-spacing-0">
            <tbody>
              {specs.map((spec, index) => (
                <tr key={`${spec.name}-${index}`} className={index % 2 === 0 ? 'bg-[#f4f2ec]' : 'bg-white'}>
                  <td className="w-2/5 px-4 py-3 text-gray-700 border-b border-white">{spec.name}</td>
                  <td className="px-4 py-3 font-semibold text-gray-950 border-b border-white">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <h2 className="font-bold text-gray-950 mb-3">Đánh giá từ khách hàng</h2>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl font-bold text-[#ff6600]">4.5</span>
              <span className="font-bold">128 đánh giá</span>
            </div>

            <div className="space-y-3">
              {[
                ['NT', 'Nguyễn Thành', '12/05/2025', 'Âm thanh rất tốt, chống ồn hiệu quả, đi làm rất tiện. Giao hàng nhanh, đóng gói cẩn thận.'],
                ['LM', 'Lê Minh', '08/05/2025', 'Pin trâu, kết nối ổn định. Chỉ hơi nặng một chút nhưng tổng thể rất hài lòng.'],
              ].map(([initials, name, date, content]) => (
                <article key={name} className="bg-[#f4f2ec] rounded-lg p-4">
                  <div className="flex justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{initials}</span>
                      <strong className="text-sm">{name}</strong>
                    </div>
                    <span className="text-xs text-gray-600">{date}</span>
                  </div>
                  <div className="flex text-[#ffb800] mb-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-800">{content}</p>
                </article>
              ))}
            </div>

            <div className="flex justify-center mt-5">
              <button type="button" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50" aria-label="Xem thêm đánh giá">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
