import { describe, it, expect, afterEach } from 'vitest';
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
      },
    },
  ],
};

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
    expect(screen.getByText('Kostya is an exceptional engineer.')).toBeDefined();
  });

  it('renders reference-letter source label', () => {
    render(<TestimonialsWidget config={config} />);
    expect(screen.getByText('Reference letter available upon request')).toBeDefined();
  });
});