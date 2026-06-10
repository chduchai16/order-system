'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react';
import { authService } from '@/features/auth/api/authService';
import { useCartStore } from '@/features/cart/store/cartStore';
import { tokenStore } from '@/features/shared/api/tokenStore';

export default function RegisterForm() {
  const router = useRouter();
  const initializeCart = useCartStore((state) => state.initializeCart);
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
      setError('Vui lòng đồng ý với các Điều khoản và Chính sách của ShopVN.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận nhập lại không khớp nhau.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Mật khẩu của bạn phải chứa ít nhất 8 ký tự.');
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
      await initializeCart();
      router.push('/products');
    } catch {
      setError('Đăng ký không thành công. Tên đăng nhập hoặc email đã được sử dụng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrong = formData.password.length >= 8;
  const passwordsMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3.5">
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
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">hoặc điền thông tin</span>
        <div className="h-px bg-gray-250 flex-1" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field id="firstName" name="firstName" label="Họ đệm" value={formData.firstName} onChange={handleChange} icon={User} placeholder="Nguyễn" />
        <Field id="lastName" name="lastName" label="Tên gọi" value={formData.lastName} onChange={handleChange} icon={User} placeholder="Thành" />
      </div>

      <div>
        <Field id="username" name="username" label="Tên tài khoản (username)" value={formData.username} onChange={handleChange} icon={User} placeholder="nguyenthanh" autoComplete="username" active />
      </div>

      <div>
        <Field id="email" name="email" type="email" label="Địa chỉ Email" value={formData.email} onChange={handleChange} icon={Mail} placeholder="nguyenthanh@email.com" autoComplete="email" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Password field */}
        <div className="space-y-1">
          <label htmlFor="password" className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">Mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••"
              autoComplete="new-password"
              required
              className={`w-full h-11 pl-10 pr-10 border rounded-full bg-white text-gray-900 text-xs focus:outline-none focus:ring-1 ${
                passwordStrong 
                  ? 'border-green-500 focus:border-green-500 focus:ring-green-500/30' 
                  : 'border-gray-300 focus:border-[#F1641E] focus:ring-[#F1641E]/30'
              }`}
            />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="h-1 bg-gray-150 rounded mt-2 overflow-hidden">
            <div className={`h-full transition-all duration-350 ${passwordStrong ? 'w-full bg-green-500' : 'w-1/3 bg-[#F1641E]'}`} />
          </div>
          <p className={`text-[10px] mt-1 font-bold ${passwordStrong ? 'text-green-600' : 'text-[#F1641E]'}`}>
            {passwordStrong ? 'Mật khẩu mạnh' : 'Tối thiểu 8 ký tự'}
          </p>
        </div>

        {/* Confirm password field */}
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">Xác nhận mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••••"
              autoComplete="new-password"
              required
              className={`w-full h-11 pl-10 pr-10 border rounded-full bg-white text-gray-900 text-xs focus:outline-none focus:ring-1 ${
                passwordsMatch 
                  ? 'border-green-500 focus:border-green-500 focus:ring-green-500/30' 
                  : 'border-gray-300 focus:border-[#F1641E] focus:ring-[#F1641E]/30'
              }`}
            />
            <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className={`text-[10px] mt-1.5 font-bold ${passwordsMatch ? 'text-green-600' : 'text-gray-450'}`}>
            {passwordsMatch ? '✓ Mật khẩu khớp nhau' : 'Nhập lại mật khẩu'}
          </p>
        </div>
      </div>

      <label className="flex items-start gap-2.5 text-xs text-gray-600 my-4 cursor-pointer">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
          className="mt-1 w-3.5 h-3.5 accent-[#F1641E] shrink-0"
        />
        <span className="leading-snug">
          Tôi đồng ý với <Link href="/register" className="text-[#F1641E] font-bold hover:underline">Điều khoản dịch vụ</Link> và{' '}
          <Link href="/register" className="text-[#F1641E] font-bold hover:underline">Chính sách bảo mật dữ liệu</Link> của ShopVN.
        </span>
      </label>

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
        <UserPlus className="w-3.5 h-3.5" />
        {isSubmitting ? 'Đang khởi tạo tài khoản...' : 'Tạo tài khoản thành viên'}
      </button>

      <p className="mt-5 text-center text-xs text-gray-650 font-semibold">
        Đã có tài khoản?{' '}
        <Link href="/login" className="text-[#F1641E] hover:underline font-bold">
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
    <div className="space-y-1">
      <label htmlFor={id} className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className={`w-full h-11 pl-10 pr-10 border rounded-full bg-white text-gray-950 text-xs focus:outline-none focus:ring-1 ${
            active || !value
              ? 'border-gray-300 focus:border-[#F1641E] focus:ring-[#F1641E]/30' 
              : 'border-green-500 focus:border-green-500 focus:ring-green-500/30'
          }`}
        />
        {value && <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />}
      </div>
    </div>
  );
}
