import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { STATS, FIELD_TAGS, LATEST_PLACEMENTS, FEATURED, IMPACT } from '../data/mock';
import PartnersSection from '../components/PartnersSection';

const FIELD_COLORS = {
  CS: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  STEM: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Medicine: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  AI: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Finance: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Engineering: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Design: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Business: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Law: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  Research: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
};

const LIGHT_FIELD_COLORS = {
  CS: 'bg-violet-50 text-violet-700 border-violet-100',
  STEM: 'bg-blue-50 text-blue-700 border-blue-100',
  Medicine: 'bg-rose-50 text-rose-700 border-rose-100',
  AI: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Finance: 'bg-amber-50 text-amber-700 border-amber-100',
  Engineering: 'bg-sky-50 text-sky-700 border-sky-100',
  Design: 'bg-pink-50 text-pink-700 border-pink-100',
  Business: 'bg-orange-50 text-orange-700 border-orange-100',
};

function DarkFieldBadge({ field }) {
  const cls = FIELD_COLORS[field] || 'bg-white/10 text-slate-300 border-white/10';
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full border ${cls}`}>
      {field}
    </span>
  );
}

function LightFieldBadge({ field }) {
  const cls = LIGHT_FIELD_COLORS[field] || 'bg-slate-100 text-slate-600 border-slate-200';
  return (
    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full border ${cls}`}>
      {field}
    </span>
  );
}

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-[#f8fafc] text-slate-900">

      {/* ── DARK HERO ─────────────────────────────────────── */}
      <div className="relative bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-line-grid" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 65% 80% at 10% 60%, rgba(37,99,235,0.18) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 85% 10%, rgba(99,102,241,0.12) 0%, transparent 65%)' }} />

        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-20 pb-20 sm:pb-24 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-blue-400 mb-6 sm:mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                {STATS.opportunities}+ Opportunities Live
              </div>

              <h1 className="font-black uppercase leading-[0.88] tracking-tight text-[clamp(48px,10vw,110px)]">
                <span className="block text-white">Bridge</span>
                <span className="block text-white">The</span>
                <span className="block"
                  style={{ background: 'linear-gradient(90deg, #60a5fa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Gap.
                </span>
              </h1>

              <p className="mt-6 sm:mt-8 max-w-md text-slate-400 text-[14px] sm:text-[15px] leading-relaxed">
                Discover amazing internship opportunities across STEM, law, arts, business, and more. Built for high school students ready to make an impact.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-2 sm:gap-3">
                {user ? (
                  <>
                    <Link to="/internships"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 sm:px-6 py-3 text-[12px] font-semibold tracking-[0.18em] uppercase rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/25">
                      Explore Internships <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/match"
                      className="inline-flex items-center gap-2 border border-white/20 text-white px-5 sm:px-6 py-3 text-[12px] font-semibold tracking-[0.18em] uppercase rounded-lg hover:border-white/40 hover:bg-white/5 transition-all">
                      Find My Match
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 sm:px-6 py-3 text-[12px] font-semibold tracking-[0.18em] uppercase rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/25">
                      Get Access — Free <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/about"
                      className="inline-flex items-center gap-2 border border-white/20 text-white/80 px-5 sm:px-6 py-3 text-[12px] font-semibold tracking-[0.18em] uppercase rounded-lg hover:border-white/40 hover:text-white transition-all">
                      Learn More
                    </Link>
                  </>
                )}
              </div>

              {!user && (
                <div className="mt-4 inline-flex items-center gap-2 text-[11px] text-slate-500">
                  <Lock className="w-3.5 h-3.5" />
                  Sign in with Google · Always free
                </div>
              )}

              {/* Field tags — wrap naturally on mobile */}
              <div className="mt-8 flex flex-wrap gap-2">
                {FIELD_TAGS.slice(0, 12).map(t => (
                  <Link key={t}
                    to={user ? `/internships?field=${encodeURIComponent(t)}` : '/login'}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border text-slate-400 hover:text-white hover:border-white/25 transition-all"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                    {t}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right - Latest Placements (hidden on mobile, shown on lg) */}
            <div className="hidden lg:block lg:pl-8">
              <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-5">Latest Placements</div>
              <ul>
                {LATEST_PLACEMENTS.map((p, i) => (
                  <li key={i} className="group flex items-center justify-between py-3.5 border-b border-white/[0.06] hover:border-white/15 transition-colors">
                    <div className="flex items-center gap-3">
                      <DarkFieldBadge field={p.field} />
                      <span className="text-[13px] font-semibold text-slate-300 group-hover:text-white transition-colors">{p.title}</span>
                      <span className="hidden xl:inline text-[12px] text-slate-600">— {p.location}</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Fade into off-white */}
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #f8fafc)' }} />
      </div>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
          {[
            { v: `${STATS.opportunities}+`, l: 'Opportunities' },
            { v: `${STATS.fields}+`, l: 'Fields' },
            { v: `${STATS.locations}+`, l: 'Locations' },
            { v: STATS.gradeLevel, l: 'Grade Level', small: true },
          ].map((s, i) => (
            <div key={i} className="text-center md:text-left">
              <div className={`font-black tracking-tight text-slate-900 ${s.small ? 'text-2xl sm:text-3xl md:text-4xl pt-1 sm:pt-3' : 'text-4xl sm:text-5xl md:text-6xl'}`}>{s.v}</div>
              <div className="mt-1.5 text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-slate-400">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── IMPACT ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-1">
            <div className="text-[10px] tracking-[0.4em] uppercase text-slate-400 mb-4">Our Impact</div>
            <h2 className="font-black uppercase leading-[0.95] tracking-tight text-[clamp(32px,6vw,64px)] text-slate-900">
              Real <span className="text-blue-600">Reach.</span>
              <br />Real Results.
            </h2>
            <p className="mt-5 text-slate-500 text-[14px] sm:text-[15px] leading-relaxed max-w-md">
              We&apos;re not just a directory. We&apos;ve actively shaped student journeys, built a growing community, and collaborated with peers from top universities.
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {IMPACT.map((s, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-50 transition-all">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">{s.value}</div>
                <div className="mt-3 text-[10px] tracking-[0.3em] uppercase font-semibold text-blue-600">{s.label}</div>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ──────────────────────────────────────── */}
      <section className="bg-white border-y border-slate-200 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <div className="text-[10px] tracking-[0.4em] uppercase text-slate-400 mb-3">Trending Now</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900">Featured Opportunities</h2>
            </div>
            <Link to={user ? '/internships' : '/login'}
              className="hidden sm:inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.18em] uppercase text-slate-500 hover:text-blue-600 transition-colors flex-shrink-0 ml-4">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED.map((f, i) => (
              <div key={i} className="group rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 sm:p-6 hover:border-blue-400 hover:bg-white hover:shadow-lg hover:shadow-blue-50/80 transition-all">
                <LightFieldBadge field={f.field} />
                <h3 className="mt-3 text-[14px] sm:text-[15px] font-bold text-slate-900 group-hover:text-blue-600 leading-snug transition-colors">{f.title}</h3>
                <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">{f.location} · {f.deadline}</span>
                  {user ? (
                    <a href={f.url} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 touch-manipulation py-1">
                      Apply <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <Link to="/login"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-blue-600 transition-colors py-1">
                      <Lock className="w-3 h-3" /> Sign in
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Mobile "View All" */}
          <div className="sm:hidden mt-6 text-center">
            <Link to={user ? '/internships' : '/login'}
              className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.18em] uppercase text-slate-500 hover:text-blue-600 transition-colors">
              View All Opportunities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PARTNERS ──────────────────────────────────────── */}
      <PartnersSection compact />

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">
        <div className="relative rounded-2xl sm:rounded-3xl bg-slate-950 overflow-hidden px-6 sm:px-10 py-12 sm:py-14 lg:py-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="absolute inset-0 bg-line-grid" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 5% 50%, rgba(37,99,235,0.2) 0%, transparent 65%)' }} />
          <div className="relative">
            <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-4">Your Future Starts Now</div>
            <h2 className="font-black uppercase leading-[0.9] tracking-tight text-[clamp(32px,6vw,72px)] text-white">
              Ready To<br />
              <span style={{ background: 'linear-gradient(90deg, #60a5fa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Launch?
              </span>
            </h2>
            <p className="mt-5 text-slate-400 text-[14px] sm:text-[15px] leading-relaxed max-w-md">
              We&apos;re on a mission to democratize access to career-building experiences. No matter your background, zip code, or connections.
            </p>
          </div>
          <div className="relative flex-shrink-0 w-full lg:w-auto">
            <Link to={user ? '/internships' : '/login'}
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-7 sm:px-8 py-4 text-[13px] font-semibold tracking-[0.18em] uppercase rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30">
              {user ? 'Explore All Internships' : 'Get Free Access'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
