import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Handshake, Sparkles, Network } from 'lucide-react';
import PartnersSection from '../components/PartnersSection';

export default function Partners() {
  return (
    <div className="bg-[#f8fafc] text-slate-900">

      {/* ── Dark header ───────────────────────────────────── */}
      <div className="relative bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-line-grid" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 8% 60%, rgba(37,99,235,0.18) 0%, transparent 70%)' }} />
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-16 sm:pb-20">
          <div className="text-[10px] tracking-[0.4em] uppercase text-blue-400 mb-4">Our Network</div>
          <h1 className="font-black uppercase tracking-tight leading-[0.9] text-[clamp(44px,8vw,108px)] text-white">
            Trusted<br />
            <span style={{ background: 'linear-gradient(90deg, #60a5fa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Partners.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-slate-400 text-[14px] sm:text-[15px] leading-relaxed">
            We collaborate with leading student organizations, research journals, and career networks to connect ambitious students with meaningful opportunities.
          </p>
        </section>
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #f8fafc)' }} />
      </div>

      {/* ── Partner with us CTA ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-6 sm:px-10 py-10 sm:py-14">
          <div className="absolute inset-0 bg-line-grid opacity-30" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="text-[10px] tracking-[0.4em] uppercase text-blue-200 mb-3">Join the Network</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">Partner with InternBridge</h2>
              <p className="mt-4 text-blue-100/90 text-[14px] sm:text-[15px] leading-relaxed">
                Reach motivated, ambitious students nationwide. List opportunities, host featured programs, and shape the next generation of talent.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a
                href="https://form.typeform.com/to/qzET9mgP"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-7 py-3.5 text-[12px] font-semibold tracking-[0.18em] uppercase rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Get In Touch <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── All partners — full cards ─────────────────────── */}
      <PartnersSection compact={false} />

      {/* ── Why partner ───────────────────────────────────── */}
      <section className="bg-white border-t border-slate-200 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-[10px] tracking-[0.4em] uppercase text-slate-400 mb-4">Why Partner</div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-10">What you get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { Icon: Handshake, t: 'Become a Partner', d: 'Offer mentorship and internship pathways to the next generation of motivated, driven students.' },
              { Icon: Sparkles, t: 'Featured Programs', d: 'Get spotlighted on our homepage and internship catalog with curated featured opportunity placements.' },
              { Icon: Network, t: 'Talent Pipeline', d: 'Build early relationships with high-potential high school and college students before anyone else.' },
            ].map(({ Icon, t, d }, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-7 hover:border-blue-400 hover:bg-white hover:shadow-lg hover:shadow-blue-50 transition-all">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600 mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{t}</h3>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
