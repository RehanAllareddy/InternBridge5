import { useEffect, useRef, useState } from 'react';

const DEFAULTS = { threshold: 0.08, rootMargin: '0px 0px -48px 0px' };

/**
 * Returns [ref, visible].
 * Pass the ref to any element; `visible` flips true once and stays true.
 * Uses IntersectionObserver — no scroll listeners, GPU-friendly.
 */
export default function useInView(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { ...DEFAULTS, ...options }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return [ref, visible];
}
