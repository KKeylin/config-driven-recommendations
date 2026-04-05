import { z } from 'zod';

export const PersonSchema = z.object({
  name: z.string(),
  title: z.string(),
  avatarUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  currentRole: z.object({
    title: z.string(),
    company: z.string(),
  }).optional(),
});

export const EndorsementWeightSchema = z.object({
  level: z.enum(['report', 'mentee', 'peer', 'lead', 'manager', 'director', 'vp', 'c-level']),
  yearsExperience: z.number().int().nonnegative().optional(),
});

export const TestimonialSourceSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('linkedin'), url: z.string().url() }),
  z.object({ type: z.literal('reference-letter'), available: z.literal(true) }),
  z.object({ type: z.literal('verbal'), contactAvailable: z.boolean().optional() }),
]);

export const TestimonialSchema = z.object({
  id: z.string(),
  author: PersonSchema,
  text: z.string(),
  relationship: z.string(),
  date: z.string(),
  source: TestimonialSourceSchema,
  associatedRole: z.object({
    company: z.string(),
    period: z.string(),
  }),
  weight: EndorsementWeightSchema.optional(),
});

export const ThemeConfigSchema = z.object({
  variant: z.enum(['cards', 'timeline', 'masonry']),
  colorScheme: z.enum(['light', 'dark', 'auto']).optional(),
  accentColor: z.string().optional(),
});

export const TestimonialConfigSchema = z.object({
  author: PersonSchema,
  testimonials: z.array(TestimonialSchema),
  theme: ThemeConfigSchema.optional(),
});