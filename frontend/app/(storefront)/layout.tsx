'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Header />
      <main className="max-w-screen-2xl mx-auto px-4 py-8 w-full flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
