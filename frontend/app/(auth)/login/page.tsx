import Link from 'next/link';
import { CreditCard, Gift, Lock, RefreshCw, ShieldCheck, Truck, Zap } from 'lucide-react';
import AuthHeader from '@/features/auth/components/AuthHeader';
import LoginForm from '@/features/auth/components/LoginForm';

const benefits = [
  {
    icon: Truck,
    title: 'Giao hàng miễn phí',
    description: 'Cho đơn hàng từ 200.000đ',
  },
  {
    icon: ShieldCheck,
    title: 'Thanh toán bảo mật',
    description: 'Mã hóa SSL 256-bit',
  },
  {
    icon: RefreshCw,
    title: 'Đổi trả dễ dàng',
    description: 'Trong vòng 30 ngày',
  },
  {
    icon: Gift,
    title: 'Tích điểm & hoàn tiền',
    description: 'Mỗi đơn hàng tích xu thưởng',
  },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white">
      <AuthHeader />

      <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-[50%_50%]">
        <aside className="bg-gradient-to-br from-[#182337] to-[#13345c] text-white px-8 sm:px-12 lg:px-16 py-12 lg:py-16 flex flex-col justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-3xl font-bold mb-10">
              <Zap className="w-8 h-8 text-[#ff6600] fill-current" />
              ShopVN
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl font-black mb-3">Chào mừng trở lại!</h1>
              <p className="text-lg font-semibold text-gray-100 leading-snug">
                Đăng nhập để tiếp tục mua sắm thông minh.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-md border border-[#ff6600] bg-[#ff6600]/10 text-[#ff6600] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-bold">{benefit.title}</h2>
                      <p className="text-sm text-gray-300">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-10">
            <div>
              <div className="text-2xl font-black text-[#ff6600]">500k+</div>
              <div className="text-xs text-gray-300">Thành viên</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#ff6600]">10k+</div>
              <div className="text-xs text-gray-300">Sản phẩm</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#ff6600]">4.9★</div>
              <div className="text-xs text-gray-300">Đánh giá TB</div>
            </div>
          </div>
        </aside>

        <main className="px-6 sm:px-10 lg:px-16 py-10 flex items-center justify-center bg-white">
          <div className="w-full max-w-[430px]">
            <div className="mb-7">
              <h1 className="text-3xl font-bold text-gray-950">Đăng nhập</h1>
              <p className="text-sm text-gray-700 mt-1">
                Chưa có tài khoản?{' '}
                <Link href="/register" className="text-[#ff6600] font-bold hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </div>

            <LoginForm />

            <div className="mt-10 grid grid-cols-3 gap-3 text-xs text-gray-700">
              <div className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#ff6600]" />
                Bảo mật SSL
              </div>
              <div className="flex items-center justify-center gap-1">
                <CreditCard className="w-4 h-4 text-[#ff6600]" />
                Bảo vệ dữ liệu
              </div>
              <div className="flex items-center justify-center gap-1">
                <Lock className="w-4 h-4 text-[#ff6600]" />
                Xác thực 2 lớp
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
