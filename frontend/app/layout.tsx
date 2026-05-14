import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShopVN - Mua sắm thông minh',
  description: 'ShopVN - nền tảng mua sắm trực tuyến với sản phẩm chính hãng, thanh toán an toàn và giao hàng nhanh.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
