import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { STATS } from '../data/mock';
import { fetchStats } from '../lib/api';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_bridge-internships/artifacts/s66q0dn8_768da46f-eeb4-4784-a15e-97681d97e863.png';

export default function Footer() {
  const [total, setTotal] = useState(STATS.opportunities);
  useEffect(() => {
    let mounted = true;
    fetchStats().then(s => { if (mounted && s?.total) setTotal(s.total); }).catch(() => {});
    return () => { mounted = false; };
  }, []);
  return (
    <footer className="bg-[#0b1326] text-slate-300 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-10">
        <div className="text-center text-[11px] tracking-[0.4em] uppercase text-slate-500 mb-16">Global Internship Pulse</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-slate-800">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-white rounded-md p-1.5 inline-flex">
                <img src={LOGO_URL} alt="InternBridge" className="h-9 w-auto object-contain" />
              </div>
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
          <div>{total}+ Opportunities Live</div>
        </div>
      </div>
    </footer>
  );
}
