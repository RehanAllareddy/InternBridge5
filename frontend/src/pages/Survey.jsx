import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, RefreshCw, Sparkles } from 'lucide-react';
import { INTERNSHIPS, FIELD_TAGS } from '../data/mock';
import useEnterOnChange from '../hooks/useEnterOnChange';
import useStaggerOnChange from '../hooks/useStaggerOnChange';
import { hoverPulseIn, hoverPulseOut } from '../lib/motion';

const GRADES = [
  { id: 'HS', label: 'High School' },
  { id: 'College', label: 'College' },
  { id: 'Any', label: "I'm flexible" },
];

const LOCATION_PREFS = [
  { id: 'Virtual', label: 'Virtual / Remote' },
  { id: 'InPerson', label: 'In-Person' },
  { id: 'Any', label: 'Either works' },
];

const TIMING = [
  { id: 'Rolling', label: 'Rolling / Open Now' },
  { id: 'Deadline', label: 'Fixed Deadline' },
  { id: 'Any', label: 'Any timing' },
];

function scoreInternship(i, prefs) {
  let score = 0;
  if (prefs.interests.length === 0 || prefs.interests.includes(i.field)) score += 3;
  // Grade
  const grade = (i.grade || '').toLowerCase();
  if (prefs.grade === 'HS' && grade.includes('hs')) score += 2;
  else if (prefs.grade === 'College' && grade.includes('college')) score += 2;
  else if (prefs.grade === 'Any') score += 1;
  // Location
  const isVirtual = i.location.toLowerCase().includes('virtual');
  if (prefs.location === 'Virtual' && isVirtual) score += 2;
  else if (prefs.location === 'InPerson' && !isVirtual) score += 2;
  else if (prefs.location === 'Any') score += 1;
  // Timing
  const isRolling = i.deadline.toLowerCase().includes('rolling');
  if (prefs.timing === 'Rolling' && isRolling) score += 1;
  else if (prefs.timing === 'Deadline' && !isRolling) score += 1;
  else if (prefs.timing === 'Any') score += 0.5;
  return score;
}

