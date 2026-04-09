'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Menu, X, ChevronRight, LogIn, UserPlus, Building2, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasVendorProfile, setHasVendorProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
        try {
          const res = await fetch('http://localhost:5000/api/vendor-profile/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setHasVendorProfile(true);
          }
        } catch (err) {
          console.error("Auth check failed", err);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [pathname]);

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
          
          {/* Desktop Auth/Vendor Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link href="/signin" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors px-2 py-1">
                  <LogIn className="h-4 w-4" /> Sign In
                </Link>
                <Link href="/signup" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  <UserPlus className="h-4 w-4" /> Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {hasVendorProfile ? (
                  <Link href="/vendor/dashboard" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-md">
                    <LayoutDashboard className="h-4 w-4" /> Manage Company
                  </Link>
                ) : (
                  <Link href="/vendor/setup" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-md">
                    <Building2 className="h-4 w-4" /> List Your Company
                  </Link>
                )}
                
                <button 
                  onClick={() => { localStorage.removeItem('token'); window.location.href = "/"; }}
                  className="p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
                >
                  <User size={18} />
                </button>
              </div>
            )}
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
          
          {!isLoggedIn ? (
            <>
              <Link 
                href="/signin" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full text-gray-700 dark:text-gray-300 font-semibold px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <LogIn className="h-5 w-5" /> Sign In
              </Link>
              <Link 
                href="/signup" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl shadow-md font-bold transition-colors"
              >
                <UserPlus className="h-5 w-5" /> Sign Up
              </Link>
            </>
          ) : (
            <>
              {hasVendorProfile ? (
                 <Link 
                  href="/vendor/dashboard" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full text-center bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold"
                >
                  <LayoutDashboard className="h-5 w-5" /> Manage Company
                </Link>
              ) : (
                <Link 
                  href="/vendor/setup" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full text-center bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold"
                >
                  <Building2 className="h-5 w-5" /> List Your Company
                </Link>
              )}
              <button 
                onClick={() => { localStorage.removeItem('token'); window.location.href = "/"; }}
                className="w-full text-center text-red-500 font-bold py-3"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
