import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Users } from 'lucide-react';
import { signInWithGoogle } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { STATS } from '../data/mock';
import useScrollReveal from '../hooks/useScrollReveal';
import { hoverPulseIn, hoverPulseOut } from '../lib/motion';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_bridge-internships/artifacts/s66q0dn8_768da46f-eeb4-4784-a15e-97681d97e863.png';

const PREVIEW_CARDS = [
  { field: 'CS', title: 'Google CSSI', location: 'U.S. / Virtual', deadline: 'Mar' },
  { field: 'STEM', title: 'NASA Internship', location: 'U.S.', deadline: 'Mar' },
  { field: 'Medicine', title: 'Harvard SRMP', location: 'MA', deadline: 'Jan' },
  { field: 'AI', title: 'AI Scholars Live', location: 'Virtual', deadline: 'Rolling' },
  { field: 'Finance', title: 'Goldman Sachs Insight', location: 'U.S.', deadline: 'Jan' },
  { field: 'Engineering', title: 'MIT Beaver Works', location: 'MA', deadline: 'Feb' },
];

const FIELD_COLORS = {
  CS: 'bg-violet-50 text-violet-700',
  STEM: 'bg-blue-50 text-blue-700',
  Medicine: 'bg-rose-50 text-rose-700',
  AI: 'bg-emerald-50 text-emerald-700',
  Finance: 'bg-amber-50 text-amber-700',
  Engineering: 'bg-sky-50 text-sky-700',
};

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/internships';
  const leftPanelRef = useScrollReveal({ distance: 12 });
  const rightPanelRef = useScrollReveal({ delay: 90, distance: 12 });

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Sign-in failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Left panel — branding */}
      <div ref={leftPanelRef} className="reveal hidden lg:flex lg:w-1/2 bg-slate-950 flex-col justify-between p-14">
        <div>
          <div className="bg-white rounded-lg p-2 inline-flex">
            <img src={LOGO_URL} alt="InternBridge" className="h-10 w-auto object-contain" />
          </div>
        </div>

        <div>
          <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-5">Members-Only Access</div>
          <h2 className="font-black text-white leading-[0.95] tracking-tight text-5xl xl:text-6xl">
            The internship<br />
            database built<br />
            for <span className="text-blue-400">students.</span>
          </h2>
          <p className="mt-6 text-slate-400 text-[15px] leading-relaxed max-w-md">
            Over {STATS.opportunities} curated opportunities across {STATS.fields}+ fields — STEM, medicine, business, arts, law, and beyond. Verified, organized, and always up to date.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-5">
            {[
              { Icon: Zap, label: `${STATS.opportunities}+`, sub: 'Opportunities' },
              { Icon: Users, label: '2,500+', sub: 'Post Impressions' },
              { Icon: Shield, label: '100%', sub: 'Free Access' },
            ].map(({ Icon, label, sub }, i) => (
              <div key={i} className="border border-slate-800 rounded-xl p-4">
                <Icon className="w-4 h-4 text-blue-400 mb-3" />
                <div className="text-2xl font-black text-white">{label}</div>
                <div className="mt-1 text-[10px] tracking-[0.3em] uppercase text-slate-500">{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Blurred preview cards */}
        <div>
          <div className="text-[10px] tracking-[0.4em] uppercase text-slate-600 mb-4">Preview</div>
          <div className="grid grid-cols-2 gap-2 relative">
            {PREVIEW_CARDS.slice(0, 4).map((c, i) => (
              <div key={i} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                <span className={`text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${FIELD_COLORS[c.field] || 'bg-slate-800 text-slate-300'}`}>
                  {c.field}
                </span>
                <div className="mt-2 text-[13px] font-semibold text-white leading-snug">{c.title}</div>
                <div className="mt-1 text-[11px] text-slate-500">{c.location} · {c.deadline}</div>
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent rounded-lg" />
          </div>
          <div className="mt-2 text-[11px] text-slate-600 text-center">
            Sign in to unlock all {STATS.opportunities}+ listings →
          </div>
        </div>
      </div>

      {/* Right panel — sign in */}
      <div ref={rightPanelRef} className="reveal flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <img src={LOGO_URL} alt="InternBridge" className="h-12 w-auto object-contain" />
        </div>

        <div className="w-full max-w-sm">
          <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-4">Get Started</div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Access InternBridge
          </h1>
          <p className="mt-3 text-slate-600 text-[15px] leading-relaxed">
            Sign in with Google to unlock the full database of internship opportunities — free, fast, and secure.
          </p>

          <div className="mt-10">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              onMouseEnter={hoverPulseIn}
              onMouseLeave={hoverPulseOut}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-900 font-semibold text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-slate-400 border-t-slate-900 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              {loading ? 'Signing in…' : 'Continue with Google'}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
          )}

          <div className="mt-8 border-t border-slate-100 pt-8">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              {[
                { v: `${STATS.opportunities}+`, l: 'Listings' },
                { v: `${STATS.fields}+`, l: 'Fields' },
                { v: 'HS+', l: 'Grade Levels' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-lg sm:text-xl font-black text-slate-900">{s.v}</div>
                  <div className="mt-0.5 text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-slate-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-8 text-xs text-slate-400 text-center leading-relaxed">
            By continuing, you agree to InternBridge's terms. We only request your basic Google profile info and never post on your behalf.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}