export default function Survey() {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState([]);
  const [grade, setGrade] = useState('');
  const [location, setLocation] = useState('');
  const [timing, setTiming] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleInterest = (t) => {
    setInterests(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const matches = useMemo(() => {
    if (!submitted) return [];
    const prefs = { interests, grade, location, timing };
    const scored = INTERNSHIPS.map(i => ({ ...i, _score: scoreInternship(i, prefs) }));
    scored.sort((a, b) => b._score - a._score);
    return scored.slice(0, 12);
  }, [submitted, interests, grade, location, timing]);

  const reset = () => {
    setInterests([]); setGrade(''); setLocation(''); setTiming('');
    setSubmitted(false); setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canSubmit = interests.length > 0 && grade && location && timing;

  const stepRef = useEnterOnChange([step, submitted]);
  const matchesRef = useStaggerOnChange([matches], { staggerMs: 55 });

  if (submitted) {
    return (
      <div className="bg-[#f8fafc] text-slate-900">
        <section ref={stepRef} className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
          <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-4 inline-flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-blue-600" /> Your Matches
          </div>
          <h1 className="font-black uppercase tracking-tight leading-[0.9] text-[clamp(40px,7vw,88px)]">
            <span className="block text-slate-900">Personalized</span>
            <span className="block text-blue-600">Opportunities.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-slate-600">Based on your interests, here are the top {matches.length} internships ranked for you.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {interests.map(t => (
              <span key={t} className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">{t}</span>
            ))}
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">{grade === 'Any' ? 'Any grade' : grade}</span>
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">{location === 'InPerson' ? 'In-Person' : location}</span>
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">{timing}</span>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={reset} onMouseEnter={hoverPulseIn} onMouseLeave={hoverPulseOut} className="inline-flex items-center gap-2 border border-slate-300 text-slate-900 px-5 py-2.5 text-[11px] font-semibold tracking-[0.18em] uppercase rounded hover:border-slate-900 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Retake Survey
            </button>
            <Link to="/internships" onMouseEnter={hoverPulseIn} onMouseLeave={hoverPulseOut} className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 text-[11px] font-semibold tracking-[0.18em] uppercase rounded hover:bg-blue-600 transition-colors">
              Browse All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
          <div ref={matchesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {matches.map((i, idx) => (
              <a key={i.id} href={i.url} target="_blank" rel="noreferrer" onMouseEnter={hoverPulseIn} onMouseLeave={hoverPulseOut} className="reveal group rounded-xl border border-slate-200 bg-white p-6 hover:border-blue-500 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="text-[10px] tracking-[0.3em] uppercase font-semibold text-blue-600">{i.field}</div>
                  <div className="flex items-center gap-2">
                    {idx < 3 && (
                      <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Top Match</span>
                    )}
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
                <div className="mt-3 text-lg font-bold text-slate-900 group-hover:text-blue-600">{i.title}</div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>{i.location}</span>
                  <span>{i.deadline}</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 font-mono">Grade: {i.grade}</div>
              </a>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] text-slate-900">
      <section className="max-w-4xl mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div className="text-[10px] tracking-[0.4em] uppercase text-slate-500 mb-4 inline-flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-blue-600" /> Find Your Match
        </div>
        <h1 className="font-black uppercase tracking-tight leading-[0.9] text-[clamp(40px,7vw,88px)]">
          <span className="block text-slate-900">What Are</span>
          <span className="block text-blue-600">You Into?</span>
        </h1>
        <p className="mt-6 text-slate-600 max-w-2xl">Answer a few quick questions and we&apos;ll surface the internships that fit your interests, level, and timing.</p>

        {/* Progress bar */}
        <div className="mt-10 flex items-center gap-2">
          {[1,2,3,4].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>
        <div className="mt-3 text-xs font-mono text-slate-500">Step {step} of 4</div>
      </section>

      <section ref={stepRef} className="max-w-4xl mx-auto px-6 lg:px-10 pb-24">
        {step === 1 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Pick fields that excite you</h2>
            <p className="mt-2 text-slate-600 text-sm">Choose as many as you&apos;d like.</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {FIELD_TAGS.map(t => {
                const active = interests.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleInterest(t)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`}
                  >
                    {active && <Check className="w-3.5 h-3.5 inline -mt-0.5 mr-1.5" />}
                    {t}
                  </button>
                );
              })}
            </div>
            <div className="mt-10 flex justify-end">
              <button
                disabled={interests.length === 0}
                onClick={() => setStep(2)}
                onMouseEnter={hoverPulseIn}
                onMouseLeave={hoverPulseOut}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 text-[12px] font-semibold tracking-[0.18em] uppercase rounded hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">What&apos;s your level?</h2>
            <p className="mt-2 text-slate-600 text-sm">Pick the one that fits you best.</p>
            <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">
              {GRADES.map(g => {
                const active = grade === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setGrade(g.id)}
                    className={`text-left rounded-xl border p-6 transition-all ${active ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-200 bg-white text-slate-900 hover:border-slate-400'}`}
                  >
                    <div className="text-lg font-bold">{g.label}</div>
                    <div className={`mt-1 text-xs ${active ? 'text-blue-200' : 'text-slate-500'}`}>{g.id === 'HS' ? 'Grades 9–12' : g.id === 'College' ? 'Undergrad' : 'Show me everything'}</div>
                  </button>
                );
              })}
            </div>
            <div className="mt-10 flex justify-between">
              <button onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-slate-900">← Back</button>
              <button
                disabled={!grade}
                onClick={() => setStep(3)}
                onMouseEnter={hoverPulseIn}
                onMouseLeave={hoverPulseOut}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 text-[12px] font-semibold tracking-[0.18em] uppercase rounded hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Where do you want to work?</h2>
            <p className="mt-2 text-slate-600 text-sm">Pick your location preference.</p>
            <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">
              {LOCATION_PREFS.map(g => {
                const active = location === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setLocation(g.id)}
                    className={`text-left rounded-xl border p-6 transition-all ${active ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-200 bg-white text-slate-900 hover:border-slate-400'}`}
                  >
                    <div className="text-lg font-bold">{g.label}</div>
                    <div className={`mt-1 text-xs ${active ? 'text-blue-200' : 'text-slate-500'}`}>
                      {g.id === 'Virtual' ? 'Work from anywhere' : g.id === 'InPerson' ? 'On-site programs' : 'Maximum options'}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-10 flex justify-between">
              <button onClick={() => setStep(2)} className="text-sm text-slate-500 hover:text-slate-900">← Back</button>
              <button
                disabled={!location}
                onClick={() => setStep(4)}
                onMouseEnter={hoverPulseIn}
                onMouseLeave={hoverPulseOut}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 text-[12px] font-semibold tracking-[0.18em] uppercase rounded hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">When can you start?</h2>
            <p className="mt-2 text-slate-600 text-sm">Choose your application timing preference.</p>
            <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">
              {TIMING.map(g => {
                const active = timing === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setTiming(g.id)}
                    className={`text-left rounded-xl border p-6 transition-all ${active ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-200 bg-white text-slate-900 hover:border-slate-400'}`}
                  >
                    <div className="text-lg font-bold">{g.label}</div>
                    <div className={`mt-1 text-xs ${active ? 'text-blue-200' : 'text-slate-500'}`}>
                      {g.id === 'Rolling' ? 'Apply anytime' : g.id === 'Deadline' ? 'Plan ahead' : 'No preference'}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-10 flex justify-between items-center">
              <button onClick={() => setStep(3)} className="text-sm text-slate-500 hover:text-slate-900">← Back</button>
              <button
                disabled={!canSubmit}
                onClick={() => { setSubmitted(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onMouseEnter={hoverPulseIn}
                onMouseLeave={hoverPulseOut}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-7 py-3 text-[12px] font-semibold tracking-[0.18em] uppercase rounded hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Show My Matches <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
