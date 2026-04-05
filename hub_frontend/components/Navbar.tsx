'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Menu, X, ChevronRight } from 'lucide-react';

import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 md:h-12 md:w-12 transition-transform hover:scale-105">
              <Image 
                src="/logo.png" 
                alt="SupplyAdda.com Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <Link href="/" className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              SupplyAdda.com
            </Link>
          </div>
          
          {/* Desktop Navigation (Removed as requested) */}
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors px-2 py-1">
              <User className="h-4 w-4" /> Sign In
            </Link>
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              Find Suppliers
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 focus:outline-none p-2 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div 
        className={`md:hidden absolute w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800 shadow-xl transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">

          
          <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />
          
          <Link 
            href="/login" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full text-gray-700 dark:text-gray-300 font-semibold px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <User className="h-5 w-5" /> Sign In
          </Link>
          <Link 
            href="/register" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl shadow-md font-bold transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
