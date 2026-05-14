'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, LogIn, User } from 'lucide-react';
import { authService } from '@/features/auth/api/authService';
import { tokenStore } from '@/features/shared/api/tokenStore';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const tokens = await authService.login({ username: username.trim(), password });
      tokenStore.setTokens(tokens.access_token, tokens.refresh_token);
      router.push('/products');
    } catch {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-2 gap-4 mb-5">
        <button type="button" className="h-11 rounded-md border border-gray-300 bg-white font-bold text-sm flex items-center justify-center gap-2 hover:border-[#ff6600]">
          <span className="text-red-500 font-black">G</span>
          Google
        </button>
        <button type="button" className="h-11 rounded-md border border-gray-300 bg-white font-bold text-sm flex items-center justify-center gap-2 hover:border-[#ff6600]">
          <span className="text-blue-600 font-black">f</span>
          Facebook
        </button>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="h-px bg-gray-300 flex-1" />
        <span className="text-sm text-gray-600">hoặc đăng nhập bằng tài khoản</span>
        <div className="h-px bg-gray-300 flex-1" />
      </div>

      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-bold mb-2 text-gray-900">
          Tên đăng nhập
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="nguyenthanh"
            autoComplete="username"
            required
            className="w-full h-12 pl-10 pr-4 border border-[#ff6600] rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-orange-100"
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="block text-sm font-bold mb-2 text-gray-900">
          Mật khẩu
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
            autoComplete="current-password"
            required
            className="w-full h-12 pl-10 pr-11 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-[#ff6600] focus:ring-2 focus:ring-orange-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5 text-sm">
        <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="w-4 h-4 accent-[#ff6600]"
          />
          Ghi nhớ đăng nhập
        </label>
        <Link href="/login" className="text-[#ff6600] font-semibold hover:underline">
          Quên mật khẩu?
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 border border-gray-300 rounded-md bg-white text-gray-900 font-bold hover:border-[#ff6600] hover:text-[#ff6600] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <LogIn className="w-4 h-4" />
        {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>

      <p className="mt-5 text-center text-sm text-gray-700">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="text-[#ff6600] hover:underline font-bold">
          Tạo tài khoản miễn phí
        </Link>
      </p>
    </form>
  );
}
