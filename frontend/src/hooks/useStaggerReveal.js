import { useEffect, useRef } from 'react';
import { revealStaggerOnScroll } from '../lib/motion';

/**
 * Ref-returning hook for a container of cards/list items: fades+slides each
 * direct child in with a stagger once the container scrolls into view.
 * Children should carry the `reveal` CSS class (opacity: 0 by default).
 */
export default function useStaggerReveal({ staggerMs = 70, distance = 22 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    return revealStaggerOnScroll(ref.current, { staggerMs, distance });
  }, [staggerMs, distance]);

  return ref;
}
