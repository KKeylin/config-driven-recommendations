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
  const isPaused = useRef(false);
  const isAnimating = useRef(false);

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

  useEffect(() => {
    const id = setInterval(() => {
      if (!isPaused.current && !isAnimating.current) {
        advance((activeIndex + 1) % testimonials.length);
      }
    }, interval);
    return () => clearInterval(id);
  }, [activeIndex, advance, interval, testimonials.length]);

  return (
    <div
      className={`${p}-carousel`}
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      <div className="relative overflow-x-clip">
        {/* Height anchor — always collapsed to lock container height */}
        <div style={{ visibility: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
          <TestimonialCard testimonial={testimonials[activeIndex]!} p={p} collapsed={true} />
        </div>

        <div aria-live="polite" className="sr-only">
          {testimonials[activeIndex]?.author.name}: {testimonials[activeIndex]?.text}
        </div>

        {testimonials.map((testimonial, index) => {
          const offset = getOffset(index, activeIndex, testimonials.length);
          const isActive = offset === 0;
          return (
            <div
              key={testimonial.id}
              data-testimonial-id={testimonial.id}
              style={getCardStyle(offset)}
              aria-hidden={index !== activeIndex}
              onMouseEnter={isActive ? () => setIsActiveHovered(true) : undefined}
              onMouseLeave={isActive ? () => setIsActiveHovered(false) : undefined}
            >
              <TestimonialCard
                testimonial={testimonial}
                p={p}
                collapsed={!isActive || !isActiveHovered}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Testimonials navigation">
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.id}
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to testimonial by ${testimonial.author.name}`}
            onClick={() => goTo(index)}
            className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
              index === activeIndex
                ? 'w-6 bg-blue-500 dark:bg-blue-400'
                : 'w-2 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-600 dark:hover:bg-zinc-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
