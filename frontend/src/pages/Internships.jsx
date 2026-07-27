import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ArrowUpRight, X, SlidersHorizontal } from 'lucide-react';
import { INTERNSHIPS, FIELD_TAGS } from '../data/mock';
import { useAuth } from '../context/AuthContext';
import useStaggerOnChange from '../hooks/useStaggerOnChange';
import { hoverPulseIn, hoverPulseOut } from '../lib/motion';

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
      onMouseEnter={hoverPulseIn}
      onMouseLeave={hoverPulseOut}
      className="reveal group block rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-50 transition-all active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <FieldBadge field={internship.field} />
        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-0.5" />
      </div>
      <h3 className="mt-3 text-[14px] sm:text-[15px] font-bold text-slate-900 group-hover:text-blue-600 leading-snug transition-colors">
        {internship.title}
      </h3>
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] font-mono text-slate-400 truncate">{internship.location}</span>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 flex-shrink-0">
          <span>{internship.deadline}</span>
          <span className="text-slate-200">·</span>
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

  // Close sidebar when going to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setSidebarOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const filtered = useMemo(() => {
    return INTERNSHIPS.filter(i => {
      const okField = !field || i.field === field;
      const okQuery = !query || i.title.toLowerCase().includes(query.toLowerCase());
      const okLoc = !location || i.location.toLowerCase().includes(location.toLowerCase());
      return okField && okQuery && okLoc;
    });
  }, [field, query, location]);

  const cardGridRef = useStaggerOnChange([filtered], { staggerMs: 45 });

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
    <div className="bg-[#f8fafc]">

      {/* ── Dark header ───────────────────────────────────── */}
      <div className="relative bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 90% at 0% 50%, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-12 lg:pt-14 pb-12 sm:pb-14 lg:pb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="text-[10px] tracking-[0.4em] uppercase text-blue-400 mb-2">Catalog</div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                Internship Opportunities
              </h1>
              <p className="mt-1.5 text-slate-400 text-sm">
                {filtered.length} of {INTERNSHIPS.length} listings
                {user && <span className="text-slate-600"> · {user.displayName?.split(' ')[0]}</span>}
              </p>
            </div>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden self-start sm:self-auto inline-flex items-center gap-2 border border-white/15 text-slate-300 rounded-lg px-4 py-2.5 text-sm font-semibold touch-manipulation"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {field ? field : 'Filter'}
              {field && <X className="w-3 h-3 ml-1" onClick={(e) => { e.stopPropagation(); setFieldParam(''); }} />}
            </button>
          </div>

          {/* Search row — wraps on mobile */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search opportunities…"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/10 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
              />
            </div>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-shrink-0 px-3 py-2.5 rounded-lg border border-white/10 text-slate-300 text-sm focus:border-blue-500 focus:outline-none max-w-[160px]"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
            >
              <option value="" style={{ background: '#0f172a' }}>All Locations</option>
              {locations.map(l => <option key={l} value={l} style={{ background: '#0f172a' }}>{l}</option>)}
            </select>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-white/10 text-sm text-slate-400 hover:text-white hover:border-white/25 transition-colors touch-manipulation"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <div className="flex gap-6 lg:gap-8">

          {/* Sidebar — mobile: dropdown drawer, desktop: fixed column */}
          <aside className={`
            ${sidebarOpen
              ? 'fixed inset-x-0 top-[128px] z-40 bg-white border-b border-slate-200 shadow-xl px-4 py-4 md:relative md:inset-auto md:top-auto md:z-auto md:bg-transparent md:border-0 md:shadow-none md:px-0 md:py-0'
              : 'hidden md:block'}
            w-full md:w-52 flex-shrink-0
          `}>
            <div className="md:sticky md:top-24 max-h-[60vh] md:max-h-none overflow-y-auto">
              <div className="text-[10px] tracking-[0.3em] uppercase text-slate-400 font-semibold mb-3">Category</div>
              <ul className="space-y-0.5">
                <li>
                  <button
                    onClick={() => { setFieldParam(''); setSidebarOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                      !field ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                    }`}
                  >
                    All Fields
                    <span className={`ml-1.5 text-[10px] ${!field ? 'text-slate-400' : 'text-slate-400'}`}>
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
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                          field === t
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                            : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
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
            </div>
          </aside>

          {/* Overlay to close sidebar on mobile */}
          {sidebarOpen && (
            <div
              className="md:hidden fixed inset-0 z-30 bg-black/20"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Card grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="py-16 sm:py-20 text-center bg-white rounded-2xl border border-slate-200">
                <div className="text-4xl mb-4">🔍</div>
                <div className="text-lg font-semibold text-slate-700 mb-2">No results found</div>
                <p className="text-slate-400 text-sm mb-6 px-4">Try adjusting your filters or search terms.</p>
                <button onClick={clearAll}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors touch-manipulation">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-[12px] text-slate-400 font-mono">
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                  {field && <span> in <span className="font-semibold text-slate-700">{field}</span></span>}
                </div>
                <div ref={cardGridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
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
