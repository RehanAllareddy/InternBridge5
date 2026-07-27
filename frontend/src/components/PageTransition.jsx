import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { animate } from 'animejs';
import { DURATION, EASE } from '../lib/motion';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Crossfades routed page content on navigation. React Router unmounts the
 * old route element the instant the location changes, so there's no real
 * "exit" to animate against — instead we hold the outgoing element on
 * screen just long enough to fade it out, then swap in the new one and
 * fade/slide it up. Scroll resets to top on each route change.
 */
export default function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const containerRef = useRef(null);
  const [displayed, setDisplayed] = useState({ key: location.pathname, node: outlet });

  useEffect(() => {
    if (location.pathname === displayed.key) return;
    const el = containerRef.current;

    if (!el || prefersReducedMotion()) {
      setDisplayed({ key: location.pathname, node: outlet });
      window.scrollTo(0, 0);
      return;
    }

    animate(el, {
      opacity: [1, 0],
      translateY: [0, -8],
      duration: DURATION.fast * 0.6,
      ease: 'inCubic',
      onComplete: () => {
        window.scrollTo(0, 0);
        setDisplayed({ key: location.pathname, node: outlet });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion()) return;
    animate(el, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: DURATION.base,
      ease: EASE.out,
    });
  }, [displayed.key]);

  return <div ref={containerRef}>{displayed.node}</div>;
}
