'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/api/authService';
import { tokenManager } from '@/lib/auth/tokenManager';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(username, password);
      tokenManager.setTokens(response.access_token, response.refresh_token);
      router.push('/dashboard/products');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMsg);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="mb-5">
        <label htmlFor="username" className="block text-sm font-medium mb-2 text-gray-300 tracking-wide">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 backdrop-blur-sm"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-300 tracking-wide">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 backdrop-blur-sm"
        />
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm backdrop-blur-sm flex items-start gap-2">
          <span className="mt-0.5">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full px-4 py-3.5 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 disabled:bg-white/20 disabled:text-white/50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] overflow-hidden"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? 'Authenticating...' : 'Sign In'}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      <p className="mt-6 text-center text-sm text-gray-400 font-light">
        Don't have an account?{' '}
        <Link href="/auth/register" className="text-white hover:text-blue-300 hover:underline font-medium transition-colors">
          Register here
        </Link>
      </p>
    </form>
  );
}
