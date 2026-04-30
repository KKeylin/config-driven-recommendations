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
  id: z.string().min(1),
  author: PersonSchema,
  text: z.string().min(1),
  relationship: z.string().min(1),
  date: z.string().min(1),
  source: TestimonialSourceSchema,
  recommendationUrl: z.string().url().optional(),
  associatedRole: z.object({
    company: z.string().min(1),
    period: z.string().min(1),
    type: AssociatedRoleTypeSchema,
    project: z.string().optional(),
  }),
  weight: EndorsementWeightSchema.optional(),
});

export const ThemeConfigSchema = z.object({
  variant: z.enum(['cards', 'carousel', 'timeline', 'masonry']).optional(),
  colorScheme: z.enum(['light', 'dark', 'auto']).optional(),
  accentColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  showHeader: z.boolean().optional(),
  carouselInterval: z.number().int().positive().max(60000).optional(),
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

export type Person = z.infer<typeof PersonSchema>;
export type EndorsementWeight = z.infer<typeof EndorsementWeightSchema>;
export type TestimonialSource = z.infer<typeof TestimonialSourceSchema>;
export type AssociatedRoleType = z.infer<typeof AssociatedRoleTypeSchema>;
export type Testimonial = z.infer<typeof TestimonialSchema>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
export type TestimonialConfig = z.infer<typeof TestimonialConfigSchema>;