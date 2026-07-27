import { useLayoutEffect, useRef } from 'react';
import { staggerReveal } from '../lib/motion';

/**
 * Ref-returning hook for a container whose children get replaced in place
 * (e.g. a filtered card grid). Re-plays the fade+slide-up stagger every time
 * one of `deps` changes, rather than once on scroll-into-view. Children
 * should carry the `reveal` CSS class (opacity: 0 by default) so there's no
 * flash of fully-visible content before the animation starts.
 */
export default function useStaggerOnChange(deps, { staggerMs = 60, distance = 16 } = {}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    return staggerReveal(ref.current, { staggerMs, distance });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
