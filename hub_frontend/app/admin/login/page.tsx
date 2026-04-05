'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Hardware prototype password
      localStorage.setItem('admin_auth', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-blue-500/20 rounded-full flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-white mb-2">Secure Admin Login</h1>
        <p className="text-slate-400 text-center mb-8 text-sm">Enter the root administrative password to manage SupplyAdda vendors.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input 
              type="password" 
              placeholder="Admin Password" 
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors">
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
