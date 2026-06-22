'use client';

import Sidebar from '@/components/layout/Sidebar';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Sidebar>{children}</Sidebar>;
}
