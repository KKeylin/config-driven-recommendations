'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Testimonial } from '@config-driven-testimonials/config-schema';
import { TestimonialCard } from './shared';

const SLIDE_MS = 500;

function getOffset(index: number, active: number, total: number): number {
  let offset = (index - active + total) % total;
  if (offset > total / 2) offset -= total;
  return offset;
}

function getCardStyle(offset: number): React.CSSProperties {
  const abs = Math.abs(offset);
  const transition = `transform ${SLIDE_MS}ms ease-in-out, opacity ${SLIDE_MS}ms ease-in-out`;

  if (abs > 2) {
    return { position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none', zIndex: 0 };
  }

  const sign = offset >= 0 ? 1 : -1;
  const configs = [
    { translateX: 0,          scale: 1,    opacity: 1,   zIndex: 10, interactive: true  },
    { translateX: sign * 72,  scale: 0.85, opacity: 0.5, zIndex: 5,  interactive: false },
    { translateX: sign * 130, scale: 0.72, opacity: 0.2, zIndex: 1,  interactive: false },
  ];

  const cfg = configs[abs]!;
  return {
    position: 'absolute',
    inset: 0,
    transform: `translateX(${cfg.translateX}%) scale(${cfg.scale})`,
    opacity: cfg.opacity,
    zIndex: cfg.zIndex,
    pointerEvents: cfg.interactive ? 'auto' : 'none',
    transition,
  };
}

export function CarouselView({ testimonials, p, interval = 5000 }: {
  testimonials: Testimonial[];
  p: string;
  interval?: number | undefined;
}): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isActiveHovered, setIsActiveHovered] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const isPaused = useRef(false);
  const isAnimating = useRef(false);
  const isVisible = useRef(true);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = testimonials.length;

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover)').matches);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible.current = entry?.isIntersecting ?? false; },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsActiveHovered(false);
  }, [activeIndex]);

  const advance = useCallback((to: number) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setActiveIndex(to);
    setTimeout(() => { isAnimating.current = false; }, SLIDE_MS);
  }, []);

  const goTo = useCallback((index: number) => {
    if (index !== activeIndex) advance(index);
  }, [activeIndex, advance]);

  function handleTouchStart(e: React.TouchEvent): void {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(e: React.TouchEvent): void {
    if (touchStartX.current === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return;
    advance(delta < 0 ? (activeIndex + 1) % total : (activeIndex - 1 + total) % total);
  }

  function togglePause(): void {
    const next = !isUserPaused;
    setIsUserPaused(next);
    isPaused.current = next;
  }

  useEffect(() => {
    const id = setInterval(() => {
      if (!isPaused.current && !isAnimating.current && isVisible.current) {
        advance((activeIndex + 1) % total);
      }
    }, interval);
    return () => clearInterval(id);
  }, [activeIndex, advance, interval, total]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Testimonials carousel"
      className={`${p}-carousel pb-4`}
      onMouseEnter={() => { if (!isUserPaused) isPaused.current = true; }}
      onMouseLeave={() => { if (!isUserPaused) isPaused.current = false; }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative overflow-x-clip">
        {/* Height anchor — tracks hover/device state so navigation stays below expanded content */}
        <div style={{ visibility: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
          <TestimonialCard testimonial={testimonials[activeIndex]!} p={p} collapsed={canHover ? !isActiveHovered : false} />
        </div>

        <div aria-live="polite" className="sr-only">
          {testimonials[activeIndex]?.author.name}: {testimonials[activeIndex]?.text}
        </div>

        <ul className="list-none p-0 m-0">
          {testimonials.map((testimonial, index) => {
            const offset = getOffset(index, activeIndex, total);
            const isActive = offset === 0;
            return (
              <li
                key={testimonial.id}
                data-testimonial-id={testimonial.id}
                style={getCardStyle(offset)}
                aria-hidden={!isActive}
                aria-current={isActive ? 'true' : undefined}
                onMouseEnter={isActive ? () => setIsActiveHovered(true) : undefined}
                onMouseLeave={isActive ? () => setIsActiveHovered(false) : undefined}
              >
                <TestimonialCard
                  testimonial={testimonial}
                  p={p}
                  collapsed={canHover ? (!isActive || !isActiveHovered) : !isActive}
                />
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <div role="tablist" aria-label="Testimonials navigation" className="flex items-center gap-2">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Slide ${index + 1} of ${total}: ${testimonial.author.name}`}
              onClick={() => goTo(index)}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                index === activeIndex
                  ? 'w-6 bg-blue-500 dark:bg-blue-400'
                  : 'w-2 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-600 dark:hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={togglePause}
          aria-label={isUserPaused ? 'Play carousel' : 'Pause carousel'}
          aria-pressed={isUserPaused}
          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
        >
          {isUserPaused ? (
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3" aria-hidden="true">
              <path d="M3 2l10 6-10 6V2z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3" aria-hidden="true">
              <rect x="3" y="2" width="4" height="12" />
              <rect x="9" y="2" width="4" height="12" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
