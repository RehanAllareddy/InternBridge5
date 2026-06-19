import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ArrowUpRight, Filter, X } from 'lucide-react';
import { INTERNSHIPS, FIELD_TAGS } from '../data/mock';

export default function Internships() {
  const [params, setParams] = useSearchParams();
  const initialField = params.get('field') || '';
  const [field, setField] = useState(initialField);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

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

  const setFieldParam = (f) => {
    if (f) params.set('field', f); else params.delete('field');
    setParams(params, { replace: true });
    setField(f);
  };

  return (
    <div className="bg-white text-slate-900">
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-4">Catalog</div>
        <h1 className="font-black uppercase tracking-tight leading-[0.9] text-[clamp(48px,8vw,108px)] text-slate-900">
          High School and College <span className="text-blue-600">Internships & Career Opportunities</span>
        </h1>
        <p className="mt-6 max-w-2xl text-slate-600">Discover amazing internship opportunities across STEM, law, arts, business, and more.</p>
        <div className="mt-3 text-sm font-mono text-slate-500">{filtered.length} of {INTERNSHIPS.length} opportunities</div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-8">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search opportunities..."
              className="w-full pl-10 pr-4 py-3 rounded-md border border-slate-200 focus:border-slate-900 focus:outline-none text-sm"
            />
          </div>
          <select value={location} onChange={(e) => setLocation(e.target.value)} className="px-4 py-3 rounded-md border border-slate-200 focus:border-slate-900 focus:outline-none text-sm bg-white">
            <option value="">All Locations</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Filter className="w-4 h-4" />
            <span>{filtered.length} results</span>
          </div>
        </div>

        {/* Field chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={() => setFieldParam('')} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${!field ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`}>All</button>
          {FIELD_TAGS.map(t => (
            <button key={t} onClick={() => setFieldParam(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${field === t ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`}>
              {t}
            </button>
          ))}
          {(field || query || location) && (
            <button onClick={() => { setFieldParam(''); setQuery(''); setLocation(''); }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-500">No opportunities match your filters.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((i, idx) => (
              <a key={i.id || idx} href={i.url} target="_blank" rel="noreferrer" className="group rounded-xl border border-slate-200 bg-white p-6 hover:border-blue-500 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-blue-600">{i.field}</div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="mt-3 text-lg font-bold text-slate-900 group-hover:text-blue-600">{i.title}</div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>{i.location}</span>
                  <span>{i.deadline}</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 font-mono">Grade: {i.grade}</div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
