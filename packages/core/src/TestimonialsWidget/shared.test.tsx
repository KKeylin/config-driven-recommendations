import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import type { Testimonial } from '@config-driven-testimonials/config-schema';
import {
  formatDate,
  resolveSourceUrl,
  formatSourceLabel,
  getInitialsColor,
  levelColors,
  Avatar,
  TestimonialCard,
} from './shared';

afterEach(cleanup);

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------

describe('formatDate', () => {
  it('formats an ISO date string', () => {
    const result = formatDate('2024-03-15');
    expect(result).toContain('2024');
    expect(result).toContain('Mar');
  });

  it('formats a year-month string', () => {
    const result = formatDate('2023-06');
    expect(result).toContain('2023');
  });

  it('returns a non-empty string for valid dates', () => {
    expect(formatDate('2020-01-01').length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// resolveSourceUrl
// ---------------------------------------------------------------------------

const baseTestimonial: Testimonial = {
  id: '1',
  author: { name: 'Alice', title: 'Engineer' },
  text: 'Great work.',
  relationship: 'Colleague',
  date: '2024-01',
  source: { type: 'linkedin', url: 'https://linkedin.com/in/alice' },
  associatedRole: { company: 'Acme', period: '2022–2024', type: 'employment' },
};

describe('resolveSourceUrl', () => {
  it('prefers recommendationUrl over everything', () => {
    const t = { ...baseTestimonial, recommendationUrl: 'https://example.com/rec', author: { ...baseTestimonial.author, linkedinUrl: 'https://linkedin.com/in/alice' } };
    expect(resolveSourceUrl(t)).toBe('https://example.com/rec');
  });

  it('falls back to author.linkedinUrl when no recommendationUrl', () => {
    const t = { ...baseTestimonial, author: { ...baseTestimonial.author, linkedinUrl: 'https://linkedin.com/in/alice' } };
    expect(resolveSourceUrl(t)).toBe('https://linkedin.com/in/alice');
  });

  it('falls back to source.url for linkedin source', () => {
    expect(resolveSourceUrl(baseTestimonial)).toBe('https://linkedin.com/in/alice');
  });

  it('returns undefined for verbal source with no urls', () => {
    const t = { ...baseTestimonial, source: { type: 'verbal' as const } };
    expect(resolveSourceUrl(t)).toBeUndefined();
  });

  it('returns undefined for reference-letter source with no urls', () => {
    const t = { ...baseTestimonial, source: { type: 'reference-letter' as const, available: true as const } };
    expect(resolveSourceUrl(t)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// formatSourceLabel
// ---------------------------------------------------------------------------

describe('formatSourceLabel', () => {
  it('returns short label for linkedin', () => {
    expect(formatSourceLabel({ type: 'linkedin', url: 'https://linkedin.com/in/x' })).toBe('Source of recommendation');
  });

  it('returns reference-letter label', () => {
    expect(formatSourceLabel({ type: 'reference-letter', available: true })).toContain('reference letter');
  });

  it('returns verbal label', () => {
    expect(formatSourceLabel({ type: 'verbal' })).toContain('verbal reference');
  });
});

// ---------------------------------------------------------------------------
// getInitialsColor
// ---------------------------------------------------------------------------

describe('getInitialsColor', () => {
  it('returns a non-empty string for a name', () => {
    expect(getInitialsColor('Jane Smith').length).toBeGreaterThan(0);
  });

  it('returns a non-empty string for an empty name', () => {
    expect(getInitialsColor('').length).toBeGreaterThan(0);
  });

  it('returns a Tailwind class string', () => {
    const result = getInitialsColor('Alice');
    expect(result).toContain('bg-');
    expect(result).toContain('text-');
  });

  it('returns consistent output for the same name', () => {
    expect(getInitialsColor('Bob')).toBe(getInitialsColor('Bob'));
  });

  it('returns different colors for clearly different names', () => {
    const colors = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace'].map(getInitialsColor);
    const unique = new Set(colors);
    expect(unique.size).toBeGreaterThan(1);
  });
});

// ---------------------------------------------------------------------------
// levelColors
// ---------------------------------------------------------------------------

describe('levelColors', () => {
  const levels = ['report', 'mentee', 'colleague', 'lead', 'manager', 'director', 'vp', 'c-level'] as const;

  it.each(levels)('has a color entry for level %s', (level) => {
    expect(levelColors[level]).toBeTruthy();
    expect(levelColors[level]).toContain('bg-');
    expect(levelColors[level]).toContain('text-');
  });

  it('director uses orange-900 for AAA contrast', () => {
    expect(levelColors['director']).toContain('text-orange-900');
  });

  it('manager uses violet-800', () => {
    expect(levelColors['manager']).toContain('text-violet-800');
  });
});

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

describe('Avatar', () => {
  it('renders an img when avatarUrl is provided', () => {
    render(<Avatar name="Jane Smith" avatarUrl="https://example.com/photo.jpg" p="t" />);
    const img = screen.getByRole('img');
    expect(img).toBeDefined();
    expect(img.getAttribute('src')).toBe('https://example.com/photo.jpg');
    expect(img.getAttribute('alt')).toBe('Profile photo of Jane Smith');
  });

  it('renders initials when no avatarUrl', () => {
    render(<Avatar name="Jane Smith" p="t" />);
    expect(screen.getByText('JS')).toBeDefined();
  });

  it('renders ? initials when no name and no avatarUrl', () => {
    render(<Avatar p="t" />);
    expect(screen.getByText('?')).toBeDefined();
  });

  it('uses generic alt text when no name but avatarUrl provided', () => {
    render(<Avatar avatarUrl="https://example.com/photo.jpg" p="t" />);
    expect(screen.getByRole('img').getAttribute('alt')).toBe('Profile photo');
  });

  it('applies classPrefix to avatar class', () => {
    const { container } = render(<Avatar name="Alice" p="my" />);
    expect(container.querySelector('.my-avatar')).toBeTruthy();
  });

  it('slices initials to 2 characters', () => {
    render(<Avatar name="Anne-Marie Dupont" p="t" />);
    expect(screen.getByText('AD')).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// TestimonialCard
// ---------------------------------------------------------------------------

const testimonial: Testimonial = {
  id: '1',
  author: { name: 'Jane Smith', title: 'Engineering Manager' },
  text: 'Exceptional work on the project.',
  relationship: 'Managed at Acme',
  date: '2024-03-01',
  source: { type: 'linkedin', url: 'https://linkedin.com/in/janesmith' },
  associatedRole: { company: 'Acme', period: '2022–2024', type: 'employment' },
};

describe('TestimonialCard', () => {
  it('renders testimonial text', () => {
    render(<TestimonialCard testimonial={testimonial} p="t" />);
    expect(screen.getByText(/Exceptional work on the project\./)).toBeDefined();
  });

  it('renders author name', () => {
    render(<TestimonialCard testimonial={testimonial} p="t" />);
    expect(screen.getByText('Jane Smith')).toBeDefined();
  });

  it('renders author title', () => {
    render(<TestimonialCard testimonial={testimonial} p="t" />);
    expect(screen.getByText('Engineering Manager')).toBeDefined();
  });

  it('renders source link with aria-label when sourceUrl exists', () => {
    render(<TestimonialCard testimonial={testimonial} p="t" />);
    const link = screen.getByRole('link', { name: /LinkedIn recommendation from Jane Smith/ });
    expect(link).toBeDefined();
  });

  it('renders source label as text for verbal source', () => {
    const t = { ...testimonial, source: { type: 'verbal' as const }, author: { name: 'Bob' } };
    render(<TestimonialCard testimonial={t} p="t" />);
    expect(screen.getByText(/verbal reference/)).toBeDefined();
  });

  it('renders badge for weight', () => {
    const t = { ...testimonial, weight: { level: 'manager' as const } };
    render(<TestimonialCard testimonial={t} p="t" />);
    expect(screen.getByText('Manager')).toBeDefined();
  });

  it('renders badge with years experience', () => {
    const t = { ...testimonial, weight: { level: 'lead' as const, yearsExperience: 5 } };
    render(<TestimonialCard testimonial={t} p="t" />);
    expect(screen.getByText('5 yrs exp')).toBeDefined();
  });

  it('renders LinkedIn link for author when linkedinUrl provided', () => {
    const t = { ...testimonial, author: { ...testimonial.author, linkedinUrl: 'https://linkedin.com/in/jane' } };
    render(<TestimonialCard testimonial={t} p="t" />);
    const links = screen.getAllByRole('link', { name: /Jane Smith/ });
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders currentRole when present', () => {
    const t = { ...testimonial, author: { ...testimonial.author, currentRole: { title: 'VP Eng', company: 'BigCo' } } };
    render(<TestimonialCard testimonial={t} p="t" />);
    expect(screen.getByText(/VP Eng at BigCo/)).toBeDefined();
  });

  it('applies active ring class when active=true', () => {
    const { container } = render(<TestimonialCard testimonial={testimonial} p="t" active />);
    const card = container.querySelector('[data-testid="testimonial-card"]');
    expect(card?.className).toContain('ring-blue-200');
  });

  it('does not apply active ring when active=false', () => {
    const { container } = render(<TestimonialCard testimonial={testimonial} p="t" active={false} />);
    const card = container.querySelector('[data-testid="testimonial-card"]');
    expect(card?.className).not.toContain('ring-blue-200');
  });

  it('applies classPrefix to card class', () => {
    const { container } = render(<TestimonialCard testimonial={testimonial} p="my" />);
    expect(container.querySelector('.my-card')).toBeTruthy();
  });

  it('renders fade gradient overlay when collapsed=true', () => {
    const { container } = render(<TestimonialCard testimonial={testimonial} p="t" collapsed={true} />);
    const gradient = container.querySelector('.bg-gradient-to-t');
    expect(gradient).toBeTruthy();
  });

  it('renders fade gradient overlay when collapsed=false', () => {
    const { container } = render(<TestimonialCard testimonial={testimonial} p="t" collapsed={false} />);
    const gradient = container.querySelector('.bg-gradient-to-t');
    expect(gradient).toBeTruthy();
  });

  it('applies maxHeight style when collapsed=true', () => {
    const { container } = render(<TestimonialCard testimonial={testimonial} p="t" collapsed={true} />);
    const wrapper = container.querySelector('.relative.overflow-hidden') as HTMLElement;
    expect(wrapper?.style.maxHeight).toBe('5.25rem');
  });

  it('does not apply transition style when collapsed is undefined', () => {
    const { container } = render(<TestimonialCard testimonial={testimonial} p="t" />);
    const wrapper = container.querySelector('.relative.overflow-hidden') as HTMLElement;
    expect(wrapper?.style.transition).toBeFalsy();
  });
});