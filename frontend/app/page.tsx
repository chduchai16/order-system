import Link from 'next/link';
import BannerCarousel from '@/components/BannerCarousel';
import CategoryGrid from '@/components/CategoryGrid';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">

        {/* Banner Carousel */}
        <BannerCarousel />

        {/* Category Grid */}
        <CategoryGrid />

        {/* Hero Section */}
        <div className="text-center max-w-3xl mb-20 mx-auto mt-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-gray-900 leading-tight">
            Order System
          </h1>

          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            A simple, fast, and easy-to-use e-commerce platform. Browse products, manage your cart, and track orders efficiently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-md hover:from-blue-700 hover:to-blue-800 transition-all shadow-md text-center w-full sm:w-auto"
            >
              Browse Products
            </Link>

            <Link
              href="/login"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-md border border-gray-300 hover:bg-gray-50 transition-colors w-full sm:w-auto text-center shadow-sm"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-md border border-gray-300 hover:bg-gray-50 transition-colors w-full sm:w-auto text-center shadow-sm"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full mt-12">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Browse Products</h3>
            <p className="text-gray-600">
              Explore our wide range of products with detailed descriptions and pricing.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Easy Checkout</h3>
            <p className="text-gray-600">
              Complete your purchases with our simple checkout process.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Track Orders</h3>
            <p className="text-gray-600">
              Monitor your orders in real-time and stay updated on their status.
            </p>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-gray-200 w-full text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Order System. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
