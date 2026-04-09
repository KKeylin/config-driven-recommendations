import { z } from 'zod';

export const PersonSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
  avatarUrl: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  links: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
  currentRole: z.object({
    title: z.string(),
    company: z.string(),
  }).optional(),
});

export const EndorsementWeightSchema = z.object({
  level: z.enum(['report', 'mentee', 'colleague', 'lead', 'manager', 'director', 'vp', 'c-level']),
  yearsExperience: z.number().int().nonnegative().optional(),
});

export const TestimonialSourceSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('linkedin'), url: z.string().url() }),
  z.object({ type: z.literal('reference-letter'), available: z.literal(true) }),
  z.object({ type: z.literal('verbal'), contactAvailable: z.boolean().optional() }),
]);

export const AssociatedRoleTypeSchema = z.enum(['employment', 'contract', 'education', 'side-project']);

export const TestimonialSchema = z.object({
  id: z.string(),
  author: PersonSchema,
  text: z.string(),
  relationship: z.string(),
  date: z.string(),
  source: TestimonialSourceSchema,
  recommendationUrl: z.string().url().optional(),
  associatedRole: z.object({
    company: z.string(),
    period: z.string(),
    type: AssociatedRoleTypeSchema,
    project: z.string().optional(),
  }),
  weight: EndorsementWeightSchema.optional(),
});

export const ThemeConfigSchema = z.object({
  variant: z.enum(['cards', 'timeline', 'masonry']),
  colorScheme: z.enum(['light', 'dark', 'auto']).optional(),
  accentColor: z.string().optional(),
  showHeader: z.boolean().optional(),
  timeline: z.object({
    groupBy: z.enum(['type', 'company']).optional(),
    include: z.array(AssociatedRoleTypeSchema).optional(),
  }).optional(),
});

export const TestimonialConfigSchema = z.object({
  author: PersonSchema,
  testimonials: z.array(TestimonialSchema),
  theme: ThemeConfigSchema.optional(),
});