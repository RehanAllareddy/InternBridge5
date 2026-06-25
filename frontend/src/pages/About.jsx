import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, GraduationCap, Compass } from 'lucide-react';
import { STATS } from '../data/mock';

export default function About() {
  return (
    <div className="bg-[#f8fafc] text-slate-900">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-16 sm:pb-20">
        <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-4">About Us</div>
        <h1 className="font-black uppercase tracking-tight leading-[0.9] text-[clamp(48px,8vw,108px)]">
          <span className="block text-slate-900">Bridging Students</span>
          <span className="block text-blue-600">to Opportunity</span>
        </h1>
        <p className="mt-8 max-w-2xl text-slate-600 text-[15px] leading-relaxed">
          InternBridge is a curated directory of high school internship opportunities. We believe every student deserves access to real-world experience that shapes their future.
        </p>
      </section>

      {/* 3 Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { Icon: ShieldCheck, t: 'Curated Quality', d: 'Every opportunity is hand-picked and verified, ensuring students access only the best internships.' },
            { Icon: GraduationCap, t: 'Student-First', d: 'Built specifically for high school students, our platform understands your unique needs and ambitions.' },
            { Icon: Compass, t: 'Career Discovery', d: 'Explore 50+ fields from STEM to arts, helping you discover passions before choosing a college path.' },
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

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start border-t border-slate-200 pt-16">
          <div>
            <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-4">Our Mission</div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] text-slate-900">
              Democratize access to <span className="text-blue-600">career-building</span> experiences.
            </h2>
          </div>
          <div className="lg:pl-8">
            <p className="text-slate-600 text-[15px] leading-relaxed">
              No matter your background, zip code, or connections — the right internship is out there for you. We believe every student deserves the chance to explore, grow, and bridge the gap between where they are and where they want to be.
            </p>
            <Link to="/internships" className="mt-7 inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 text-[12px] font-semibold tracking-[0.18em] uppercase rounded hover:bg-blue-600 transition-colors">
              Start Exploring <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-10 text-slate-900">What We Stand For</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: '01', t: 'Access', d: 'Internship opportunities should not be gatekept by geography, income, or school prestige. We break down those barriers.' },
            { n: '02', t: 'Rigor', d: 'We hold our listings to high standards. Every opportunity reflects serious professional engagement and growth potential.' },
            { n: '03', t: 'Community', d: 'InternBridge is a student-first network. We build genuine pathways, not resume-padding shortcuts.' },
          ].map((v, i) => (
            <div key={i} className="border-t border-slate-900 pt-6">
              <div className="font-mono text-xs text-slate-500">{v.n}</div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">{v.t}</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-b border-slate-200 py-12">
          {[
            { v: `${STATS.opportunities}+`, l: 'Opportunities' },
            { v: `${STATS.fields}+`, l: 'Fields Covered' },
            { v: `${STATS.locations}+`, l: 'Locations' },
            { v: '100%', l: 'Free Access' },
          ].map((s, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="text-5xl md:text-6xl font-black tracking-tight text-slate-900">{s.v}</div>
              <div className="mt-2 text-[10px] tracking-[0.4em] uppercase text-slate-500">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-28">
        <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-4">Meet The Founder</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-1">
            <div className="aspect-square w-full max-w-[220px] sm:max-w-sm mx-auto lg:mx-0 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0b1326] to-blue-700 flex items-center justify-center text-white shadow-xl">
              <div className="text-center px-6">
                <div className="font-black text-7xl tracking-tight">RA</div>
                <div className="mt-4 text-[10px] tracking-[0.4em] uppercase text-blue-200">Founder</div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] text-slate-900">
              Rehan <span className="text-blue-600">Allareddy</span>
            </h2>
            <div className="mt-2 text-sm font-mono text-slate-500">Founder &amp; CEO · InternBridge</div>
            <div className="mt-6 space-y-4 text-slate-700 text-[15px] leading-relaxed max-w-2xl">
              <p>
                Rehan Allareddy is the founder of InternBridge — a platform built from the conviction that ambition shouldn't be limited by zip code, connections, or background. As a high school student himself, Rehan saw first-hand how difficult it was for students to discover serious, real-world internship opportunities outside the usual networks.
              </p>
              <p>
                He started InternBridge to fix that. What began as a personal spreadsheet of opportunities has grown into a curated directory used by students across the country, surfacing pathways into STEM, medicine, business, the arts, and beyond.
              </p>
              <p>
                Beyond InternBridge, Rehan is passionate about education access, youth entrepreneurship, and building tools that compound opportunity for the next generation. His mission is simple: make sure every student who is hungry to learn can find a door that opens.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
