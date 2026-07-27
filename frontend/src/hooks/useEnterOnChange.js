import { useLayoutEffect, useRef } from 'react';
import { enterReveal } from '../lib/motion';

/**
 * Ref-returning hook for a single container that swaps its content in place
 * (e.g. a wizard step). Replays a fade+slide-up every time one of `deps`
 * changes.
 */
export default function useEnterOnChange(deps, opts = {}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    return enterReveal(ref.current, opts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
