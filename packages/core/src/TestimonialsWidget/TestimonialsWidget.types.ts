import type { TestimonialConfig } from '@config-driven-testimonials/config-schema';

export interface TestimonialsWidgetProps {
  config: TestimonialConfig;
  /** Prefix for all CSS class names. Default: 't'. E.g. 't-card', 't-avatar'. */
  classPrefix?: string;
}
