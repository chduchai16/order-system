'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/lib/auth/tokenManager';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    tokenManager.clearTokens();
    const timer = setTimeout(() => {
      router.push('/login');
    }, 500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="text-center">
      <p className="text-gray-600">Logging out...</p>
    </div>
  );
}
