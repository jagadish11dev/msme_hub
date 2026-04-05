'use client';

import { useState, useMemo } from 'react';
import {
  Search, MapPin, SlidersHorizontal, Building2, Star, Phone,
  Globe, CheckCircle, X, ChevronDown, Factory, Layers, Zap, Bell, 
  User, LogOut, MessageSquare, Heart, TrendingUp, Filter
} from 'lucide-react';
import { getAllZones, getStatesForZone, getCitiesForState } from '../../utils/geography';

// ---------------------------------------------------------------------------
// Mock company data
// ---------------------------------------------------------------------------
const MOCK_COMPANIES = [
  { id: 1, name: 'Precision CNC Works', type: 'OEM', field: 'Machining', zone: 'West', state: 'Maharashtra', city: 'Pune', pincode: '411001', rating: 4.8, reviews: 128, capabilities: ['CNC Milling', 'Turning', 'Grinding'], phone: '+91 98765 43210', website: 'precisioncnc.com', verified: true, logo: 'P', color: 'from-blue-500 to-blue-700' },
  { id: 2, name: 'Apex Forging Industries', type: 'Job Work', field: 'Forging', zone: 'West', state: 'Gujarat', city: 'Rajkot', pincode: '360001', rating: 4.5, reviews: 84, capabilities: ['Hot Forging', 'Drop Forging', 'Press Work'], phone: '+91 88774 56321', website: 'apexforging.in', verified: true, logo: 'A', color: 'from-orange-500 to-red-600' },
  { id: 3, name: 'Tamil Sheet Metal Co.', type: 'Job Work', field: 'Sheet Metal', zone: 'South', state: 'Tamil Nadu', city: 'Coimbatore', pincode: '641001', rating: 4.3, reviews: 61, capabilities: ['Laser Cutting', 'Bending', 'Welding'], phone: '+91 77652 33100', website: 'tamilsheetmetal.com', verified: false, logo: 'T', color: 'from-teal-500 to-cyan-600' },
  { id: 4, name: 'Northern Steel Products', type: 'OEM', field: 'Fabrication', zone: 'North', state: 'Punjab', city: 'Ludhiana', pincode: '141001', rating: 4.7, reviews: 210, capabilities: ['Structural Fabrication', 'Welding', 'Surface Treatment'], phone: '+91 99140 22456', website: 'northernsteel.com', verified: true, logo: 'N', color: 'from-indigo-500 to-violet-600' },
  { id: 5, name: 'Eastern Rubber Components', type: 'Distributor', field: 'Rubber', zone: 'East', state: 'West Bengal', city: 'Kolkata', pincode: '700001', rating: 4.1, reviews: 45, capabilities: ['Rubber Moulding', 'Gaskets', 'Seals'], phone: '+91 98310 55789', website: 'easternrubber.in', verified: true, logo: 'E', color: 'from-green-500 to-emerald-600' },
  { id: 6, name: 'Central Casting House', type: 'Job Work', field: 'Casting', zone: 'Central', state: 'Madhya Pradesh', city: 'Indore', pincode: '452001', rating: 4.6, reviews: 93, capabilities: ['Sand Casting', 'Die Casting', 'Investment Casting'], phone: '+91 93015 67890', website: 'centralcasting.com', verified: false, logo: 'C', color: 'from-amber-500 to-yellow-600' },
  { id: 7, name: 'Bengaluru PCB Solutions', type: 'OEM', field: 'Electronics', zone: 'South', state: 'Karnataka', city: 'Bengaluru', pincode: '560001', rating: 4.9, reviews: 315, capabilities: ['PCB Manufacturing', 'SMT Assembly', 'Testing'], phone: '+91 80221 34567', website: 'blrpcb.com', verified: true, logo: 'B', color: 'from-purple-500 to-pink-600' },
  { id: 8, name: 'Hyderabad Hydraulics', type: 'OEM', field: 'Hydraulics', zone: 'South', state: 'Telangana', city: 'Hyderabad', pincode: '500001', rating: 4.4, reviews: 72, capabilities: ['Hydraulic Cylinders', 'Power Packs', 'Valve Manifolds'], phone: '+91 97010 23456', website: 'hhdhydraulics.com', verified: true, logo: 'H', color: 'from-red-500 to-rose-600' },
];

const COMPANY_TYPES = ['OEM', 'Job Work', 'Distributor'];
const FIELDS = ['Machining', 'Forging', 'Sheet Metal', 'Fabrication', 'Casting', 'Electronics', 'Hydraulics', 'Rubber'];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={13}
          className={i <= Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
        />
      ))}
      <span className="ml-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400">{rating}</span>
    </div>
  );
}

