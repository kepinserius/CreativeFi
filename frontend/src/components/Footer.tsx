// src/components/Footer.tsx
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold flex items-center gap-1 mb-4">
              <span className="text-purple-500">Creative</span>
              <span className="text-white">Fi</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              The decentralized crowdfunding platform for creators and innovators. Join our community to fund the next generation of creative projects.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-3 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-purple-600 transition-colors text-xl">
                🐦
              </a>
              <a href="#" className="p-3 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-purple-600 transition-colors text-xl">
                💬
              </a>
              <a href="#" className="p-3 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-purple-600 transition-colors text-xl">
                🐙
              </a>
              <a href="#" className="p-3 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-purple-600 transition-colors text-xl">
                ✉️
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/explore" className="text-gray-400 hover:text-white transition-colors block py-1">Explore Projects</Link></li>
              <li><Link href="/create" className="text-gray-400 hover:text-white transition-colors block py-1">Create Project</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors block py-1">How It Works</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors block py-1">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors block py-1">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors block py-1">Tutorials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors block py-1">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors block py-1">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors block py-1">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors block py-1">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors block py-1">Smart Contracts</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors block py-1">Audits</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500">© {new Date().getFullYear()} CreativeFi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};