import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import useInView from '../hooks/useInView';
import yriLogo from '../assets/images/1757383361622.jpeg';
import cymaLogo from '../assets/images/1722077578724.jpeg';
import caivoLogo from '../assets/images/charlotte_ai_vanguard_organization_logo.jpeg';
import viraLogo from '../assets/images/1766546447445.jpeg';
import empiricLogo from '../assets/images/empiric_logo.svg';
import yelLogo from '../assets/images/yel_logo.png';
import nyrjLogo from '../assets/images/nyrj_logo.png';
import exovistaLogo from '../assets/images/exovista_logo.png';
import nexoraLogo from '../assets/images/nexora_logo.svg';
import ejsLogo from '../assets/images/ejs_logo.jpeg';
import nsriLogo from '../assets/images/nsri_logo.jpeg';
import wsoLogo from '../assets/images/wso_logo.jpeg';

// ─── Single source of truth for all partners ───────────────────────────────
export const PARTNERS = [
  {
    id: 'yri',
    name: 'YRI Fellowship',
    short: 'YRI',
    tagline: 'Youth Research Initiative',
    description: 'Selective research fellowship connecting high school students with leading academic researchers and publishing original work.',
    logo: yriLogo,
    url: '#',
    initials: 'YRI',
    gradient: 'from-teal-600 to-emerald-700',
    category: 'Research',
  },
  {
    id: 'cyma',
    name: 'Charlotte Youth Marketing Association',
    short: 'CYMA',
    tagline: 'Youth Marketing & Mentorship',
    description: 'Providing real-world marketing pathways and career mentorship for ambitious high school and college students.',
    logo: cymaLogo,
    url: '#',
    initials: 'CYMA',
    gradient: 'from-pink-600 to-rose-700',
    category: 'Marketing',
  },
  {
    id: 'caivo',
    name: 'Charlotte AI Vanguard',
    short: 'CAIVO',
    tagline: 'AI & Technology',
    description: 'Tech-driven organization empowering students with hands-on AI research, engineering, and product development experience.',
    logo: caivoLogo,
    url: '#',
    initials: 'CAIVO',
    gradient: 'from-blue-600 to-indigo-700',
    category: 'Technology',
  },
  {
    id: 'vira',
    name: 'Vira Hackathons',
    short: 'ViraHacks',
    tagline: 'Hackathons & Builder Community',
    description: 'Premier student-run hackathon series turning curious students into builders, founders, and innovators.',
    logo: viraLogo,
    url: '#',
    initials: 'VIRA',
    gradient: 'from-violet-600 to-purple-700',
    category: 'Technology',
  },
  {
    id: 'empiric',
    name: 'Empiric Investing',
    short: 'Empiric',
    tagline: 'Student Finance & Investing',
    description: 'Bringing data-driven investment education and finance exposure to the next generation of student investors.',
    logo: empiricLogo,
    url: 'https://empiricinvesting.me',
    initials: 'EI',
    gradient: 'from-amber-500 to-yellow-600',
    category: 'Finance',
  },
  {
    id: 'yel',
    name: 'Youth Economy Lab',
    short: 'YEL',
    tagline: 'Economics & Policy Research',
    description: 'Empowering young economists and policy thinkers to tackle real-world economic challenges through rigorous research.',
    logo: yelLogo,
    url: 'https://youtheconomylab.com',
    initials: 'YEL',
    gradient: 'from-orange-500 to-amber-600',
    category: 'Policy',
  },
  {
    id: 'nyrj',
    name: 'National Youth Research Journal',
    short: 'NYRJ',
    tagline: 'Academic Publishing',
    description: 'A peer-reviewed journal showcasing original research and academic writing from high-achieving student scholars.',
    logo: nyrjLogo,
    url: 'https://nyrj.org',
    initials: 'NYRJ',
    gradient: 'from-cyan-600 to-teal-700',
    category: 'Research',
  },
  {
    id: 'ejs',
    name: "Explorer's Journal of Science",
    short: "Explorer's Journal",
    tagline: 'Science & Discovery',
    description: 'Celebrating and publishing groundbreaking scientific inquiry and STEM research from student researchers nationwide.',
    logo: ejsLogo,
    url: '#',
    initials: 'EJS',
    gradient: 'from-green-600 to-emerald-700',
    category: 'Science',
  },
  {
    id: 'exovista',
    name: 'Exovista',
    short: 'Exovista',
    tagline: 'Space & Deep Tech',
    description: 'A student-led platform connecting aspiring engineers with space exploration programs and cutting-edge STEM opportunities.',
    logo: exovistaLogo,
    url: 'https://exovista.org',
    initials: 'EXO',
    gradient: 'from-indigo-700 to-blue-900',
    category: 'Technology',
  },
  {
    id: 'nsri',
    name: 'National Student Research Institution',
    short: 'NSRI',
    tagline: 'Research & Mentorship',
    description: 'Connecting motivated students with research mentors and leading academic institutions across the United States.',
    logo: nsriLogo,
    url: 'https://nsri.org',
    initials: 'NSRI',
    gradient: 'from-slate-500 to-slate-700',
    category: 'Research',
  },
  {
    id: 'wso',
    name: 'Wall Street Oasis',
    short: 'WSO',
    tagline: 'Finance Career Community',
    description: "The world's largest finance community, connecting students and professionals with Wall Street career resources and opportunities.",
    logo: wsoLogo,
    url: 'https://www.wallstreetoasis.com',
    initials: 'WSO',
    gradient: 'from-amber-700 to-orange-800',
    category: 'Finance',
  },
  {
    id: 'nexora',
    name: 'Nexora AI',
    short: 'Nexora',
    tagline: 'Artificial Intelligence',
    description: 'Pioneering AI education and research pathways for the next generation of machine learning engineers and researchers.',
    logo: nexoraLogo,
    url: 'https://nexora-ai-saas-websi-dhrq.bolt.host',
    initials: 'NAI',
    gradient: 'from-blue-600 to-violet-700',
    category: 'Technology',
  },
];

