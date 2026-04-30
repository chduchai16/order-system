import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-hidden relative font-sans text-white">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]"></div>
        <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28 lg:px-8 flex flex-col items-center relative z-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mb-24 mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors duration-300 cursor-default shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)] animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300 tracking-wide">Next-gen E-commerce Platform</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 leading-tight">
            Elevate Your <br className="hidden sm:block" /> Order Experience
          </h1>
          
          <p className="text-xl leading-relaxed text-gray-400 mb-12 max-w-2xl mx-auto font-light">
            A seamless, high-performance platform built with modern microservices architecture. Browse products, manage your cart, and track orders with absolute precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/login"
              className="group relative px-8 py-4 bg-white text-gray-900 font-bold rounded-full text-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10">Access Dashboard</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              href="/auth/register"
              className="group px-8 py-4 bg-transparent text-white font-semibold rounded-full text-lg hover:bg-white/5 transition-all duration-300 border border-white/20 w-full sm:w-auto backdrop-blur-sm hover:border-white/40 active:scale-[0.98]"
            >
              Create Account
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full relative">
          
          {/* Card 1 */}
          <div className="group relative bg-[#111111]/80 border border-white/10 rounded-3xl p-8 hover:bg-[#1a1a1a]/90 transition-all duration-500 backdrop-blur-xl hover:-translate-y-2 hover:border-blue-500/30 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]">
              <span className="text-2xl drop-shadow-lg">📦</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-100 group-hover:text-blue-300 transition-colors">Extensive Catalog</h3>
            <p className="text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
              Explore our comprehensive range of premium products, complete with detailed specifications and dynamic pricing models.
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="group relative bg-[#111111]/80 border border-white/10 rounded-3xl p-8 hover:bg-[#1a1a1a]/90 transition-all duration-500 backdrop-blur-xl hover:-translate-y-2 hover:border-purple-500/30 overflow-hidden md:mt-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors duration-500"></div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]">
              <span className="text-2xl drop-shadow-lg">⚡</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-100 group-hover:text-purple-300 transition-colors">Instant Checkout</h3>
            <p className="text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
              Experience frictionless transactions with our optimized, highly secure payment gateway designed for ultimate speed.
            </p>
          </div>
          
          {/* Card 3 */}
          <div className="group relative bg-[#111111]/80 border border-white/10 rounded-3xl p-8 hover:bg-[#1a1a1a]/90 transition-all duration-500 backdrop-blur-xl hover:-translate-y-2 hover:border-emerald-500/30 overflow-hidden md:mt-16">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-500"></div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              <span className="text-2xl drop-shadow-lg">🎯</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-100 group-hover:text-emerald-300 transition-colors">Precision Tracking</h3>
            <p className="text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
              Monitor your shipments in real-time with granular updates and predictive delivery estimations across the globe.
            </p>
          </div>
          
        </div>

        {/* Footer */}
        <div className="mt-32 pt-8 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              OS
            </div>
            <span className="text-white/90 font-semibold tracking-wide text-lg">OrderSystem</span>
          </div>
          <p className="text-gray-500 text-sm font-light">
            © {new Date().getFullYear()} Order System. Crafted with precision.
          </p>
        </div>
        
      </div>
    </main>
  );
}
