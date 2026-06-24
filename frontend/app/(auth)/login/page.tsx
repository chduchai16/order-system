import Link from 'next/link';
import { CreditCard, Gift, Lock, RefreshCw, ShieldCheck, Truck } from 'lucide-react';
import LoginForm from '@/features/auth/components/LoginForm';

const benefits = [
  {
    icon: Truck,
    title: 'Giao hàng tin cậy',
    description: 'Miễn phí cho đơn hàng từ 300.000đ',
  },
  {
    icon: ShieldCheck,
    title: 'Bảo mật tuyệt đối',
    description: 'Giao dịch qua VietQR & mã hóa SSL',
  },
  {
    icon: RefreshCw,
    title: 'Đổi trả 30 ngày',
    description: 'Yên tâm mua sắm, đổi trả không lo',
  },
  {
    icon: Gift,
    title: 'Hỗ trợ nghệ nhân',
    description: 'Đóng góp 100% cho nhà sáng tạo Việt',
  },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF7] font-sans">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[45%_55%]">
        {/* Left decoration column */}
        <aside className="bg-[#231F2D] text-white px-8 sm:px-12 lg:px-16 py-12 lg:py-16 flex flex-col justify-between border-r border-[#342F42]">
          <div className="space-y-10">
            <Link href="/" className="inline-flex items-center gap-2 text-3xl font-serif font-black text-[#F1641E]">
              ShopVN
            </Link>

            <div className="space-y-3">
              <h1 className="text-3xl font-serif font-black leading-tight">Chào mừng bạn trở lại!</h1>
              <p className="text-xs md:text-sm text-gray-450 leading-relaxed font-medium">
                Đăng nhập tài khoản để tiếp tục mua sắm quà tặng và tác phẩm nghệ thuật thủ công độc bản.
              </p>
            </div>

            <div className="space-y-5">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl border border-[#F1641E]/40 bg-[#F1641E]/10 text-[#F1641E] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-sm text-gray-200">{benefit.title}</h3>
                      <p className="text-xs text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12 pt-6 border-t border-[#302B3E] text-left">
            <div>
              <div className="text-xl font-serif font-black text-[#F1641E]">500k+</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Thành viên</div>
            </div>
            <div>
              <div className="text-xl font-serif font-black text-[#F1641E]">10k+</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Sản phẩm</div>
            </div>
            <div>
              <div className="text-xl font-serif font-black text-[#F1641E]">4.9★</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Đánh giá</div>
            </div>
          </div>
        </aside>

        {/* Right Form Column */}
        <main className="px-6 sm:px-12 lg:px-20 py-12 flex items-center justify-center bg-[#FDFAF7]/40">
          <div className="w-full max-w-[420px] bg-white border border-[#EAE3D2]/50 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="mb-6 space-y-1">
              <h1 className="font-serif text-2xl md:text-3xl font-black text-[#222222]">Đăng nhập</h1>
              <p className="text-xs text-gray-500 font-semibold">
                Bạn chưa có tài khoản?{' '}
                <Link href="/register" className="text-[#F1641E] font-bold hover:underline">
                  Đăng ký tài khoản mới
                </Link>
              </p>
            </div>

            <LoginForm />

            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 text-[10px] text-gray-450 font-bold uppercase text-center">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#1E5C3F]" />
                Bảo mật SSL
              </div>
              <div className="flex flex-col items-center gap-1">
                <CreditCard className="w-4 h-4 text-[#1E5C3F]" />
                Bảo vệ dữ liệu
              </div>
              <div className="flex flex-col items-center gap-1">
                <Lock className="w-4 h-4 text-[#1E5C3F]" />
                Xác thực an toàn
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