// ─── Logo tile — used in both compact and full modes ───────────────────────
function PartnerLogo({ partner, size = 'md' }) {
  const [imgError, setImgError] = useState(false);
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-base',
  };
  const cls = sizeClasses[size] || sizeClasses.md;

  if (partner.logo && !imgError) {
    return (
      <img
        src={partner.logo}
        alt={partner.name}
        loading="lazy"
        onError={() => setImgError(true)}
        className={`${cls} rounded-xl object-cover`}
      />
    );
  }

  return (
    <div className={`${cls} rounded-xl bg-gradient-to-br ${partner.gradient} flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-black tracking-tight leading-none">{partner.initials}</span>
    </div>
  );
}

// ─── COMPACT — homepage logo strip ────────────────────────────────────────
function CompactPartnerTile({ partner }) {
  const Tag = partner.url && partner.url !== '#' ? 'a' : 'div';
  const linkProps = Tag === 'a'
    ? { href: partner.url, target: '_blank', rel: 'noreferrer' }
    : {};

  return (
    <Tag
      {...linkProps}
      className="group flex flex-col items-center gap-2.5 p-3 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md hover:shadow-blue-50 transition-all cursor-default"
      style={Tag === 'a' ? { cursor: 'pointer' } : {}}
      title={partner.name}
    >
      <PartnerLogo partner={partner} size="md" />
      <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight group-hover:text-blue-700 transition-colors line-clamp-2 max-w-[80px]">
        {partner.short}
      </span>
    </Tag>
  );
}

// ─── FULL — partners page card ────────────────────────────────────────────
function FullPartnerCard({ partner }) {
  const isExternal = partner.url && partner.url !== '#';
  const Tag = isExternal ? 'a' : 'div';
  const linkProps = isExternal
    ? { href: partner.url, target: '_blank', rel: 'noreferrer' }
    : {};

  return (
    <Tag
      {...linkProps}
      className={`group block rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-50 transition-all ${isExternal ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <PartnerLogo partner={partner} size="lg" />
          <div className="min-w-0">
            <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-blue-600">{partner.tagline}</div>
            <h3 className="mt-1 text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
              {partner.name}
            </h3>
          </div>
        </div>
        {isExternal && (
          <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1" />
        )}
      </div>
      <p className="mt-4 text-sm text-slate-500 leading-relaxed">{partner.description}</p>
      <div className="mt-4 inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
        {partner.category}
      </div>
    </Tag>
  );
}

// ─── PUBLIC API ────────────────────────────────────────────────────────────
/**
 * compact  — logo tile grid for homepage
 * !compact — full card grid for /partners page
 */
export default function PartnersSection({ compact = false }) {
  const [headerRef, headerVis] = useInView({ threshold: 0.1 });
  const [gridRef, gridVis] = useInView({ threshold: 0.04 });

  if (compact) {
    return (
      <section className="bg-[#f8fafc] border-y border-slate-200 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div ref={headerRef} className={`sr-item flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10${headerVis ? ' sr-visible' : ''}`}>
            <div>
              <div className="text-[10px] tracking-[0.4em] uppercase text-slate-400 mb-3">Our Network</div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Partners & Collaborators
              </h2>
              <p className="mt-2 text-slate-500 text-sm max-w-md">
                Trusted by leading student organizations, research journals, and career networks.
              </p>
            </div>
            <Link
              to="/partners"
              className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.15em] uppercase text-slate-500 hover:text-blue-600 transition-colors flex-shrink-0"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div ref={gridRef} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {PARTNERS.map((p, i) => (
              <div key={p.id}
                className={`sr-item${gridVis ? ' sr-visible' : ''}`}
                style={{ transitionDelay: `${i * 40}ms` }}>
                <CompactPartnerTile partner={p} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
      <div className="text-[10px] tracking-[0.4em] uppercase text-slate-400 mb-6">Our Partners</div>
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PARTNERS.map((p, i) => (
          <div key={p.id}
            className={`sr-item${gridVis ? ' sr-visible' : ''}`}
            style={{ transitionDelay: `${i * 50}ms` }}>
            <FullPartnerCard partner={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
