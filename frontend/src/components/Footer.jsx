import React from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { STATS } from '../data/mock';

export default function Footer() {
  return (
    <footer className="bg-[#0b1326] text-slate-300 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-10">
        <div className="text-center text-[11px] tracking-[0.4em] uppercase text-slate-500 mb-16">Global Internship Pulse</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-slate-800">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/10 text-white">
                <Building2 className="w-4 h-4" />
              </span>
              <span className="text-[17px] font-extrabold tracking-tight">
                <span className="text-white">INTERN</span>
                <span className="text-blue-500">BRIDGE</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-xs">
              Bridging the gap between academic potential and professional opportunity. Built for high school students ready to make an impact.
            </p>
          </div>
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-slate-500 mb-4">Navigate</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/internships" className="hover:text-white">Explore</Link></li>
              <li><Link to="/partners" className="hover:text-white">Partners</Link></li>
              <li><Link to="/about" className="hover:text-white">About</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-slate-500 mb-4">Top Fields</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/internships?field=STEM" className="hover:text-white">STEM</Link></li>
              <li><Link to="/internships?field=Business" className="hover:text-white">Business</Link></li>
              <li><Link to="/internships?field=Medicine" className="hover:text-white">Medicine</Link></li>
              <li><Link to="/internships?field=Engineering" className="hover:text-white">Engineering</Link></li>
              <li><Link to="/internships?field=Design" className="hover:text-white">Design</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 text-xs text-slate-500">
          <div>© 2026 InternBridge. All rights reserved.</div>
          <div>{STATS.opportunities}+ Opportunities Live</div>
        </div>
      </div>
    </footer>
  );
}
