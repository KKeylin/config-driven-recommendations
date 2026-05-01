import { describe, it, expect } from 'vitest';
import { parseConfig } from './parseConfig';

const validConfig = {
  author: { name: 'Jane', title: 'Engineer' },
  testimonials: [
    {
      id: '1',
      author: { name: 'Bob', title: 'Manager' },
      text: 'Great work.',
      relationship: 'Managed Jane',
      date: '2024-01',
      source: { type: 'linkedin', url: 'https://linkedin.com/in/bob' },
      associatedRole: { company: 'Acme', period: '2022–2024', type: 'employment' },
    },
  ],
};

describe('parseConfig', () => {
  it('returns a typed config for valid input', () => {
    const config = parseConfig(validConfig);
    expect(config.author.name).toBe('Jane');
    expect(config.testimonials).toHaveLength(1);
  });

  it('throws for invalid input with a descriptive message', () => {
    expect(() => parseConfig({ author: {}, testimonials: [{ id: '1' }] })).toThrow('Invalid testimonials config');
  });

  it('throws and lists field paths in the error message', () => {
    const invalid = { author: {}, testimonials: [{ id: '1', text: '', relationship: '', date: '2024', source: { type: 'linkedin' }, associatedRole: { company: 'X', period: 'Y', type: 'employment' } }] };
    let message = '';
    try { parseConfig(invalid); } catch (e) { message = (e as Error).message; }
    expect(message).toContain('•');
  });

  it('throws for completely wrong input', () => {
    expect(() => parseConfig(null)).toThrow();
    expect(() => parseConfig('string')).toThrow();
    expect(() => parseConfig(42)).toThrow();
  });

  it('accepts config with optional theme', () => {
    const config = parseConfig({ ...validConfig, theme: { variant: 'carousel', colorScheme: 'dark' } });
    expect(config.theme?.variant).toBe('carousel');
  });
});