import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import type { Testimonial } from '@config-driven-testimonials/config-schema';
import { CarouselView } from './CarouselView';

afterEach(cleanup);

const testimonials: Testimonial[] = [
  {
    id: '1',
    author: { name: 'Alice', title: 'Engineer' },
    text: 'First testimonial.',
    relationship: 'Colleague',
    date: '2024-01',
    source: { type: 'linkedin', url: 'https://linkedin.com/in/alice' },
    associatedRole: { company: 'Acme', period: '2022–2024', type: 'employment' },
  },
  {
    id: '2',
    author: { name: 'Bob', title: 'Manager' },
    text: 'Second testimonial.',
    relationship: 'Manager',
    date: '2024-02',
    source: { type: 'verbal' },
    associatedRole: { company: 'Acme', period: '2022–2024', type: 'employment' },
  },
  {
    id: '3',
    author: { name: 'Carol', title: 'Director' },
    text: 'Third testimonial.',
    relationship: 'Director',
    date: '2024-03',
    source: { type: 'verbal' },
    associatedRole: { company: 'Acme', period: '2022–2024', type: 'employment' },
  },
];

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

describe('CarouselView', () => {
  it('renders the carousel region', () => {
    render(<CarouselView testimonials={testimonials} p="t" />);
    expect(screen.getByRole('region', { name: /carousel/i })).toBeDefined();
  });

  it('shows pause button initially', () => {
    render(<CarouselView testimonials={testimonials} p="t" />);
    expect(screen.getByRole('button', { name: /pause carousel/i })).toBeDefined();
  });

  it('shows play button after clicking pause', () => {
    render(<CarouselView testimonials={testimonials} p="t" />);
    const pauseBtn = screen.getByRole('button', { name: /pause carousel/i });
    fireEvent.click(pauseBtn);
    expect(screen.getByRole('button', { name: /play carousel/i })).toBeDefined();
  });

  it('auto-advances to next slide after interval', () => {
    vi.useFakeTimers();
    render(<CarouselView testimonials={testimonials} p="t" interval={1000} />);
    const nav = screen.getByRole('tablist');
    const initialActive = nav.querySelector('[aria-selected="true"]');

    act(() => { vi.advanceTimersByTime(1100); });

    const nextActive = nav.querySelector('[aria-selected="true"]');
    expect(nextActive).not.toBe(initialActive);
    vi.useRealTimers();
  });
});
