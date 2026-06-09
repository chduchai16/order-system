import type { Metadata } from 'next';
import { Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'ShopVN - Mua sắm nghệ thuật & độc đáo',
  description: 'ShopVN - nền tảng mua sắm trực tuyến các sản phẩm thủ công, quà tặng và thời trang độc đáo lấy cảm hứng từ sự mộc mạc và tinh tế.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${outfit.variable} ${playfair.variable} bg-[#FDFAF7] text-[#222222] font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
