'use client';

import RegisterForm from '@/components/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600">Join us and start shopping today</p>
      </div>
      <RegisterForm />
      <div className="mt-6 text-center text-sm">
        <Link href="/" className="text-blue-600 hover:underline flex items-center justify-center gap-1">
          <span>&larr;</span> Back to Home
        </Link>
      </div>
    </div>
  );
}
