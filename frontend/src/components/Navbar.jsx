import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOutUser } from '../firebase';
import { hoverPulseIn, hoverPulseOut } from '../lib/motion';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_bridge-internships/artifacts/s66q0dn8_768da46f-eeb4-4784-a15e-97681d97e863.png';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/internships', label: 'Explore' },
  { to: '/match', label: 'Match' },
  { to: '/partners', label: 'Partners' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleSignOut = async () => {
    await signOutUser();
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0" onClick={() => setMobileOpen(false)}>
          <img src={LOGO_URL} alt="InternBridge" className="h-11 w-auto object-contain" />
        </Link>

        {/* Desktop nav — centered */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                `px-3 lg:px-4 py-2 text-[11px] lg:text-[12px] font-semibold tracking-[0.15em] uppercase transition-colors rounded-md ${
                  isActive
                    ? 'text-slate-900 bg-slate-100'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {user === undefined ? (
            <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-7 h-7 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-[12px] font-semibold text-slate-700 max-w-[100px] truncate">
                  {user.displayName?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="text-[12px] font-semibold text-slate-900 truncate">{user.displayName}</div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-slate-400" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              onMouseEnter={hoverPulseIn}
              onMouseLeave={hoverPulseOut}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 text-[12px] font-semibold tracking-[0.15em] uppercase rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile: show avatar or sign-in + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {user && user !== undefined && (
            <div className="flex items-center gap-2 mr-1">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 -mr-1 text-slate-700 hover:text-slate-900 touch-manipulation"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          {/* User info banner when signed in */}
          {user && (
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-slate-900 truncate">{user.displayName}</div>
                <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
              </div>
            </div>
          )}

          <nav className="px-4 py-2">
            {NAV.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center py-3.5 px-2 text-[13px] font-semibold tracking-[0.1em] uppercase border-b border-slate-100 last:border-0 ${
                    isActive ? 'text-blue-600' : 'text-slate-700'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="px-5 py-4 border-t border-slate-100">
            {user ? (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                onMouseEnter={hoverPulseIn}
                onMouseLeave={hoverPulseOut}
                className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-3 text-[12px] font-semibold tracking-[0.15em] uppercase rounded-lg"
              >
                Sign In with Google
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
