import { animate, stagger, onScroll } from 'animejs';

// Central timing/easing so every animation on the site feels like one system.
export const DURATION = {
  fast: 300,
  base: 420,
  slow: 600,
};

export const EASE = {
  out: 'outCubic',
  inOut: 'inOutCubic',
  bounce: 'outElastic(1, .6)',
};

const noop = () => {};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Fade + slide-up reveal for a single element, triggered once as it enters
 * the viewport. Returns a cleanup function — callers MUST invoke it on
 * unmount (React StrictMode double-invokes effects in dev, and leaving the
 * previous animation + ScrollObserver alive causes two competing instances
 * to fight over the same element, leaving it stuck invisible).
 */
export function revealOnScroll(el, { delay = 0, distance = 24 } = {}) {
  if (!el) return noop;
  if (prefersReducedMotion()) {
    el.style.opacity = 1;
    el.style.transform = 'none';
    return noop;
  }
  const observer = onScroll({ target: el, enter: 'bottom-=10% top', repeat: false });
  const animation = animate(el, {
    opacity: [0, 1],
    translateY: [distance, 0],
    duration: DURATION.slow,
    delay,
    ease: EASE.out,
    autoplay: observer,
  });
  return () => { animation.revert(); observer.revert(); };
}

/** Fade + slide-up reveal for a group of children, staggered, triggered once the container enters the viewport. */
export function revealStaggerOnScroll(container, { staggerMs = 70, distance = 22 } = {}) {
  if (!container) return noop;
  const children = Array.from(container.children);
  if (!children.length) return noop;
  if (prefersReducedMotion()) {
    children.forEach((c) => { c.style.opacity = 1; c.style.transform = 'none'; });
    return noop;
  }
  const observer = onScroll({ target: container, enter: 'bottom-=10% top', repeat: false });
  const animation = animate(children, {
    opacity: [0, 1],
    translateY: [distance, 0],
    duration: DURATION.slow,
    delay: stagger(staggerMs),
    ease: EASE.out,
    autoplay: observer,
  });
  return () => { animation.revert(); observer.revert(); };
}

/**
 * Fade + slide-up stagger that plays immediately (no scroll gating) — for
 * content that replaces itself in place, like a filtered card grid, where
 * the container is already on screen and re-plays on every content change.
 */
export function staggerReveal(container, { staggerMs = 60, distance = 16, duration = DURATION.base } = {}) {
  if (!container) return noop;
  const children = Array.from(container.children);
  if (!children.length) return noop;
  if (prefersReducedMotion()) {
    children.forEach((c) => { c.style.opacity = 1; c.style.transform = 'none'; });
    return noop;
  }
  const animation = animate(children, {
    opacity: [0, 1],
    translateY: [distance, 0],
    duration,
    delay: stagger(staggerMs),
    ease: EASE.out,
  });
  return () => animation.revert();
}

/** Fade + slight slide-up, replays every time it's called — for step-by-step wizards swapping content in place. */
export function enterReveal(el, { distance = 16, duration = DURATION.base } = {}) {
  if (!el) return noop;
  if (prefersReducedMotion()) {
    el.style.opacity = 1;
    el.style.transform = 'none';
    return noop;
  }
  const animation = animate(el, {
    opacity: [0, 1],
    translateY: [distance, 0],
    duration,
    ease: EASE.out,
  });
  return () => animation.revert();
}

/** Animate a number from 0 to `value`, writing the rounded result into el.textContent. */
export function countUpOnScroll(el, value, { duration = DURATION.slow * 1.4, formatter } = {}) {
  if (!el || typeof value !== 'number') return noop;
  const fmt = formatter || ((n) => Math.round(n).toLocaleString());
  if (prefersReducedMotion()) {
    el.textContent = fmt(value);
    return noop;
  }
  const state = { value: 0 };
  const observer = onScroll({ target: el, enter: 'bottom-=10% top', repeat: false });
  const animation = animate(state, {
    value,
    duration,
    ease: 'outExpo',
    onUpdate: () => { el.textContent = fmt(state.value); },
    autoplay: observer,
  });
  return () => { animation.revert(); observer.revert(); };
}

/** Subtle scale pop for button hover — pairs with existing Tailwind color/shadow transitions. */
export function hoverPulseIn(e) {
  if (prefersReducedMotion()) return;
  animate(e.currentTarget, { scale: 1.045, duration: DURATION.fast, ease: EASE.out });
}

export function hoverPulseOut(e) {
  if (prefersReducedMotion()) return;
  animate(e.currentTarget, { scale: 1, duration: DURATION.base, ease: EASE.bounce });
}
