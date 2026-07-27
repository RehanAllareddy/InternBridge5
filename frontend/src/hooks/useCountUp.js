import { useEffect, useRef } from 'react';
import { countUpOnScroll } from '../lib/motion';

/**
 * Ref-returning hook: animates the element's text content from 0 to `value`
 * once it scrolls into view. `value` must be a plain number — format the
 * suffix (+, %, etc.) outside the animated element.
 */
export default function useCountUp(value, { duration, formatter } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    return countUpOnScroll(ref.current, value, { duration, formatter });
  }, [value, duration, formatter]);

  return ref;
}
