import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Handshake, Sparkles, Network } from 'lucide-react';

const PARTNERS = [
  'Google', 'NASA', 'Harvard', 'MIT', 'Adobe', 'Bank of America',
  'Goldman Sachs', 'JPMorgan', 'Microsoft', 'Amazon', 'IBM', 'Cisco',
  'Pfizer', 'Mayo Clinic', 'NIH', 'Tesla', 'SpaceX', 'Stanford',
];

export default function Partners() {
  return (
    <div className="bg-white text-slate-900">
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-16">
        <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-4">Our Network</div>
        <h1 className="font-black uppercase tracking-tight leading-[0.9] text-[clamp(48px,8vw,108px)]">
          <span className="block text-slate-900">Trusted</span>
          <span className="block text-blue-600">Partners.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-slate-600 text-[15px] leading-relaxed">
          We collaborate with leading organizations, research labs, universities and Fortune 500 companies to connect ambitious students with meaningful internship experiences.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden">
          {PARTNERS.map((p, i) => (
            <div key={i} className="bg-white aspect-[3/2] flex items-center justify-center text-center px-4 hover:bg-slate-50 transition-colors">
              <div className="font-bold text-slate-700 text-sm md:text-base">{p}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { Icon: Handshake, t: 'Become a Partner', d: 'Offer mentorship and internship pathways to the next generation of innovators.' },
            { Icon: Sparkles, t: 'Featured Programs', d: 'Get spotlighted on our homepage with curated featured opportunity placements.' },
            { Icon: Network, t: 'Talent Pipeline', d: 'Build early relationships with high-potential high school and college students.' },
          ].map(({ Icon, t, d }, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-8 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-blue-50 text-blue-600 mb-5">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t}</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b3aa8] via-[#1452d9] to-[#2b8bff] text-white p-10 md:p-14">
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Partner with InternBridge</h2>
            <p className="mt-5 text-blue-50/90 text-[15px] leading-relaxed max-w-xl">
              Reach motivated, ambitious students nationwide. List opportunities, host featured programs, and shape the next generation of talent.
            </p>
            <Link to="/about" className="mt-7 inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 text-[12px] font-semibold tracking-[0.18em] uppercase rounded hover:bg-blue-50 transition-colors">
              Get In Touch <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
