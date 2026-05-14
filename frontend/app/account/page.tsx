import AccountOrdersView from '@/features/account/components/AccountOrdersView';
import Footer from '@/features/shared/components/Footer';
import Navbar from '@/features/shared/components/Navbar';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        <AccountOrdersView />
      </main>
      <Footer />
    </div>
  );
}
