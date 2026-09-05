import { useLayoutEffect, useRef } from 'react';

const findScrollParent = (element: HTMLElement): HTMLElement | null => {
  let node = element.parentElement;
  while (node) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === 'auto' || overflowY === 'scroll') return node;
    node = node.parentElement;
  }
  return null;
};

/**
 * Makes a sidebar column sticky, but only once all of its content has been
 * scrolled into view. A column shorter than the scroll container pins to the
 * top straight away; a taller one scrolls normally until its bottom edge meets
 * the bottom of the container, then sticks there.
 *
 * The computed offset is exposed on the element as `--sticky-top` so the
 * stylesheet stays in charge of whether (and at which breakpoints) it applies.
 */
export const useStickyUntilEnd = <T extends HTMLElement>(edgeGap = 0) => {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const scrollParent = findScrollParent(element);
    if (!scrollParent) return;

    const update = () => {
      // Positive when the column fits: pin at edgeGap from the top.
      // Negative when it doesn't: let it scroll up until edgeGap remains below.
      const room = scrollParent.clientHeight - element.offsetHeight - edgeGap;
      element.style.setProperty('--sticky-top', `${Math.min(edgeGap, room)}px`);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    observer.observe(scrollParent);

    return () => observer.disconnect();
  }, [edgeGap]);

  return ref;
};