function CompanyCard({ company, saved, onToggleSave }: { company: typeof MOCK_COMPANIES[0], saved: boolean, onToggleSave: (id: number) => void }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      {/* Colour bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${company.color}`} />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${company.color} flex items-center justify-center text-white text-xl font-black shadow-md`}>
              {company.logo}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug">{company.name}</h3>
                {company.verified && <CheckCircle size={14} className="text-blue-500 shrink-0" />}
              </div>
              <StarRating rating={company.rating} />
            </div>
          </div>
          <button
            onClick={() => onToggleSave(company.id)}
            className={`p-1.5 rounded-lg transition-colors ${saved ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
          >
            <Heart size={16} className={saved ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
            <Factory size={10} /> {company.type}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <Layers size={10} /> {company.field}
          </span>
        </div>

        {/* Capabilities */}
        <div className="flex flex-wrap gap-1 mb-4">
          {company.capabilities.map(cap => (
            <span key={cap} className="px-2 py-0.5 text-xs bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded-md border border-gray-100 dark:border-slate-700">
              {cap}
            </span>
          ))}
        </div>

        {/* Location + Reviews */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-blue-500" /> {company.city}, {company.state}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare size={12} /> {company.reviews} reviews
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors">
            <Phone size={13} /> Get Quote
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-semibold py-2.5 rounded-lg transition-colors">
            <Globe size={13} /> View Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar filter component
// ---------------------------------------------------------------------------
function FilterSidebar({ filters, setFilters, onClose }: {
  filters: any,
  setFilters: React.Dispatch<React.SetStateAction<any>>
  onClose?: () => void
}) {
  const zones = getAllZones();
  const states = filters.zone ? getStatesForZone(filters.zone) : [];
  const cities = filters.zone && filters.state ? getCitiesForState(filters.zone, filters.state) : [];

  const update = (key: string, value: string) => {
    setFilters((prev: any) => {
      const next = { ...prev, [key]: value };
      if (key === 'zone') { next.state = ''; next.city = ''; }
      if (key === 'state') { next.city = ''; }
      return next;
    });
  };

  const toggleArr = (key: string, value: string) => {
    setFilters((prev: any) => {
      const arr: string[] = prev[key] || [];
      return { ...prev, [key]: arr.includes(value) ? arr.filter((x: string) => x !== value) : [...arr, value] };
    });
  };

  const activePillClass = 'bg-blue-600 text-white border-blue-600';
  const inactivePillClass = 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:border-blue-400';

  return (
    <div className="space-y-6">
      {/* Company Type */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Company Type</p>
        <div className="flex flex-col gap-2">
          {COMPANY_TYPES.map(t => (
            <button key={t}
              onClick={() => toggleArr('types', t)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm font-medium transition-all ${filters.types.includes(t) ? activePillClass : inactivePillClass}`}
            >
              {t}
              {filters.types.includes(t) && <CheckCircle size={14} />}
            </button>
          ))}
        </div>
      </div>

      {/* Industry Field */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Industry Field</p>
        <div className="flex flex-wrap gap-2">
          {FIELDS.map(f => (
            <button key={f}
              onClick={() => toggleArr('fields', f)}
              className={`px-2.5 py-1 rounded-full border text-xs font-semibold transition-all ${filters.fields.includes(f) ? activePillClass : inactivePillClass}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Location Drill-Down */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <MapPin size={13} className="text-blue-500" /> Location Drill-Down
        </p>
        <div className="space-y-2.5">
          {/* Zone */}
          <div className="relative">
            <select
              value={filters.zone}
              onChange={e => update('zone', e.target.value)}
              className="w-full appearance-none bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm rounded-lg px-3 py-2.5 pr-8 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="">All Zones</option>
              {zones.map(z => <option key={z} value={z}>{z} India</option>)}
            </select>
            <ChevronDown size={15} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
          </div>
          {/* State */}
          <div className="relative">
            <select
              disabled={!filters.zone}
              value={filters.state}
              onChange={e => update('state', e.target.value)}
              className="w-full appearance-none bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm rounded-lg px-3 py-2.5 pr-8 outline-none focus:ring-2 focus:ring-blue-500 font-medium disabled:opacity-40"
            >
              <option value="">All States</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={15} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
          </div>
          {/* City */}
          <div className="relative">
            <select
              disabled={!filters.state}
              value={filters.city}
              onChange={e => update('city', e.target.value)}
              className="w-full appearance-none bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm rounded-lg px-3 py-2.5 pr-8 outline-none focus:ring-2 focus:ring-blue-500 font-medium disabled:opacity-40"
            >
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={15} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
          </div>
          {/* Pincode */}
          <input
            type="text" placeholder="Pincode (optional)"
            value={filters.pincode}
            onChange={e => setFilters((p: any) => ({ ...p, pincode: e.target.value.replace(/\D/, '').slice(0, 6) }))}
            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Min. Rating</p>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map(r => (
            <button key={r}
              onClick={() => setFilters((p: any) => ({ ...p, minRating: p.minRating === r ? 0 : r }))}
              className={`flex-1 text-xs py-1.5 rounded-lg border font-semibold transition-all ${filters.minRating === r ? activePillClass : inactivePillClass}`}
            >
              {r === 0 ? 'All' : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Verified only */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Verified Only</p>
        <button
          onClick={() => setFilters((p: any) => ({ ...p, verifiedOnly: !p.verifiedOnly }))}
          className={`relative w-11 h-6 rounded-full transition-colors ${filters.verifiedOnly ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-700'}`}
        >
          <span className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform ${filters.verifiedOnly ? 'translate-x-5' : ''}`} />
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={() => setFilters({ types: [], fields: [], zone: '', state: '', city: '', pincode: '', minRating: 0, verifiedOnly: false })}
        className="w-full text-sm text-red-500 hover:text-red-600 font-semibold py-2 border border-dashed border-red-200 dark:border-red-900 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/10"
      >
        Reset All Filters
      </button>

      {onClose && (
        <button onClick={onClose} className="w-full text-sm font-bold bg-blue-600 text-white py-3 rounded-xl">
          Apply Filters
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main User Dashboard
// ---------------------------------------------------------------------------
export default function UserDashboard() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    types: [] as string[], fields: [] as string[],
    zone: '', state: '', city: '', pincode: '',
    minRating: 0, verifiedOnly: false,
  });
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'reviews'>('rating');

  const toggleSave = (id: number) =>
    setSavedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const activeFilterCount = filters.types.length + filters.fields.length +
    (filters.zone ? 1 : 0) + (filters.state ? 1 : 0) + (filters.city ? 1 : 0) +
    (filters.pincode ? 1 : 0) + (filters.minRating > 0 ? 1 : 0) + (filters.verifiedOnly ? 1 : 0);

  const filtered = useMemo(() => {
    return MOCK_COMPANIES
      .filter(c => {
        if (search && !c.name.toLowerCase().includes(search.toLowerCase()) &&
            !c.field.toLowerCase().includes(search.toLowerCase()) &&
            !c.city.toLowerCase().includes(search.toLowerCase())) return false;
        if (filters.types.length > 0 && !filters.types.includes(c.type)) return false;
        if (filters.fields.length > 0 && !filters.fields.includes(c.field)) return false;
        if (filters.zone && c.zone !== filters.zone) return false;
        if (filters.state && c.state !== filters.state) return false;
        if (filters.city && c.city !== filters.city) return false;
        if (filters.pincode && !c.pincode.startsWith(filters.pincode)) return false;
        if (filters.minRating > 0 && c.rating < filters.minRating) return false;
        if (filters.verifiedOnly && !c.verified) return false;
        return true;
      })
      .sort((a, b) => b[sortBy] - a[sortBy]);
  }, [search, filters, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Nav Bar */}
      <header className="sticky top-16 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-2xl">
            <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search company name, industry or city…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="hidden sm:block bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm font-medium rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="rating">Sort: Top Rated</option>
            <option value="reviews">Sort: Most Reviewed</option>
          </select>

          {/* Mobile filter button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden relative flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl"
          >
            <Filter size={16} /> Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full" />
          </button>

          {/* Avatar */}
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
            U
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">

        {/* Sidebar – Desktop */}
        <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
          <div className="sticky top-36 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-blue-600" /> Filters
              </h2>
              {activeFilterCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{activeFilterCount}</span>
              )}
            </div>
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Stats bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
                {filtered.length} <span className="text-gray-500 dark:text-gray-400 font-medium text-base">companies found</span>
              </h1>
              {(search || activeFilterCount > 0) && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Showing filtered results
                  {search && <> for "<span className="font-semibold text-blue-600">{search}</span>"</>}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <TrendingUp size={16} className="text-green-500" />
              <span className="hidden sm:inline">{savedIds.length} saved</span>
            </div>
          </div>

          {/* Active filter tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {filters.types.map(t => (
                <span key={t} className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-800">
                  {t} <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => setFilters(p => ({ ...p, types: p.types.filter((x: string) => x !== t) }))} />
                </span>
              ))}
              {filters.zone && (
                <span className="flex items-center gap-1 px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full border border-green-200 dark:border-green-800">
                  {filters.zone} Zone <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => setFilters(p => ({ ...p, zone: '', state: '', city: '' }))} />
                </span>
              )}
              {filters.state && (
                <span className="flex items-center gap-1 px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded-full border border-purple-200 dark:border-purple-800">
                  {filters.state} <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => setFilters(p => ({ ...p, state: '', city: '' }))} />
                </span>
              )}
            </div>
          )}

          {/* Company Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(company => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  saved={savedIds.includes(company.id)}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="h-20 w-20 rounded-3xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center mb-5">
                <Building2 size={36} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No companies match your filters</h3>
              <p className="text-gray-500 max-w-sm text-sm">Try adjusting or resetting your search filters to discover more suppliers.</p>
              <button
                onClick={() => { setSearch(''); setFilters({ types: [], fields: [], zone: '', state: '', city: '', pincode: '', minRating: 0, verifiedOnly: false }); }}
                className="mt-6 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative ml-auto w-80 max-w-full h-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-blue-600" /> Filters
              </h2>
              <button onClick={() => setMobileFilterOpen(false)} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setMobileFilterOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
