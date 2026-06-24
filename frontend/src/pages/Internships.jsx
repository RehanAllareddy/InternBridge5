import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ArrowUpRight, X, SlidersHorizontal } from 'lucide-react';
import { INTERNSHIPS, FIELD_TAGS } from '../data/mock';
import { useAuth } from '../context/AuthContext';

const FIELD_COLORS = {
  CS: 'bg-violet-50 text-violet-700',
  STEM: 'bg-blue-50 text-blue-700',
  Medicine: 'bg-rose-50 text-rose-700',
  AI: 'bg-emerald-50 text-emerald-700',
  Finance: 'bg-amber-50 text-amber-700',
  Engineering: 'bg-sky-50 text-sky-700',
  Design: 'bg-pink-50 text-pink-700',
  Business: 'bg-orange-50 text-orange-700',
  Law: 'bg-indigo-50 text-indigo-700',
  Research: 'bg-teal-50 text-teal-700',
  Tech: 'bg-cyan-50 text-cyan-700',
  Science: 'bg-green-50 text-green-700',
  Arts: 'bg-fuchsia-50 text-fuchsia-700',
  Healthcare: 'bg-red-50 text-red-700',
  Policy: 'bg-slate-100 text-slate-700',
  Journalism: 'bg-yellow-50 text-yellow-700',
  Environment: 'bg-lime-50 text-lime-700',
  Education: 'bg-purple-50 text-purple-700',
};

function FieldBadge({ field }) {
  const cls = FIELD_COLORS[field] || 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full ${cls}`}>
      {field}
    </span>
  );
}

function InternshipCard({ internship }) {
  return (
    <a
      href={internship.url}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-400 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <FieldBadge field={internship.field} />
        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-0.5" />
      </div>
      <h3 className="mt-3 text-[15px] font-bold text-slate-900 group-hover:text-blue-600 leading-snug transition-colors">
        {internship.title}
      </h3>
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-500">{internship.location}</span>
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span>Due {internship.deadline}</span>
          <span className="text-slate-300">·</span>
          <span>{internship.grade}</span>
        </div>
      </div>
    </a>
  );
}

export default function Internships() {
  const [params, setParams] = useSearchParams();
  const initialField = params.get('field') || '';
  const [field, setField] = useState(initialField);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => { setField(params.get('field') || ''); }, [params]);

  const filtered = useMemo(() => {
    return INTERNSHIPS.filter(i => {
      const okField = !field || i.field === field;
      const okQuery = !query || i.title.toLowerCase().includes(query.toLowerCase());
      const okLoc = !location || i.location.toLowerCase().includes(location.toLowerCase());
      return okField && okQuery && okLoc;
    });
  }, [field, query, location]);

  const locations = useMemo(() => Array.from(new Set(INTERNSHIPS.map(i => i.location))).sort(), []);
  const hasFilters = field || query || location;

  const setFieldParam = (f) => {
    if (f) params.set('field', f); else params.delete('field');
    setParams(params, { replace: true });
    setField(f);
  };

  const clearAll = () => {
    setFieldParam('');
    setQuery('');
    setLocation('');
  };

  return (
    <div className="bg-white text-slate-900">
      {/* Page header */}
      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-2">Catalog</div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                Internship Opportunities
              </h1>
              <p className="mt-2 text-slate-500 text-sm">
                {filtered.length} of {INTERNSHIPS.length} opportunities {user && `· signed in as ${user.displayName?.split(' ')[0]}`}
              </p>
            </div>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden inline-flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {field && `· ${field}`}
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-5 flex gap-3">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search opportunities…"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-white transition-all"
              />
            </div>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="hidden sm:block px-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-400 focus:outline-none text-sm bg-white text-slate-700"
            >
              <option value="">All Locations</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <div className="flex gap-8">
          {/* Sidebar — desktop always visible, mobile toggleable */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-52 flex-shrink-0`}>
            <div className="md:sticky md:top-24">
              <div className="text-[10px] tracking-[0.3em] uppercase text-slate-400 font-semibold mb-3">Category</div>
              <ul className="space-y-0.5">
                <li>
                  <button
                    onClick={() => { setFieldParam(''); setSidebarOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !field
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    All Fields
                    <span className={`ml-1.5 text-[10px] ${!field ? 'text-slate-300' : 'text-slate-400'}`}>
                      ({INTERNSHIPS.length})
                    </span>
                  </button>
                </li>
                {FIELD_TAGS.map(t => {
                  const count = INTERNSHIPS.filter(i => i.field === t).length;
                  return (
                    <li key={t}>
                      <button
                        onClick={() => { setFieldParam(t); setSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          field === t
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {t}
                        <span className={`ml-1.5 text-[10px] ${field === t ? 'text-blue-200' : 'text-slate-400'}`}>
                          ({count})
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Location filter (mobile) */}
              <div className="mt-6 sm:hidden">
                <div className="text-[10px] tracking-[0.3em] uppercase text-slate-400 font-semibold mb-3">Location</div>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-400 focus:outline-none text-sm bg-white text-slate-700"
                >
                  <option value="">All Locations</option>
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </aside>

          {/* Card grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <div className="text-lg font-semibold text-slate-700 mb-2">No results found</div>
                <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search terms.</p>
                <button onClick={clearAll} className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-[12px] text-slate-500 font-mono">
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                  {field && <span> in <span className="font-semibold text-slate-700">{field}</span></span>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((internship) => (
                    <InternshipCard key={internship.id} internship={internship} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
