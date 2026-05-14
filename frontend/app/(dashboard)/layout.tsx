'use client';

import Navbar from '@/features/shared/components/Navbar';
import Footer from '@/features/shared/components/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
