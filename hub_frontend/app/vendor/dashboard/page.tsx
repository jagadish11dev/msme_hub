'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, MapPin, Globe, Phone, Mail, Edit3, Eye, 
  BarChart3, Users, Star, ArrowUpRight, Plus, CheckCircle, 
  Settings, LogOut, Loader2, Camera
} from 'lucide-react';
import Link from 'next/link';

export default function VendorDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = "/signin";
        return;
      }
      try {
        const res = await fetch('http://localhost:5000/api/vendor-profile/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setProfile(data);
        } else {
          setError(data.message || 'Error fetching profile');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  if (error || !profile) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
      <div className="h-20 w-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
        <Building2 size={36} />
      </div>
      <h1 className="text-2xl font-black mb-2">Company Profile Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-sm">It looks like you haven't listed your company yet. Register to start getting RFQs.</p>
      <Link href="/vendor/setup" className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl transition-all">
        List My Company
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header Profile Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/10" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
           <div className="flex flex-col md:flex-row items-end gap-6 w-full">
              <div className="relative group">
                <div className="h-32 w-32 rounded-[2rem] bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center overflow-hidden">
                   {profile.photos?.[0] ? (
                     <img src={profile.photos[0]} className="w-full h-full object-cover" alt="Logo" />
                   ) : (
                     <Building2 size={48} className="text-blue-600" />
                   )}
                </div>
                <button className="absolute bottom-1 right-1 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 hover:scale-110 transition-transform">
                  <Camera size={16} className="text-blue-600" />
                </button>
              </div>
              
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{profile.companyName}</h1>
                  <span className="px-3 py-1 bg-green-400 text-green-900 text-xs font-black rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg">
                    <CheckCircle size={12} /> Verified
                  </span>
                </div>
                <p className="text-blue-100 text-lg mt-2 font-medium flex items-center gap-2">
                  <MapPin size={18} /> {profile.address?.city}, {profile.address?.state} • {profile.manufacturerType}
                </p>
              </div>

              <div className="flex items-center gap-3 pb-2">
                <Link href="/vendor/setup" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all">
                  <Edit3 size={18} /> Edit Profile
                </Link>
                <button className="bg-white text-blue-700 font-bold px-6 py-3 rounded-2xl shadow-xl transition-all hover:scale-105 flex items-center gap-2">
                  <Eye size={18} /> View Public Store
                </button>
              </div>
           </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Stats & Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Profile Views', val: '1.2k', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Total RFQs', val: '48', icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Trust Score', val: '4.8/5', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' }
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
                  <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                    <stat.icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</h3>
                    <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Profile Overview Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm p-8 sm:p-10">
              <h2 className="text-2xl font-black mb-6">Store Overview</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-10 font-medium">
                {profile.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                   <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Core Capabilities</h3>
                   <div className="flex flex-wrap gap-2">
                     {profile.capabilities?.map((cap: string, i: number) => (
                       <span key={i} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold">
                         {cap}
                       </span>
                     ))}
                   </div>
                </div>
                <div>
                   <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Store Stats</h3>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                        <span className="text-sm font-bold text-gray-500">Industry</span>
                        <span className="font-black text-blue-600">{profile.field}</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                        <span className="text-sm font-bold text-gray-500">Member Since</span>
                        <span className="font-black text-gray-900 dark:text-white">{new Date(profile.createdAt).getFullYear()}</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>

             {/* Photos Gallery */}
             <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black">Company Gallery</h2>
                  <button className="text-blue-600 font-bold flex items-center gap-1 hover:underline">
                    Manage Photos <Plus size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {profile.photos?.map((url: string, i: number) => (
                    <div key={i} className="aspect-video rounded-2xl overflow-hidden border group relative">
                      <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ArrowUpRight className="text-white" />
                      </div>
                    </div>
                  ))}
                  <div className="aspect-video rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                    <Plus size={32} />
                  </div>
                </div>
             </div>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-8">
             <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm p-8">
                <h2 className="text-xl font-black mb-6">Direct Connections</h2>
                <div className="space-y-6">
                   <div className="flex items-center gap-4 group">
                      <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shrink-0">
                        <Mail size={20} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-gray-400 uppercase">Support Email</p>
                         <p className="font-bold text-gray-900 dark:text-white">{profile.contactEmail}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 group">
                      <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center shrink-0">
                        <Phone size={20} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-gray-400 uppercase">Primary Contact</p>
                         <p className="font-bold text-gray-900 dark:text-white">{profile.phone}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 group">
                      <div className="h-12 w-12 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 flex items-center justify-center shrink-0">
                        <Globe size={20} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-gray-400 uppercase">Official Website</p>
                         <p className="font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{profile.website}</p>
                      </div>
                   </div>
                </div>
                
                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-slate-800">
                   <h2 className="text-xl font-black mb-6">Quick Actions</h2>
                   <div className="grid grid-cols-2 gap-3">
                      <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition-colors">
                        <Settings size={20} className="text-gray-400 mb-2" />
                        <span className="text-xs font-bold uppercase">Settings</span>
                      </button>
                       <button 
                        onClick={() => { localStorage.removeItem('token'); window.location.href = "/"; }}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-colors"
                      >
                        <LogOut size={20} className="text-red-500 mb-2" />
                        <span className="text-xs font-bold text-red-500 uppercase">Logout</span>
                      </button>
                   </div>
                </div>
             </div>

             {/* Help Card */}
             <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl">
                <Users size={40} className="mb-4 text-blue-200" />
                <h3 className="text-2xl font-black mb-2">Need Help?</h3>
                <p className="text-blue-100 mb-6 font-medium">Looking for ways to improve your profile or reach more buyers?</p>
                <button className="w-full bg-white text-blue-700 font-bold py-4 rounded-2xl shadow-lg">
                  Talk to Growth Expert
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
