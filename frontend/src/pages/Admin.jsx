import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Sparkles, Clock, CheckCircle2, AlertCircle, Loader2, ArrowUpRight, Database } from 'lucide-react';
import { triggerScrape, fetchScrapeStatus, fetchStats, fetchRecentInternships } from '../lib/api';

function fmtDate(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch (_) {
    return iso;
  }
}

function relTime(iso) {
  if (!iso) return 'never';
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

export default function Admin() {
  const [runs, setRuns] = useState([]);
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const [s, st, rc] = await Promise.all([
        fetchScrapeStatus(),
        fetchStats(),
        fetchRecentInternships(20),
      ]);
      setRuns(s.runs || []);
      setStats(st);
      setRecent(rc);
      const top = (s.runs || [])[0];
      setRunning(top?.status === 'running');
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, []);

  const handleScrape = async () => {
    setMessage('');
    try {
      const res = await triggerScrape();
      setMessage(res.message || 'Scrape started.');
      setRunning(true);
      refresh();
    } catch (e) {
      setMessage('Failed to start scrape.');
    }
  };

  return (
    <div className="bg-white text-slate-900">
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-4 inline-flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-blue-600" /> Admin Console
        </div>
        <h1 className="font-black uppercase tracking-tight leading-[0.9] text-[clamp(40px,7vw,88px)]">
          <span className="block text-slate-900">AI</span>
          <span className="block text-blue-600">Scraper.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-slate-600">
          The scraper auto-runs every 6 hours. It uses Tavily web search + an LLM to discover new high school and college internship opportunities, then dedupes and stores them in MongoDB.
        </p>
      </section>

      {/* Stats grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-blue-600">Total</div>
            <div className="mt-3 text-4xl font-black tracking-tight text-slate-900">{stats?.total ?? '—'}</div>
            <div className="mt-1 text-xs text-slate-500">Internships in DB</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-blue-600">Fields</div>
            <div className="mt-3 text-4xl font-black tracking-tight text-slate-900">{stats?.fields ?? '—'}</div>
            <div className="mt-1 text-xs text-slate-500">Distinct categories</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-blue-600">Locations</div>
            <div className="mt-3 text-4xl font-black tracking-tight text-slate-900">{stats?.locations ?? '—'}</div>
            <div className="mt-1 text-xs text-slate-500">Distinct locations</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-blue-600">Last Scrape</div>
            <div className="mt-3 text-2xl md:text-3xl font-black tracking-tight text-slate-900">{relTime(stats?.last_scrape)}</div>
            <div className="mt-1 text-xs text-slate-500">{stats?.last_scrape_added ?? 0} added last run</div>
          </div>
        </div>
      </section>

      {/* Action panel */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-10">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-semibold text-blue-600">
                <Database className="w-3 h-3" /> Manual Trigger
              </div>
              <h2 className="mt-2 text-2xl md:text-3xl font-black tracking-tight text-slate-900">Scrape now</h2>
              <p className="mt-2 text-sm text-slate-600 max-w-md">Force an immediate scrape run. Takes ~30–90 seconds. New internships will be appended.</p>
            </div>
            <button
              onClick={handleScrape}
              disabled={running}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 text-[12px] font-semibold tracking-[0.18em] uppercase rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {running ? (<><Loader2 className="w-4 h-4 animate-spin" /> Running…</>) : (<><RefreshCw className="w-4 h-4" /> Scrape Now</>)}
            </button>
          </div>
          {message && <div className="mt-4 text-sm text-blue-700">{message}</div>}
        </div>
      </section>

      {/* Runs table */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-10">
        <h3 className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-4">Recent Runs</h3>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-slate-50 text-[10px] tracking-[0.2em] uppercase font-semibold text-slate-500 border-b border-slate-200">
            <div className="col-span-3">Started</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Queries</div>
            <div className="col-span-2 text-right">Candidates</div>
            <div className="col-span-2 text-right">New Added</div>
            <div className="col-span-1 text-right">Duration</div>
          </div>
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">Loading…</div>
          ) : runs.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">No runs yet. Click "Scrape Now" to start one.</div>
          ) : runs.map(r => (
            <div key={r.id} className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-slate-100 text-sm last:border-b-0 hover:bg-slate-50">
              <div className="col-span-3 font-mono text-xs text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {fmtDate(r.started_at)}
                </div>
              </div>
              <div className="col-span-2">
                {r.status === 'completed' && <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>}
                {r.status === 'running' && <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running</span>}
                {r.status === 'failed' && <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700"><AlertCircle className="w-3.5 h-3.5" /> Failed</span>}
              </div>
              <div className="col-span-2 text-right font-mono text-xs text-slate-700">{r.queries_searched ?? 0}</div>
              <div className="col-span-2 text-right font-mono text-xs text-slate-700">{r.candidates_found ?? 0}</div>
              <div className="col-span-2 text-right font-mono text-xs font-semibold text-emerald-700">+{r.new_added ?? 0}</div>
              <div className="col-span-1 text-right font-mono text-xs text-slate-500">{Math.round(r.duration_seconds || 0)}s</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently scraped */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <h3 className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-4">Recently Scraped Internships</h3>
        {recent.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-slate-500 text-sm">
            None yet. New scraped opportunities will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recent.map((i) => (
              <a key={i.id} href={i.url} target="_blank" rel="noreferrer" className="group rounded-xl border border-slate-200 bg-white p-6 hover:border-blue-500 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-blue-600">{i.field}</div>
                  <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">New</span>
                </div>
                <div className="mt-3 text-base font-bold text-slate-900 group-hover:text-blue-600">{i.title}</div>
                <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>{i.location} · {i.deadline}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600" />
                </div>
              </a>
            ))}
          </div>
        )}
        <div className="mt-8">
          <Link to="/internships" className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.18em] uppercase text-slate-700 hover:text-blue-600">
            View All Internships <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
