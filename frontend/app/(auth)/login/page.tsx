'use client';

import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(59,130,246,0.15)] mx-auto mb-6">
          OS
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome Back</h1>
        <p className="text-gray-400 font-light">Sign in to your account to continue</p>
      </div>
      <LoginForm />
      <div className="mt-8 text-center text-sm">
        <Link href="/" className="text-gray-400 hover:text-white hover:underline transition-colors duration-300 flex items-center justify-center gap-2">
          <span>←</span> Back to Home
        </Link>
      </div>
    </div>
  );
}
