import Link from 'next/link';
import { Check, Gift, Lock, ShieldCheck, Trash2, Zap } from 'lucide-react';
import AuthHeader from '@/components/AuthHeader';
import RegisterForm from '@/components/RegisterForm';

const perks = [
  ['Ưu đãi thành viên mới', 'Giảm 50k cho đơn đầu tiên'],
  ['Tích điểm mỗi đơn hàng', 'Đổi điểm lấy voucher giảm giá'],
  ['Theo dõi đơn hàng realtime', 'Biết ngay vị trí kiện hàng'],
  ['Flash Sale ưu tiên', 'Thành viên được mua trước 30 phút'],
  ['Hỗ trợ ưu tiên 24/7', 'Chat trực tiếp với tư vấn viên'],
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white">
      <AuthHeader />

      <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-[50%_50%]">
        <aside className="bg-gradient-to-br from-[#172236] to-[#153a67] text-white px-8 sm:px-12 lg:px-16 py-12 lg:py-16 flex flex-col justify-center">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-3xl font-bold mb-12">
              <Zap className="w-8 h-8 text-[#ff6600] fill-current" />
              ShopVN
            </Link>

            <h1 className="text-3xl lg:text-4xl font-black leading-tight mb-4">
              Tạo tài khoản
              <span className="block text-[#ff6600]">miễn phí ngay hôm nay</span>
            </h1>
            <p className="text-gray-300 text-lg font-semibold leading-snug mb-8">
              Gia nhập hơn 500.000 thành viên đang mua sắm thông minh trên ShopVN.
            </p>

            <div className="space-y-4 mb-8">
              {perks.map(([title, description]) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#ff6600] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <div>
                    <h2 className="font-bold">{title}</h2>
                    <p className="text-sm text-gray-300">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-[#ff6600] rounded-lg p-5 bg-white/5 flex items-center gap-4">
              <Gift className="w-8 h-8 text-[#ff6600] shrink-0" />
              <div>
                <h2 className="font-bold">Quà tặng chào mừng</h2>
                <p className="text-sm text-gray-300">Voucher 50.000đ + miễn phí giao hàng 3 đơn</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="px-6 sm:px-10 lg:px-16 py-10 flex items-center justify-center bg-white">
          <div className="w-full max-w-[460px]">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-950">Tạo tài khoản mới</h1>
              <p className="text-sm text-gray-700 mt-1">
                Đã có tài khoản?{' '}
                <Link href="/login" className="text-[#ff6600] font-bold hover:underline">
                  Đăng nhập tại đây
                </Link>
              </p>
            </div>

            <RegisterForm />

            <div className="mt-8 grid grid-cols-3 gap-3 text-xs text-gray-700">
              <div className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#ff6600]" />
                Bảo mật SSL
              </div>
              <div className="flex items-center justify-center gap-1">
                <Lock className="w-4 h-4 text-[#ff6600]" />
                Không chia sẻ dữ liệu
              </div>
              <div className="flex items-center justify-center gap-1">
                <Trash2 className="w-4 h-4 text-[#ff6600]" />
                Xóa tài khoản bất kỳ lúc
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
