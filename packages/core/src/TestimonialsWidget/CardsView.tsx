import type { Testimonial } from '@config-driven-testimonials/config-schema';
import { TestimonialCard } from './shared';

export function CardsView({ testimonials, p, activeTestimonialId }: {
  testimonials: Testimonial[];
  p: string;
  activeTestimonialId?: string | undefined;
}): React.ReactElement {
  return (
    <ul className="flex flex-col gap-4">
      {testimonials.map((testimonial, index) => (
        <li
          key={testimonial.id}
          data-testimonial-id={testimonial.id}
          style={{
            animation: 'fadeInUp 0.4s ease-out both',
            animationDelay: `${index * 0.06}s`,
          }}
        >
          <TestimonialCard testimonial={testimonial} p={p} active={testimonial.id === activeTestimonialId} />
        </li>
      ))}
    </ul>
  );
}