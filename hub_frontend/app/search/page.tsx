'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Search as SearchIcon, MapPin, Star, Building2, Briefcase, Mail, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { getAllZones, getStatesForZone, getCitiesForState } from '../../utils/geography';

interface Vendor {
  id: string;
  companyName: string;
  services: string[];
  description: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filterZone, setFilterZone] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterPincode, setFilterPincode] = useState('');

  const fetchResults = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults([
        { id: 'offline1', companyName: 'LocalTech Proxy', services: ['Web Dev', 'Hosting'], description: 'Offline fallback dummy data.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults(searchInput);
    window.history.pushState(null, '', `?q=${encodeURIComponent(searchInput)}`);
  };

  const FilterPanel = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category</label>
        <select className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-blue-500 outline-none">
          <option>All Categories</option>
          <option>Manufacturing</option>
          <option>IT &amp; Software</option>
          <option>Logistics</option>
        </select>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Location Drill-Down</h3>
        <div className="space-y-3">
          <select
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-blue-500 outline-none"
            value={filterZone}
            onChange={(e) => { setFilterZone(e.target.value); setFilterState(''); setFilterCity(''); }}
          >
            <option value="">Any Zone</option>
            {getAllZones().map(z => <option key={z} value={z}>{z}</option>)}
          </select>

          <select
            disabled={!filterZone}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-blue-500 outline-none disabled:opacity-50"
            value={filterState}
            onChange={(e) => { setFilterState(e.target.value); setFilterCity(''); }}
          >
            <option value="">Any State</option>
            {filterZone && getStatesForZone(filterZone).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            disabled={!filterState}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-blue-500 outline-none disabled:opacity-50"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
          >
            <option value="">Any City/District</option>
            {filterState && getCitiesForState(filterZone, filterState).map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <input
            type="text"
            placeholder="Pincode (e.g. 400001)"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-blue-500 outline-none"
            value={filterPincode}
            onChange={(e) => setFilterPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 w-full justify-between bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-semibold text-sm text-gray-700 dark:text-gray-200 shadow-sm"
        >
          <span className="flex items-center gap-2"><SlidersHorizontal size={16} /> Filters</span>
          <ChevronDown size={16} className={`transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
        </button>

        {mobileFiltersOpen && (
          <div className="mt-2 glass-panel bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-lg">
            <FilterPanel />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-5 w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar – Desktop only */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="glass-panel p-6 rounded-2xl border border-gray-200 dark:border-gray-800 sticky top-24">
            <h2 className="font-bold text-lg mb-5">Filters</h2>
            <FilterPanel />
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0">
          <form onSubmit={handleSearch} className="relative flex items-center mb-6 sm:mb-8">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search vendors..."
              className="w-full px-5 py-3.5 sm:py-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 text-base sm:text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
            <button type="submit" className="absolute right-3 sm:right-4 p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
              <SearchIcon size={20} />
            </button>
          </form>

          <h2 className="text-lg sm:text-xl font-semibold mb-5 sm:mb-6">
            {loading ? 'Searching...' : `Found ${results.length} results for "${searchInput || 'All'}"`}
          </h2>

          <div className="space-y-5 sm:space-y-6">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-36 sm:h-40 bg-gray-200 dark:bg-gray-800 rounded-xl w-full" />
                ))}
              </div>
            ) : results.length > 0 ? (
              results.map((vendor) => (
                <div key={vendor.id} className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-5 sm:gap-6">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center shrink-0 self-start">
                    <Building2 className="h-7 w-7 sm:h-10 sm:w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{vendor.companyName}</h3>
                      <div className="flex text-amber-400 shrink-0">
                        {[...Array(4)].map((_, i) => <Star key={i} className="fill-current h-4 w-4 sm:h-5 sm:w-5" />)}
                        <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">{vendor.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {vendor.services.map((service, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full border border-blue-100 dark:border-slate-600">
                          {service}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={15} /> Global</span>
                      <span className="flex items-center gap-1"><Briefcase size={15} /> Verified OEM</span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-3 justify-start sm:justify-center shrink-0">
                    <button className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm">
                      <Mail size={16} /> Contact
                    </button>
                    <button className="flex-1 sm:flex-none border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium px-5 py-2.5 rounded-lg transition-colors text-sm">
                      View Profile
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 sm:py-20 glass-panel rounded-2xl border border-dashed border-gray-300">
                <SearchIcon className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No vendors found</h3>
                <p className="text-gray-500 text-sm px-4">We couldn't find any vendors matching "{searchInput}". Try adjusting your filters or search term.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-gray-500">Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}
