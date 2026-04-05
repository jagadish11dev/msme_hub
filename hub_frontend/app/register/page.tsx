'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Building2, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Register() {
  const [role, setRole] = useState<'buyer' | 'vendor' | null>(null);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length > 5 && role) {
      // Mocking the backend API call to Twilio / WhatsApp Cloud API
      console.log(`Sending WhatsApp OTP to ${phone} for role ${role}`);
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) {
      // Mocking successful login/registration
      alert("Verification successful! Welcome to SupplyAdda.com");
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="max-w-md w-full glass-panel bg-white dark:bg-slate-900 shadow-2xl rounded-3xl p-8 border border-gray-100 dark:border-gray-800">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Create an Account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Secure and instant verification via WhatsApp.</p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Step 1: Select Role */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">I am joining as a:</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                    role === 'buyer' 
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                    : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <User className="h-8 w-8 mb-2" />
                  <span className="font-semibold text-sm">User / Buyer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('vendor')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                    role === 'vendor' 
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                    : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Building2 className="h-8 w-8 mb-2" />
                  <span className="font-semibold text-sm">Company</span>
                </button>
              </div>
            </div>

            {/* Step 2: Phone Input */}
            <div className={`space-y-3 transition-all duration-500 ${role ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <MessageSquare size={18} className="text-[#25D366]" /> 
                WhatsApp Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 font-semibold text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  placeholder="98765 43210"
                  className="flex-1 w-full p-4 text-lg rounded-none rounded-r-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#25D366] focus:border-[#25D366] outline-none transition-all dark:bg-slate-900 dark:text-white"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  disabled={!role}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">We will send a 4-digit verification code to this number.</p>
            </div>

            <button 
              type="submit" 
              disabled={!role || phone.length < 10}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Send OTP via WhatsApp <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 text-[#25D366] rounded-full flex items-center justify-center">
                <ShieldCheck size={32} />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Enter Verification Code</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sent to +91 {phone}</p>
            </div>
            
            <input
              type="text"
              required
              maxLength={4}
              placeholder="••••"
              className="w-full p-4 text-center tracking-[1em] text-3xl rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#25D366] focus:border-[#25D366] outline-none transition-all dark:bg-slate-900 dark:text-white font-mono"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />

            <button 
              type="submit" 
              disabled={otp.length !== 4}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Verify & Complete Registration
            </button>
            
            <div className="text-center">
              <button 
                type="button" 
                onClick={() => setOtpSent(false)} 
                className="text-sm text-blue-600 hover:underline font-semibold"
              >
                Change Number
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
