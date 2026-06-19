import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Handshake, Sparkles, Network } from 'lucide-react';
import caivoLogo from "../assets/images/charlotte_ai_vanguard_organization_logo.jpeg";
import cymaLogo from "../assets/images/1722077578724.jpeg";
import yriLogo from "../assets/images/1757383361622.jpeg";
import viraLogo from "../assets/images/1766546447445.jpeg";

const PARTNERS = [
  {
    name: "CAIVO",
    tagline: "Innovation & Technology",
    description: "Tech-driven partner empowering students with hands-on engineering and product experience.",
    image: caivoLogo,
  },
  {
    name: "CYMA",
    tagline: "Career Mentorship",
    description: "A featured collaborator providing real-world internship pathways and mentorship for ambitious students.",
    image: cymaLogo,
  },
  {
    name: "YRI Fellowship",
    tagline: "Youth Research Initiative",
    description: "Selective research fellowship connecting high school students with leading academic researchers.",
    image: yriLogo,
  },
  {
    name: "ViraHacks",
    tagline: "Hackathons & Builder Community",
    description: "Premier student-run hackathon series turning curious students into builders and founders.",
    image: viraLogo,
  },
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

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b3aa8] via-[#1452d9] to-[#2b8bff] text-white p-10 md:p-14">
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Partner with InternBridge</h2>
            <p className="mt-5 text-blue-50/90 text-[15px] leading-relaxed max-w-xl">
              Reach motivated, ambitious students nationwide. List opportunities, host featured programs, and shape the next generation of talent.
            </p>
            <a href="https://form.typeform.com/to/qzET9mgP" target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 text-[12px] font-semibold tracking-[0.18em] uppercase rounded hover:bg-blue-50 transition-colors">
              Get In Touch <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-6">Our Partners</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PARTNERS.map((p, i) => (
            <div key={i} className="group rounded-xl border border-slate-200 bg-white p-8 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-blue-600">{p.tagline}</div>
                  <h3 className="mt-2 text-2xl md:text-3xl font-black tracking-tight text-slate-900">{p.name}</h3>
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed max-w-md">{p.description}</p>
                </div>
                <div className="shrink-0 w-14 h-14 rounded-lg bg-blue-50 overflow-hidden flex items-center justify-center">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
              </div>
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
    </div>
  );
}
