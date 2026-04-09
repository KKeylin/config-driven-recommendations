import { TestimonialConfigSchema } from '@config-driven-testimonials/config-schema';
import type { TestimonialConfig } from '@config-driven-testimonials/config-schema';

/**
 * Validates and parses a raw JSON object into a typed TestimonialConfig.
 *
 * Use this when importing a config exported from the editor:
 *
 * ```ts
 * import { parseConfig, TestimonialsWidget } from 'config-driven-testimonials';
 * import configJson from './testimonials.config.json';
 *
 * const config = parseConfig(configJson);
 * <TestimonialsWidget config={config} />
 * ```
 *
 * Throws a descriptive error if the JSON does not match the expected schema.
 */
export function parseConfig(raw: unknown): TestimonialConfig {
  const result = TestimonialConfigSchema.safeParse(raw);
  if (!result.success) {
    const messages = result.error.issues.map((i) => `  • ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid testimonials config:\n${messages}`);
  }
  return result.data as unknown as TestimonialConfig;
}