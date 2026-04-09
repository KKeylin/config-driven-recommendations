export { TestimonialsWidget } from './TestimonialsWidget';
export { parseConfig } from './parseConfig';
export type { TestimonialsWidgetProps } from './TestimonialsWidget/TestimonialsWidget.types';

// Re-export types from config-schema for consumer convenience
export type {
  TestimonialConfig,
  Person,
  Testimonial,
  TestimonialSource,
  EndorsementWeight,
  ThemeConfig,
} from '@config-driven-testimonials/config-schema';