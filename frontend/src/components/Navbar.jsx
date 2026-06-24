import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOutUser } from '../firebase';

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

  const handleSignOut = async () => {
    await signOutUser();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/90 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={LOGO_URL} alt="InternBridge" className="h-12 w-auto object-contain" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 text-[12px] font-semibold tracking-[0.15em] uppercase transition-colors rounded-md ${
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

        {/* Right side — auth */}
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
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2 text-[12px] font-semibold tracking-[0.15em] uppercase rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-900"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-6 py-3 flex flex-col">
            {NAV.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `py-3 text-[12px] font-semibold tracking-[0.18em] uppercase border-b border-slate-100 ${
                    isActive ? 'text-blue-600' : 'text-slate-800'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <div className="py-4">
              {user ? (
                <button
                  onClick={() => { handleSignOut(); setMobileOpen(false); }}
                  className="flex items-center gap-2 text-[12px] font-semibold text-slate-700"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 text-[12px] font-semibold tracking-[0.15em] uppercase rounded-lg"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
