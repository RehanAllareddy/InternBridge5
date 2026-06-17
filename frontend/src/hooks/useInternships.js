import { useEffect, useState } from 'react';
import { fetchInternships, fetchStats } from '../lib/api';
import { INTERNSHIPS as FALLBACK } from '../data/mock';

let _cache = null;
let _statsCache = null;

export function useInternships() {
  const [data, setData] = useState(_cache || FALLBACK);
  const [loading, setLoading] = useState(!_cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchInternships();
        if (!mounted) return;
        if (Array.isArray(res) && res.length > 0) {
          _cache = res;
          setData(res);
        }
      } catch (e) {
        if (!mounted) return;
        setError(e);
        // keep fallback mock
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { data, loading, error };
}

export function useStats() {
  const [stats, setStats] = useState(_statsCache);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchStats();
        if (!mounted) return;
        _statsCache = res;
        setStats(res);
      } catch (_) {
        // silent
      }
    })();
    return () => { mounted = false; };
  }, []);
  return stats;
}
