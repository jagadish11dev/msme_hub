'use client';

import { useState } from 'react';
import { Search, Filter, MoreVertical, Building2, MapPin } from 'lucide-react';
import Link from 'next/link';

const mockedVendors = Array.from({ length: 12 }, (_, i) => ({
  id: `VEN-${9001 + i}`,
  name: i % 2 === 0 ? `Precision Engineering Pvt Ltd ${i}` : `Vertex Heavy Industries ${i}`,
  type: i % 3 === 0 ? 'Job Work' : 'OEM',
  field: i % 2 === 0 ? 'Machining' : 'Forging',
  location: i % 4 === 0 ? 'Pune' : 'Chennai',
  status: 'Verified',
  date: '2026-04-04'
}));

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredVendors = mockedVendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' ? true : v.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Admin Command Center</h1>
          <p className="text-sm text-gray-500 mt-1">Managing a highly scalable network of 1,000+ manufacturing companies.</p>
        </div>
        <Link
          href="/admin/add-company"
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm transition-colors text-sm whitespace-nowrap"
        >
          + Add New Vendor
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">Total Vendors</h3>
          <p className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800 dark:text-white">1,402</p>
          <p className="text-xs text-green-500 font-medium mt-2">+14% vs last month</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">Active OEMs</h3>
          <p className="text-3xl sm:text-4xl font-black tracking-tight text-blue-600">854</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">Job Work</h3>
          <p className="text-3xl sm:text-4xl font-black tracking-tight text-indigo-600">548</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">Searches</h3>
          <p className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-500">14.2K</p>
          <p className="text-xs text-green-500 font-medium mt-2">Active buyer leads</p>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-slate-800 flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Building2 className="text-blue-500 shrink-0" /> Vendor Network Registry
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Name or Location"
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Filter */}
            <div className="relative">
              <select
                className="w-full sm:w-auto pl-4 pr-10 py-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm appearance-none font-medium"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="OEM">OEM</option>
                <option value="Job Work">Job Work</option>
              </select>
              <Filter className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table – scrollable on mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300 min-w-[640px]">
            <thead className="bg-gray-50/80 dark:bg-slate-950 uppercase text-xs font-bold text-gray-500 tracking-wider">
              <tr>
                <th className="px-4 sm:px-6 py-4">ID</th>
                <th className="px-4 sm:px-6 py-4">Company Name</th>
                <th className="px-4 sm:px-6 py-4">Type</th>
                <th className="px-4 sm:px-6 py-4">Field</th>
                <th className="px-4 sm:px-6 py-4">Location</th>
                <th className="px-4 sm:px-6 py-4">Status</th>
                <th className="px-4 sm:px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredVendors.map((vendor, index) => (
                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-mono text-xs font-semibold text-slate-400">{vendor.id}</td>
                  <td className="px-4 sm:px-6 py-4 font-bold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                        {vendor.name.charAt(0)}
                      </div>
                      <span className="truncate max-w-[160px]">{vendor.name}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold border ${vendor.type === 'OEM' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' : 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400'}`}>
                      {vendor.type}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 font-medium">{vendor.field}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400 shrink-0" />{vendor.location}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> {vendor.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredVendors.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 font-medium">No companies match your filters.</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-gray-500 bg-slate-50/50 dark:bg-slate-900/50">
          <p>Showing <span className="font-bold text-gray-900 dark:text-white">{filteredVendors.length}</span> of <span className="font-bold text-gray-900 dark:text-white">1,402</span> vendors</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1.5 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-950">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
