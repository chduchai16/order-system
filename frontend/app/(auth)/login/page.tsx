'use client';

import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Login</h1>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>
      <LoginForm />
      <div className="mt-6 text-center text-sm">
        <Link href="/" className="text-blue-600 hover:underline flex items-center justify-center gap-1">
          <span>&larr;</span> Back to Home
        </Link>
      </div>
    </div>
  );
}
