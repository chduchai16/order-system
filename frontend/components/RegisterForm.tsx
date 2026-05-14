'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react';
import { authService } from '@/lib/api/authService';
import { tokenStore } from '@/lib/api/tokenStore';

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
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptedTerms) {
      setError('Vui lòng đồng ý với điều khoản sử dụng');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    setIsSubmitting(true);

    try {
      const tokens = await authService.register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      });
      tokenStore.setTokens(tokens.access_token, tokens.refresh_token);
      router.push('/products');
    } catch {
      setError('Đăng ký thất bại. Vui lòng kiểm tra thông tin và thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrong = formData.password.length >= 8;
  const passwordsMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button type="button" className="h-11 rounded-md border border-gray-300 bg-white font-bold text-sm flex items-center justify-center gap-2 hover:border-[#ff6600]">
          <span className="text-red-500 font-black">G</span>
          Google
        </button>
        <button type="button" className="h-11 rounded-md border border-gray-300 bg-white font-bold text-sm flex items-center justify-center gap-2 hover:border-[#ff6600]">
          <span className="text-blue-600 font-black">f</span>
          Facebook
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="h-px bg-gray-300 flex-1" />
        <span className="text-sm text-gray-600">hoặc điền thông tin bên dưới</span>
        <div className="h-px bg-gray-300 flex-1" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field id="firstName" name="firstName" label="Họ" value={formData.firstName} onChange={handleChange} icon={User} placeholder="Nguyễn" />
        <Field id="lastName" name="lastName" label="Tên" value={formData.lastName} onChange={handleChange} icon={User} placeholder="Thành" />
      </div>

      <div className="mb-3">
        <Field id="username" name="username" label="Tên đăng nhập" value={formData.username} onChange={handleChange} icon={User} placeholder="nguyenthanh" autoComplete="username" active />
      </div>

      <div className="mb-3">
        <Field id="email" name="email" type="email" label="Email" value={formData.email} onChange={handleChange} icon={Mail} placeholder="nguyenthanh@email.com" autoComplete="email" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-2">
        <div>
          <label htmlFor="password" className="block text-sm font-bold mb-2 text-gray-900">Mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••"
              autoComplete="new-password"
              required
              className={`w-full h-11 pl-10 pr-10 border rounded-md bg-white text-gray-900 text-sm focus:ring-2 ${
                passwordStrong ? 'border-green-500 focus:border-green-500 focus:ring-green-100' : 'border-[#ff6600] focus:border-[#ff6600] focus:ring-orange-100'
              }`}
            />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="h-1 bg-gray-200 rounded mt-2 overflow-hidden">
            <div className={`h-full ${passwordStrong ? 'w-full bg-green-500' : 'w-1/3 bg-[#ff6600]'}`} />
          </div>
          <p className={`text-xs mt-1 font-semibold ${passwordStrong ? 'text-green-600' : 'text-[#ff6600]'}`}>
            {passwordStrong ? 'Mật khẩu mạnh' : 'Tối thiểu 8 ký tự'}
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-bold mb-2 text-gray-900">Xác nhận mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••••"
              autoComplete="new-password"
              required
              className={`w-full h-11 pl-10 pr-10 border rounded-md bg-white text-gray-900 text-sm focus:ring-2 ${
                passwordsMatch ? 'border-green-500 focus:border-green-500 focus:ring-green-100' : 'border-gray-300 focus:border-[#ff6600] focus:ring-orange-100'
              }`}
            />
            <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className={`text-xs mt-3 font-semibold ${passwordsMatch ? 'text-green-600' : 'text-gray-500'}`}>
            {passwordsMatch ? '✓ Mật khẩu khớp nhau' : 'Nhập lại mật khẩu'}
          </p>
        </div>
      </div>

      <label className="flex items-start gap-2 text-sm text-gray-700 my-4 cursor-pointer">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
          className="mt-1 w-4 h-4 accent-[#ff6600]"
        />
        <span>
          Tôi đồng ý với <Link href="/register" className="text-[#ff6600] font-bold">Điều khoản sử dụng</Link> và{' '}
          <Link href="/register" className="text-[#ff6600] font-bold">Chính sách bảo mật</Link> của ShopVN.
        </span>
      </label>

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
        <UserPlus className="w-4 h-4" />
        {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản miễn phí'}
      </button>

      <p className="mt-5 text-center text-sm text-gray-700">
        Đã có tài khoản?{' '}
        <Link href="/login" className="text-[#ff6600] hover:underline font-bold">
          Đăng nhập ngay
        </Link>
      </p>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  value,
  onChange,
  icon: Icon,
  type = 'text',
  placeholder,
  autoComplete,
  active = false,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ElementType;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  active?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold mb-2 text-gray-900">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className={`w-full h-11 pl-10 pr-10 border rounded-md bg-white text-gray-900 text-sm focus:ring-2 ${
            active ? 'border-[#ff6600] focus:border-[#ff6600] focus:ring-orange-100' : 'border-green-500 focus:border-green-500 focus:ring-green-100'
          }`}
        />
        {value && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />}
      </div>
    </div>
  );
}
