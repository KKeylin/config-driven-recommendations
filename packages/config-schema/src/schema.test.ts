import { describe, it, expect } from 'vitest';
import { TestimonialConfigSchema } from './schema';

const validConfig = {
  author: {
    name: 'Kostiantyn Keilin',
    title: 'Senior Front-End Engineer',
    linkedinUrl: 'https://linkedin.com/in/kkeilin',
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
  ],
};

describe('TestimonialConfigSchema', () => {
  it('accepts a valid config', () => {
    const result = TestimonialConfigSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  it('rejects missing required author field', () => {
    const invalid = { ...validConfig, author: { title: 'Engineer' } };
    const result = TestimonialConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects invalid endorsement level', () => {
    const invalid = structuredClone(validConfig);
    invalid.testimonials[0]!.weight = { level: 'intern' as never };
    const result = TestimonialConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects linkedin source without url', () => {
    const invalid = structuredClone(validConfig);
    invalid.testimonials[0]!.source = { type: 'linkedin' } as never;
    const result = TestimonialConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('accepts reference-letter source', () => {
    const config = structuredClone(validConfig);
    config.testimonials[0]!.source = { type: 'reference-letter', available: true };
    const result = TestimonialConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('accepts verbal source without contactAvailable', () => {
    const config = structuredClone(validConfig);
    config.testimonials[0]!.source = { type: 'verbal' };
    const result = TestimonialConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });
});