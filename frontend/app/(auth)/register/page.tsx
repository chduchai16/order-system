import Link from 'next/link';
import { Check, Gift, Lock, ShieldCheck, Trash2, Zap } from 'lucide-react';
import AuthHeader from '@/features/auth/components/AuthHeader';
import RegisterForm from '@/features/auth/components/RegisterForm';

const perks = [
  ['Ưu đãi thành viên mới', 'Nhận ngay Voucher 50k cho đơn hàng đầu tiên'],
  ['Tích lũy xu thưởng', 'Đổi xu tích lũy lấy các mã giảm giá giá trị'],
  ['Định vị đơn hàng trực quan', 'Theo dõi chi tiết hành trình tác phẩm nghệ thuật'],
  ['Duyệt trước Flash Sale', 'Mua sớm các sản phẩm giới hạn trước 30 phút'],
  ['Hỗ trợ nghệ nhân ưu tiên', 'Được hỗ trợ nhanh chóng từ nhóm sáng lập'],
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF7] font-sans">
      <AuthHeader />

      <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-[45%_55%]">
        {/* Left perk column */}
        <aside className="bg-[#231F2D] text-white px-8 sm:px-12 lg:px-16 py-12 lg:py-16 flex flex-col justify-center border-r border-[#342F42]">
          <div className="space-y-8">
            <Link href="/" className="inline-flex items-center gap-2 text-3xl font-serif font-black text-[#F1641E]">
              ShopVN
            </Link>

            <div className="space-y-3">
              <h1 className="text-3xl font-serif font-black leading-tight">
                Tạo tài khoản mới
                <span className="block text-[#F1641E]">miễn phí ngay hôm nay</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-400 font-semibold leading-relaxed">
                Gia nhập cộng đồng hơn 500.000 thành viên yêu thích đồ thủ công và nghệ thuật độc bản.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {perks.map(([title, description]) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#1E5C3F] flex items-center justify-center shrink-0 mt-0.5 text-white">
                    <Check className="w-3 h-3" />
                  </span>
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-xs md:text-sm text-gray-200">{title}</h3>
                    <p className="text-xs text-gray-400 leading-normal">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-[#F1641E]/40 rounded-xl p-4 bg-[#F1641E]/10 flex items-center gap-4">
              <Gift className="w-8 h-8 text-[#F1641E] shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-gray-100">Quà tặng chào mừng thành viên mới</h4>
                <p className="text-[11px] text-gray-450 mt-0.5">Voucher 50.000đ + miễn phí giao hàng 3 đơn đầu tiên.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Form Column */}
        <main className="px-6 sm:px-12 lg:px-20 py-10 flex items-center justify-center bg-[#FDFAF7]/40">
          <div className="w-full max-w-[460px] bg-white border border-[#EAE3D2]/50 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="mb-6 space-y-1">
              <h1 className="font-serif text-2xl md:text-3xl font-black text-[#222222]">Đăng ký</h1>
              <p className="text-xs text-gray-500 font-semibold">
                Đã có tài khoản?{' '}
                <Link href="/login" className="text-[#F1641E] font-bold hover:underline">
                  Đăng nhập tại đây
                </Link>
              </p>
            </div>

            <RegisterForm />

            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 text-[10px] text-gray-450 font-bold uppercase text-center">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#1E5C3F]" />
                Bảo mật SSL
              </div>
              <div className="flex flex-col items-center gap-1">
                <Lock className="w-4 h-4 text-[#1E5C3F]" />
                Dữ liệu an toàn
              </div>
              <div className="flex flex-col items-center gap-1">
                <Trash2 className="w-4 h-4 text-[#1E5C3F]" />
                Hủy tài khoản
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
