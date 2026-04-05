'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, FileText, UploadCloud, ArrowRight, CheckCircle2, Navigation } from 'lucide-react';

export default function Home() {
  const [requirement, setRequirement] = useState('');
  const [location, setLocation] = useState('');
  const [fileName, setFileName] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requirement.trim()) {
      // Pass the query and location to the search page for actual results
      router.push(`/search?q=${encodeURIComponent(requirement)}&loc=${encodeURIComponent(location)}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden py-16 lg:py-24 flex flex-col justify-center items-center px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 -z-10"></div>
        


        {/* RFQ Advanced Form Card */}
        <div className="w-full max-w-3xl glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 relative z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                What are you looking for?
              </label>
              <textarea 
                rows={3}
                placeholder="e.g. 500 units of CNC machined aluminum parts, high precision..." 
                className="w-full p-4 rounded-xl text-lg border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all dark:bg-slate-800 dark:text-white bg-white/80 resize-none shadow-sm"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  Supplier Location
                </label>
                <div className="relative">
                  <Navigation className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="City, State, or Global" 
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-lg border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all dark:bg-slate-800 dark:text-white bg-white/80 shadow-sm"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <UploadCloud size={18} className="text-blue-600" />
                  Upload Technical Drawing (Optional)
                </label>
                <div className="relative flex items-center justify-center w-full h-[60px] border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer overflow-hidden">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate px-4">
                    {fileName ? fileName : 'Click to attach PDF, CAD, or Image'}
                  </span>
                </div>
              </div>
            </div>

            <button type="submit" className="mt-2 w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3">
              Request Quotation <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </section>

      {/* How it works simple section */}
      <section className="w-full max-w-5xl mx-auto px-4 py-16 border-t border-gray-100 dark:border-slate-900">
        <h2 className="text-center text-3xl font-bold mb-12">How SupplyAdda works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mb-2">1</div>
            <h3 className="font-bold text-lg">Post your Requirement</h3>
            <p className="text-slate-500 text-sm">Tell us exactly what you need fabricated, sourced, or developed.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mb-2">2</div>
            <h3 className="font-bold text-lg">Get Connected</h3>
            <p className="text-slate-500 text-sm">Our ML engine routes your request to the best-matched local suppliers.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mb-2">3</div>
            <h3 className="font-bold text-lg">Compare & Hire</h3>
            <p className="text-slate-500 text-sm">Receive multiple quotations and close the deal securely.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
