import type { Testimonial, TestimonialSource } from '@config-driven-testimonials/config-schema';
import type { TestimonialsWidgetProps } from './TestimonialsWidget.types';

function formatSource(source: TestimonialSource): string {
  if (source.type === 'linkedin') return 'LinkedIn';
  if (source.type === 'reference-letter') return 'Reference letter available upon request';
  return 'Verbal reference available';
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }): React.ReactElement {
  return (
    <div data-testid="testimonial-card">
      <p>{testimonial.text}</p>
      <div>
        <span>{testimonial.author.name}</span>
        <span>{testimonial.author.title}</span>
        <span>{testimonial.relationship}</span>
        <span>{testimonial.associatedRole.company} · {testimonial.associatedRole.period}</span>
        <span>{formatSource(testimonial.source)}</span>
      </div>
    </div>
  );
}

export function TestimonialsWidget({ config }: TestimonialsWidgetProps): React.ReactElement {
  return (
    <div data-testid="testimonials-widget">
      <div>
        <span>{config.author.name}</span>
        <span>{config.author.title}</span>
      </div>
      <ul>
        {config.testimonials.map((testimonial) => (
          <li key={testimonial.id}>
            <TestimonialCard testimonial={testimonial} />
          </li>
        ))}
      </ul>
    </div>
  );
}