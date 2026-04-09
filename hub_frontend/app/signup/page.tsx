'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, MessageSquare, ArrowRight, ShieldCheck, MapPin, Lock } from 'lucide-react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    city: '',
    password: '',
    role: 'buyer'
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Ensure phone number has +91 prefix for Twilio if not provided
    let phone = formData.phoneNumber;
    if (!phone.startsWith('+')) {
      phone = `+91${phone}`;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, phoneNumber: phone }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      setOtpSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let phone = formData.phoneNumber;
    if (!phone.startsWith('+')) phone = `+91${phone}`;

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Verification failed');

      alert("Success! Your account is verified.");
      window.location.href = "/signin";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-20">
      <div className="max-w-lg w-full glass-panel bg-white dark:bg-slate-900 shadow-2xl rounded-[2rem] p-8 sm:p-10 border border-gray-100 dark:border-gray-800">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Join SupplyAdda</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Create your B2B account in seconds.</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-semibold mb-6 border border-red-100 dark:border-red-800 animate-in fade-in zoom-in">
            {error}
          </div>
        )}

        {!otpSent ? (
          <form onSubmit={handleRegister} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-[#25D366]" />
                <input
                  name="phoneNumber"
                  type="tel"
                  required
                  placeholder="WhatsApp Number (e.g. 9876543210)"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  name="city"
                  type="text"
                  required
                  placeholder="City"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Set Password"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? 'Sending OTP...' : 'Send WhatsApp OTP'} <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 text-[#25D366] rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-xl font-bold dark:text-white">Verify Number</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Enter the 6-digit code sent to WhatsApp</p>
            </div>
            
            <input
              type="text"
              required
              maxLength={6}
              placeholder="••••••"
              className="w-full p-4 text-center tracking-[0.5em] text-3xl rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:bg-slate-800 dark:text-white font-black"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />

            <button 
              type="submit" 
              disabled={loading || otp.length !== 6}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying...' : 'Complete Registration'}
            </button>
            
            <button 
              type="button" 
              onClick={() => setOtpSent(false)} 
              className="w-full text-sm text-blue-600 font-bold hover:underline"
            >
              Change Phone Number
            </button>
          </form>
        )}

        <div className="mt-8 text-center pt-6 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Already have an account? <Link href="/signin" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
