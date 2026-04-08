function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getScrollContainer(el: HTMLElement): HTMLElement | null {
  let parent = el.parentElement;
  while (parent) {
    const { overflow, overflowY } = window.getComputedStyle(parent);
    if (/auto|scroll/.test(overflow + overflowY)) return parent;
    parent = parent.parentElement;
  }
  return null;
}

export function smoothScrollToElement(target: HTMLElement, duration = 700, offset = 24): void {
  const container = getScrollContainer(target);
  if (!container) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const c = container; // capture non-null reference for closure
  const containerRect = c.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const start = c.scrollTop;
  const end = start + (targetRect.top - containerRect.top) - offset;
  const startTime = performance.now();

  function tick(now: number): void {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    c.scrollTop = start + (end - start) * easeInOutCubic(progress);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
