'use client';

import SellerLayout from '@/features/business/components/SellerLayout';

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SellerLayout>{children}</SellerLayout>;
}
