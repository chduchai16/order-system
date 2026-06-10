'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, LogIn, User } from 'lucide-react';
import { authService } from '@/features/auth/api/authService';
import { useCartStore } from '@/features/cart/store/cartStore';
import { tokenStore } from '@/features/shared/api/tokenStore';

export default function LoginForm() {
  const router = useRouter();
  const initializeCart = useCartStore((state) => state.initializeCart);
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
      await initializeCart();
      router.push('/products');
    } catch {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="h-10 rounded-full border border-gray-300 bg-white font-bold text-xs flex items-center justify-center gap-1.5 hover:border-[#222222] transition-colors cursor-pointer text-gray-700">
          <span className="text-red-500 font-black text-sm">G</span>
          Google
        </button>
        <button type="button" className="h-10 rounded-full border border-gray-300 bg-white font-bold text-xs flex items-center justify-center gap-1.5 hover:border-[#222222] transition-colors cursor-pointer text-gray-700">
          <span className="text-blue-600 font-black text-sm">f</span>
          Facebook
        </button>
      </div>

      <div className="flex items-center gap-3 my-4">
        <div className="h-px bg-gray-250 flex-1" />
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">hoặc bằng tài khoản</span>
        <div className="h-px bg-gray-250 flex-1" />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="username" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Tên đăng nhập
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="nguyenthanh"
            autoComplete="username"
            required
            className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-full bg-white text-gray-900 focus:border-[#F1641E] focus:outline-none focus:ring-1 focus:ring-[#F1641E]/30 text-xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Mật khẩu
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
            autoComplete="current-password"
            required
            className="w-full h-11 pl-10 pr-11 border border-gray-300 rounded-full bg-white text-gray-900 focus:border-[#F1641E] focus:outline-none focus:ring-1 focus:ring-[#F1641E]/30 text-xs"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-xs font-semibold">
        <label className="flex items-center gap-2 text-gray-650 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="w-3.5 h-3.5 accent-[#F1641E]"
          />
          Ghi nhớ đăng nhập
        </label>
        <Link href="/login" className="text-[#F1641E] hover:underline">
          Quên mật khẩu?
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-650 border border-red-200 rounded-xl text-xs leading-normal">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 bg-[#F1641E] hover:bg-[#d85213] text-white font-bold text-xs rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
      >
        <LogIn className="w-3.5 h-3.5" />
        {isSubmitting ? 'Đang xác thực...' : 'Đăng nhập vào ShopVN'}
      </button>
    </form>
  );
}
