'use client';

import { useState, useEffect } from 'react';
import { Building2, UploadCloud, MapPin, Briefcase, CheckCircle, ArrowRight, Loader2, Globe, Phone, Mail } from 'lucide-react';

export default function VendorSetup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    manufacturerType: 'OEM',
    field: '',
    capabilities: '',
    contactEmail: '',
    phone: '',
    website: '',
    address: {
      zone: 'West',
      state: '',
      city: '',
      pincode: ''
    },
    photos: [] as string[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'ml_default'); // Assuming default preset
    data.append('cloud_name', 'dziwcdpqo');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dziwcdpqo/image/upload', {
        method: 'POST',
        body: data
      });
      const fileData = await res.json();
      setFormData(prev => ({ ...prev, photos: [...prev.photos, fileData.secure_url] }));
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('http://localhost:5000/api/vendor-profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          capabilities: formData.capabilities.split(',').map(s => s.trim())
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save profile');

      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: 'Company', fullLabel: 'Core Details' },
    { id: 2, label: 'Contact', fullLabel: 'Contact & Specs' },
    { id: 3, label: 'Ready', fullLabel: 'Success' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
          List Your Company
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          Start receiving RFQs from buyers globally in minutes.
        </p>
      </div>

      <div className="glass-panel bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border border-gray-100 dark:border-gray-800">
        
        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-12 relative px-4">
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-100 dark:bg-slate-800 -z-0 mx-20" />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black transition-all ${
                step >= s.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'
              }`}>
                {step > s.id ? <CheckCircle size={24} /> : s.id}
              </div>
              <span className={`mt-3 text-xs font-bold uppercase tracking-widest ${step >= s.id ? 'text-blue-600' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-8 animate-in fade-in zoom-in">
            {error}
          </div>
        )}

        {/* Step 1 – Basic Bio */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-black flex items-center gap-3 mb-6">
              <Building2 className="text-blue-600" /> Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Company Name</label>
                <input
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  placeholder="e.g. Precision Tools Ltd."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Manufacturer Type</label>
                <select
                  name="manufacturerType"
                  value={formData.manufacturerType}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                >
                  <option value="OEM">OEM</option>
                  <option value="Job Work">Job Work</option>
                  <option value="Distributor">Distributor</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Detailed Description</label>
              <textarea
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-medium"
                placeholder="Talk about your machinery, history, and core expertise..."
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                <input name="address.state" value={formData.address.state} onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                <input name="address.city" value={formData.address.city} onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
                <input name="address.pincode" value={formData.address.pincode} onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-slate-800" />
              </div>
               <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Industry</label>
                <input name="field" value={formData.field} onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-slate-800" placeholder="e.g Machining" />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Continue to Details <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* Step 2 – Logistics & Images */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-black flex items-center gap-3 mb-6">
              <Phone className="text-blue-600" /> Contact & Capabilities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><Mail size={14}/> Email</label>
                <input name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full p-3 rounded-xl border dark:bg-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><Phone size={14}/> Phone</label>
                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 rounded-xl border dark:bg-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><Globe size={14}/> Website</label>
                <input name="website" value={formData.website} onChange={handleChange} className="w-full p-3 rounded-xl border dark:bg-slate-800" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Capabilities (Comma separated)</label>
              <input
                name="capabilities"
                value={formData.capabilities}
                onChange={handleChange}
                placeholder="CNC Milling, Laser Cutting, ISO 9001..."
                className="w-full p-4 rounded-xl border dark:bg-slate-800"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Company Photos</label>
              <div className="grid grid-cols-4 gap-4">
                {formData.photos.map((url, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border">
                    <img src={url} className="object-cover w-full h-full" alt="Company" />
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <UploadCloud size={24} className="text-gray-400 mb-1" />
                  <span className="text-[10px] font-bold text-gray-400">UPLOAD</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} disabled={loading} />
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <button onClick={() => setStep(1)} className="flex-1 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Finalize Profile'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 – Success */}
        {step === 3 && (
          <div className="text-center py-12 animate-in zoom-in duration-500">
            <div className="h-24 w-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-black mb-4">Your Store is Live!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto font-medium">
              Congratulations! Your company is now visible to buyers across the globe.
            </p>
            <button 
              onClick={() => window.location.href = "/vendor/dashboard"}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-12 rounded-2xl shadow-xl transition-all hover:scale-105"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
