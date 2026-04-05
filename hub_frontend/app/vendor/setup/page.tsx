'use client';

import { useState } from 'react';
import { Building2, UploadCloud, MapPin, Briefcase } from 'lucide-react';

export default function VendorSetup() {
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, label: 'Company', fullLabel: 'Company Details' },
    { id: 2, label: 'Services', fullLabel: 'Services' },
    { id: 3, label: 'Verify', fullLabel: 'Verification' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-3 sm:mb-4">
          Become a Verified Vendor
        </h1>
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
          Join thousands of MSMEs closing deals globally. Complete your profile to get started.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-5 sm:p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-800">

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 sm:mb-12 relative">
          {/* Connector lines */}
          <div className="absolute top-5 sm:top-6 left-0 right-0 flex px-[16.666%] sm:px-[16.666%] pointer-events-none">
            <div className={`flex-1 h-1 transition-colors ${step > 1 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-700'}`} />
            <div className={`flex-1 h-1 transition-colors ${step > 2 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-700'}`} />
          </div>

          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2 relative z-10 flex-1">
              <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center font-bold text-base sm:text-lg transition-colors shadow-sm ${
                step >= s.id ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-500'
              }`}>
                {s.id}
              </div>
              <span className={`text-xs sm:text-sm font-medium text-center leading-tight ${step >= s.id ? 'text-blue-600' : 'text-gray-500'}`}>
                <span className="sm:hidden">{s.label}</span>
                <span className="hidden sm:inline">{s.fullLabel}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Step 1 – Company Information */}
        {step === 1 && (
          <div className="space-y-5 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3 mb-4 sm:mb-6">
              <Building2 className="text-blue-600 shrink-0" /> Company Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Company Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Acme Corp Ltd."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Registration Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="XX-12345678"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Short Description</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                placeholder="We specialize in producing high-quality industrial components..."
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors mt-4 sm:mt-8"
            >
              Continue to Details
            </button>
          </div>
        )}

        {/* Step 2 – Services & Catalog */}
        {step === 2 && (
          <div className="space-y-5 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3 mb-4 sm:mb-6">
              <Briefcase className="text-blue-600 shrink-0" /> Services &amp; Catalog
            </h2>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="h-14 w-14 sm:h-16 sm:w-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <UploadCloud size={28} className="sm:hidden" />
                <UploadCloud size={32} className="hidden sm:block" />
              </div>
              <p className="text-base sm:text-lg font-medium">Upload your product catalog or service brochure</p>
              <p className="text-sm text-gray-500 mt-2">PDF, DOCX up to 50MB</p>
            </div>

            <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-8">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-bold py-3.5 sm:py-4 rounded-xl transition-colors text-sm sm:text-base"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 sm:py-4 rounded-xl transition-colors text-sm sm:text-base"
              >
                Final Review
              </button>
            </div>
          </div>
        )}

        {/* Step 3 – Ready */}
        {step === 3 && (
          <div className="space-y-5 sm:space-y-6 text-center py-8 sm:py-10">
            <div className="h-20 w-20 sm:h-24 sm:w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <MapPin size={38} className="sm:hidden" />
              <MapPin size={48} className="hidden sm:block" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Profile Ready for Verification</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-lg mx-auto text-sm sm:text-base">
              Your company profile has been drafted. We just need to verify your business email and registration details. You'll receive an email shortly.
            </p>
            <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 sm:px-12 rounded-xl transition-all shadow-lg hover:shadow-xl">
              Go to Vendor Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
