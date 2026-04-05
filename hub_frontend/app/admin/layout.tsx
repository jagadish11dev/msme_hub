'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Building2, LayoutDashboard, LogOut, Shield, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else if (pathname !== '/admin/login') {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [pathname, router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-50">Loading Secure Area...</div>;

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-slate-900">{children}</div>;
  }

  if (!isAuthenticated) return null;

  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { href: '/admin/add-company', label: 'Add Company', icon: <Building2 size={20} /> },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <Shield className="text-blue-500 h-7 w-7 shrink-0" />
        <span className="text-xl font-bold text-white">Admin Hub</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === link.href ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {link.icon} {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => {
            localStorage.removeItem('admin_auth');
            router.push('/admin/login');
          }}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col h-full shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-slate-900 text-slate-300 flex flex-col h-full shadow-2xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={22} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-300 hover:text-white p-1 rounded-md transition-colors"
          >
            <Menu size={24} />
          </button>
          <Shield className="text-blue-500 h-6 w-6" />
          <span className="text-lg font-bold text-white">Admin Hub</span>
        </header>

        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
