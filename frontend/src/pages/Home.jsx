import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { STATS, FIELD_TAGS, LATEST_PLACEMENTS, FEATURED } from '../data/mock';

export default function Home() {
  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              {STATS.opportunities}+ Opportunities Live
            </div>
            <h1 className="font-display font-black uppercase leading-[0.9] tracking-tight text-[clamp(48px,7vw,104px)]">
              <span className="block text-slate-900">Bridge</span>
              <span className="block text-slate-900">The</span>
              <span className="block text-blue-600">Gap.</span>
            </h1>
            <p className="mt-8 max-w-md text-slate-600 text-[15px] leading-relaxed">
              Discover amazing internship opportunities across STEM, law, arts, business, and more. Built for high school students ready to make an impact.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/internships" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 text-[12px] font-semibold tracking-[0.18em] uppercase rounded hover:bg-blue-600 transition-colors">
                Explore Internships <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 border border-slate-300 text-slate-900 px-6 py-3 text-[12px] font-semibold tracking-[0.18em] uppercase rounded hover:border-slate-900 transition-colors">
                Learn More
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-2">
              {FIELD_TAGS.slice(0, 16).map(t => (
                <Link key={t} to={`/internships?field=${encodeURIComponent(t)}`} className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-slate-200">
                  {t}
                </Link>
              ))}
            </div>
          </div>
          {/* Right - Logo + Latest Placements */}
          <div className="lg:pl-8">
            <div className="flex justify-center lg:justify-end mb-10">
              <img
                src="https://customer-assets.emergentagent.com/job_bridge-internships/artifacts/s66q0dn8_768da46f-eeb4-4784-a15e-97681d97e863.png"
                alt="InternBridge"
                className="w-56 md:w-64 h-auto object-contain"
              />
            </div>
            <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-6">Latest Placements</div>
            <ul className="space-y-1">
              {LATEST_PLACEMENTS.map((p, i) => (
                <li key={i} className="group flex items-center justify-between py-3 border-b border-slate-100 hover:border-slate-300 transition-colors">
                  <div className="font-mono text-[13px] text-slate-700 group-hover:text-slate-900">
                    <span className="text-slate-900 font-semibold">{p.title}</span>
                    <span className="text-slate-400"> — {p.field} — {p.location}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-b border-slate-200 py-12">
          {[
            { v: `${STATS.opportunities}+`, l: 'Opportunities' },
            { v: `${STATS.fields}+`, l: 'Fields' },
            { v: `${STATS.locations}+`, l: 'Locations' },
            { v: STATS.gradeLevel, l: 'Grade Level' },
          ].map((s, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="text-5xl md:text-6xl font-black tracking-tight text-slate-900">{s.v}</div>
              <div className="mt-2 text-[10px] tracking-[0.4em] uppercase text-slate-500">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED OPPORTUNITIES GRID */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-3">Trending Now</div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Featured Opportunities</h2>
          </div>
          <Link to="/internships" className="hidden md:inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.18em] uppercase text-slate-700 hover:text-blue-600">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED.map((f, i) => (
            <a key={i} href={f.url} target="_blank" rel="noreferrer" className="group rounded-xl border border-slate-200 bg-white p-6 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-blue-600">{f.field}</div>
              <div className="mt-3 text-lg font-bold text-slate-900 group-hover:text-blue-600">{f.title}</div>
              <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>{f.location} · {f.deadline}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* READY TO LAUNCH */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center border-t border-slate-200 pt-16">
          <div>
            <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-4">Your Future Starts Now</div>
            <h2 className="font-black uppercase leading-[0.9] tracking-tight text-[clamp(48px,7vw,96px)]">
              <span className="block text-slate-900">Ready To</span>
              <span className="block text-blue-600">Launch?</span>
            </h2>
          </div>
          <div className="lg:pl-8">
            <p className="text-slate-600 text-[15px] leading-relaxed max-w-md">
              We're on a mission to democratize access to career-building experiences. No matter your background, zip code, or connections — the right internship is out there for you.
            </p>
            <Link to="/internships" className="mt-7 inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 text-[12px] font-semibold tracking-[0.18em] uppercase rounded hover:bg-blue-600 transition-colors">
              Start Exploring <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
