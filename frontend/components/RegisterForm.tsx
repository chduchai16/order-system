'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/api/authService';
import { tokenManager } from '@/lib/auth/tokenManager';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(
        formData.firstName,
        formData.lastName,
        formData.username,
        formData.email,
        formData.password
      );
      
      // Auto-login after successful registration
      tokenManager.setTokens(response.access_token, response.refresh_token);
      router.push('/dashboard/products');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 backdrop-blur-sm";
  const labelClasses = "block text-sm font-medium mb-2 text-gray-300 tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label htmlFor="firstName" className={labelClasses}>
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClasses}>
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="username" className={labelClasses}>
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          placeholder="johndoe"
          required
          className={inputClasses}
        />
      </div>

      <div className="mb-5">
        <label htmlFor="email" className={labelClasses}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required
          className={inputClasses}
        />
      </div>

      <div className="mb-5">
        <label htmlFor="password" className={labelClasses}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          required
          className={inputClasses}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="confirmPassword" className={labelClasses}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          required
          className={inputClasses}
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
          {loading ? 'Registering...' : 'Create Account'}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      <p className="mt-6 text-center text-sm text-gray-400 font-light">
        Already have an account?{' '}
        <Link href="/login" className="text-white hover:text-blue-300 hover:underline font-medium transition-colors">
          Login here
        </Link>
      </p>
    </form>
  );
}
