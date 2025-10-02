// src/components/HeroSection.tsx
import Link from 'next/link';

export const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-block px-4 py-1 mb-4 bg-purple-900/30 rounded-full border border-purple-500/30">
          <span className="text-purple-400 text-sm font-medium">Decentralized Crowdfunding Platform</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Fund the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Creative</span> Projects
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          Join our decentralized crowdfunding platform for creators. Invest in projects you believe in and earn rewards through token ownership.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link 
            href="/explore" 
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all transform hover:-translate-y-1 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
          >
            Explore Projects <span className="ml-2">→</span>
          </Link>
          <Link 
            href="/create" 
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all border border-gray-700 flex items-center justify-center gap-2"
          >
            Create a Project <span className="ml-2">🎯</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-purple-500/10 rounded-full text-purple-400">
                <span className="text-xl">📈</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">$12.4M+</h3>
            <p className="text-gray-400">Total Funded</p>
          </div>
          <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-purple-500/10 rounded-full text-purple-400">
                <span className="text-xl">🎯</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">1,248</h3>
            <p className="text-gray-400">Active Projects</p>
          </div>
          <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-purple-500/10 rounded-full text-purple-400">
                <span className="text-xl">👥</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">42.7K</h3>
            <p className="text-gray-400">Community Members</p>
          </div>
        </div>
      </div>
    </section>
  );
};