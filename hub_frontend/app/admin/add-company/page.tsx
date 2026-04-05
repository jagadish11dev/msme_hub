'use client';

import { useState } from 'react';
import { Building2, Save, UploadCloud, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { getAllZones, getStatesForZone, getCitiesForState } from '../../../utils/geography';

export default function AdminAddCompany() {
  const [formData, setFormData] = useState({
    companyName: '',
    manufacturerType: 'OEM',
    field: '',
    capabilities: '',
    services: '',
    description: '',
    contactEmail: '',
    zone: '',
    state: '',
    city: '',
    pincode: ''
  });

  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Saving company to database...' });

    const mockedPhotoUrls = files.length > 0 ? ['https://example.com/mock-upload1.jpg'] : [];

    try {
      const payload = {
        ...formData,
        capabilities: formData.capabilities.split(',').map(s => s.trim()),
        services: formData.services.split(',').map(s => s.trim()),
        photos: mockedPhotoUrls
      };

      const response = await fetch('http://localhost:5000/api/admin/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Company proudly added to the network!' });
        setFormData({ companyName: '', manufacturerType: 'OEM', field: '', capabilities: '', services: '', description: '', contactEmail: '', zone: '', state: '', city: '', pincode: '' });
        setFiles([]);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit');
      }
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Server error.' });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">New Vendor Matrix</h1>
          <p className="text-sm text-gray-500 mt-1">Populate the scalable manufacturing network.</p>
        </div>
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 whitespace-nowrap">
          <LayoutDashboard size={18} /> Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 p-5 sm:p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Section 1: Basic Info */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-slate-800">Basic Company Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name</label>
                <input
                  required type="text"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  placeholder="TechWorks Machining Ltd."
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Email</label>
                <input
                  required type="email"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  placeholder="sales@techworks.com"
                  value={formData.contactEmail}
                  onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Industrial Data */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-slate-800">Industrial Specification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Manufacturer Type</label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium appearance-none"
                  value={formData.manufacturerType}
                  onChange={e => setFormData({ ...formData, manufacturerType: e.target.value })}
                >
                  <option value="OEM">OEM (Original Equipment Manufacturer)</option>
                  <option value="Job Work">Job Work / Subcontractor</option>
                  <option value="Distributor">Distributor / Trading</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Industry Field</label>
                <input
                  required type="text"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  placeholder="Machining, Forging, Stamping"
                  value={formData.field}
                  onChange={e => setFormData({ ...formData, field: e.target.value })}
                />
              </div>
            </div>

            {/* Location – 2-col on mobile, 4-col on large */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Zone</label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium appearance-none text-sm"
                  value={formData.zone}
                  onChange={e => setFormData({ ...formData, zone: e.target.value, state: '', city: '' })}
                >
                  <option value="">Select Zone</option>
                  {getAllZones().map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
                <select
                  disabled={!formData.zone}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium appearance-none disabled:opacity-50 text-sm"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value, city: '' })}
                >
                  <option value="">Select State</option>
                  {formData.zone && getStatesForZone(formData.zone).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City</label>
                <select
                  disabled={!formData.state}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium appearance-none disabled:opacity-50 text-sm"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                >
                  <option value="">Select City</option>
                  {formData.state && getCitiesForState(formData.zone, formData.state).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pincode</label>
                <input
                  required type="text"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm"
                  placeholder="e.g. 400001"
                  value={formData.pincode}
                  onChange={e => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Specific Capabilities (Comma Sep)</label>
                <input
                  required type="text"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  placeholder="CNC Milling 5-Axis, TIG Welding"
                  value={formData.capabilities}
                  onChange={e => setFormData({ ...formData, capabilities: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sales/Services Offered</label>
                <input
                  required type="text"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  placeholder="Prototyping, High-Volume Production"
                  value={formData.services}
                  onChange={e => setFormData({ ...formData, services: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Company Bio */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Company Bio</label>
            <textarea
              required rows={3}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none font-medium"
              placeholder="Detailed profile description..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Section 3: Photo Uploads */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-slate-800">Facility Photos</h3>
            <div className="relative border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl px-6 py-8 sm:py-10 hover:bg-gray-50 dark:hover:bg-slate-950 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden group">
              <input
                type="file" multiple accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
              />
              <UploadCloud className="h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors mb-3" />
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1 text-center">Drag and drop facility photos here</p>
              <p className="text-xs text-gray-500">JPG, PNG, WebP up to 10MB</p>

              {files.length > 0 && (
                <div className="mt-4 flex gap-2 flex-wrap justify-center">
                  {files.map((file, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status message */}
          {status.message && (
            <div className={`p-4 rounded-xl font-medium shadow-sm border ${status.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : status.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
              {status.message}
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={status.type === 'loading'}
              className="flex items-center justify-center w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save size={20} /> Deploy Vendor Profile to Network
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
