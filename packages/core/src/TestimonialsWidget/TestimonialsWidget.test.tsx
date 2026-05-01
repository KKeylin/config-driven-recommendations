import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);
import type { TestimonialConfig } from '@config-driven-testimonials/config-schema';
import { TestimonialsWidget } from './index';

const config: TestimonialConfig = {
  author: {
    name: 'Kostiantyn Keilin',
    title: 'Senior Front-End Engineer',
  },
  testimonials: [
    {
      id: '1',
      author: {
        name: 'Jane Smith',
        title: 'Engineering Manager',
      },
      text: 'Kostya is an exceptional engineer.',
      relationship: 'Managed Kostya at RBC',
      date: '2024-01',
      source: { type: 'linkedin', url: 'https://linkedin.com/in/janesmith' },
      associatedRole: {
        company: 'RBC',
        period: '2021–2024',
        type: 'employment',
      },
      weight: { level: 'manager' },
    },
    {
      id: '2',
      author: {
        name: 'John Doe',
        title: 'Senior Engineer',
      },
      text: 'A pleasure to work with.',
      relationship: 'Worked alongside Kostya',
      date: '2023-06',
      source: { type: 'reference-letter', available: true },
      associatedRole: {
        company: 'RBC',
        period: '2021–2024',
        type: 'employment',
      },
    },
  ],
};

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

describe('TestimonialsWidget', () => {
  it('renders the widget', () => {
    render(<TestimonialsWidget config={config} />);
    expect(screen.getByTestId('testimonials-widget')).toBeDefined();
  });

  it('renders author name and title', () => {
    render(<TestimonialsWidget config={config} />);
    expect(screen.getByText('Kostiantyn Keilin')).toBeDefined();
    expect(screen.getByText('Senior Front-End Engineer')).toBeDefined();
  });

  it('renders all testimonial cards', () => {
    render(<TestimonialsWidget config={config} />);
    expect(screen.getAllByTestId('testimonial-card')).toHaveLength(2);
  });

  it('renders testimonial text', () => {
    render(<TestimonialsWidget config={config} />);
    expect(screen.getByText(/Kostya is an exceptional engineer\./)).toBeDefined();
  });

  it('renders reference-letter source label', () => {
    render(<TestimonialsWidget config={config} />);
    expect(screen.getByText('Source of recommendation: reference letter available upon request')).toBeDefined();
  });

  it('renders author summary when provided', () => {
    const c = { ...config, author: { ...config.author, summary: 'A short bio.' } };
    render(<TestimonialsWidget config={c} />);
    expect(screen.getByText('A short bio.')).toBeDefined();
  });

  it('renders LinkedIn link when author.linkedinUrl provided', () => {
    const c = { ...config, author: { ...config.author, linkedinUrl: 'https://linkedin.com/in/test' } };
    render(<TestimonialsWidget config={c} />);
    expect(screen.getByText('LinkedIn ↗')).toBeDefined();
  });

  it('renders custom links when author.links provided', () => {
    const c = { ...config, author: { ...config.author, links: [{ label: 'GitHub', url: 'https://github.com/test' }] } };
    render(<TestimonialsWidget config={c} />);
    expect(screen.getByText('GitHub ↗')).toBeDefined();
  });

  it('hides header when showHeader is false', () => {
    const c = { ...config, theme: { showHeader: false } };
    render(<TestimonialsWidget config={c} />);
    expect(screen.queryByText('Kostiantyn Keilin')).toBeNull();
  });

  it('applies dark colorScheme class', () => {
    const c = { ...config, theme: { colorScheme: 'dark' as const } };
    const { container } = render(<TestimonialsWidget config={c} />);
    expect(container.querySelector('.dark')).toBeTruthy();
  });

  it('applies light colorScheme class', () => {
    const c = { ...config, theme: { colorScheme: 'light' as const } };
    const { container } = render(<TestimonialsWidget config={c} />);
    expect(container.querySelector('.light')).toBeTruthy();
  });

  it('applies accentColor as CSS variable', () => {
    const c = { ...config, theme: { accentColor: '#ff0000' } };
    const { container } = render(<TestimonialsWidget config={c} />);
    const widget = container.querySelector('[data-testid="testimonials-widget"]') as HTMLElement;
    expect(widget?.style.getPropertyValue('--accent')).toBe('#ff0000');
  });

  it('applies backgroundColor style', () => {
    const c = { ...config, theme: { backgroundColor: '#f0f0f0' } };
    const { container } = render(<TestimonialsWidget config={c} />);
    const widget = container.querySelector('[data-testid="testimonials-widget"]') as HTMLElement;
    expect(widget?.style.backgroundColor).toBeTruthy();
  });

  it('renders carousel variant', () => {
    const c = { ...config, theme: { variant: 'carousel' as const } };
    const { container } = render(<TestimonialsWidget config={c} />);
    expect(container.querySelector('[role="region"]')).toBeTruthy();
  });

  it('uses custom classPrefix', () => {
    const { container } = render(<TestimonialsWidget config={config} classPrefix="x" />);
    expect(container.querySelector('.x-widget')).toBeTruthy();
  });
});