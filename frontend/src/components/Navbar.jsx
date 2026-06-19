import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_bridge-internships/artifacts/s66q0dn8_768da46f-eeb4-4784-a15e-97681d97e863.png';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/internships', label: 'Explore' },
  { to: '/match', label: 'Match' },
  { to: '/partners', label: 'Partners' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={LOGO_URL} alt="InternBridge" className="h-14 w-auto object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 text-[12px] font-semibold tracking-[0.18em] uppercase transition-colors rounded-md ${
                  isActive ? 'text-white bg-slate-900' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-slate-900" aria-label="Menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-6 py-3 flex flex-col">
            {NAV.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-3 text-[12px] font-semibold tracking-[0.18em] uppercase ${
                    isActive ? 'text-blue-600' : 'text-slate-800'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
