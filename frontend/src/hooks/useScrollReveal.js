import { useEffect, useRef } from 'react';
import { revealOnScroll } from '../lib/motion';

/**
 * Ref-returning hook: attach to any element to fade+slide it in via anime.js
 * once it scrolls into view. Pair with the `reveal` CSS class (opacity: 0
 * by default) to avoid a flash-of-visible-content before the observer fires.
 */
export default function useScrollReveal({ delay = 0, distance = 24 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    return revealOnScroll(ref.current, { delay, distance });
  }, [delay, distance]);

  return ref;
}
