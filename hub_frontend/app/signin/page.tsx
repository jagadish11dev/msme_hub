'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Lock, ArrowRight, ShieldCheck, User } from 'lucide-react';

export default function SignIn() {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let phone = formData.phoneNumber;
    if (!phone.startsWith('+')) phone = `+91${phone}`;

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, phoneNumber: phone }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      alert("Login successful! Welcome back.");
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-20">
      <div className="max-w-md w-full glass-panel bg-white dark:bg-slate-900 shadow-2xl rounded-[2rem] p-8 sm:p-10 border border-gray-100 dark:border-gray-800">
        
        <div className="text-center mb-10">
          <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-3">
            <User size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Enter your details to access your dashboard.</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-semibold mb-6 border border-red-100 dark:border-red-800 animate-in fade-in zoom-in">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                name="phoneNumber"
                type="tel"
                required
                placeholder="WhatsApp Number"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white font-medium"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white font-medium"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link href="/signup" className="text-sm font-bold text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 group"
          >
            {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 text-center pt-8 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            New to SupplyAdda? <Link href="/signup" className="text-blue-600 font-black hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
