import type { Testimonial, TestimonialSource, EndorsementWeight } from '@config-driven-testimonials/config-schema';
import type { TestimonialsWidgetProps } from './TestimonialsWidget.types';

function formatSource(source: TestimonialSource): { label: string; url?: string } {
  if (source.type === 'linkedin') return { label: 'View on LinkedIn', url: source.url };
  if (source.type === 'reference-letter') return { label: 'Reference letter available upon request' };
  return { label: 'Verbal reference available' };
}

const levelColors: Record<EndorsementWeight['level'], string> = {
  'report':    'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'mentee':    'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'peer':      'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  'lead':      'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'manager':   'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  'director':  'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'vp':        'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'c-level':   'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

function WeightBadge({ weight }: { weight: EndorsementWeight }): React.ReactElement {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColors[weight.level]}`}>
      {weight.level}
    </span>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }): React.ReactElement {
  const source = formatSource(testimonial.source);
  const { author } = testimonial;

  return (
    <div data-testid="testimonial-card" className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-base leading-7 text-zinc-600 dark:text-zinc-300">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="flex items-start justify-between gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {author.name}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {author.title}
          </span>
          {author.currentRole && (
            <span className="text-sm text-zinc-400 dark:text-zinc-500">
              Now: {author.currentRole.title} at {author.currentRole.company}
            </span>
          )}
          <span className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            {testimonial.relationship} · {testimonial.associatedRole.company}, {testimonial.associatedRole.period}
          </span>
          {source.url ? (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 w-fit text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              {source.label} ↗
            </a>
          ) : (
            <span className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              {source.label}
            </span>
          )}
        </div>
        {testimonial.weight && (
          <div className="shrink-0">
            <WeightBadge weight={testimonial.weight} />
          </div>
        )}
      </div>
    </div>
  );
}

export function TestimonialsWidget({ config }: TestimonialsWidgetProps): React.ReactElement {
  return (
    <div data-testid="testimonials-widget" className="mx-auto max-w-3xl">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {config.author.name}
        </h2>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {config.author.title}
        </p>
        {config.author.linkedinUrl && (
          <a
            href={config.author.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            LinkedIn Profile ↗
          </a>
        )}
      </div>
      <ul className="flex flex-col gap-4">
        {config.testimonials.map((testimonial) => (
          <li key={testimonial.id}>
            <TestimonialCard testimonial={testimonial} />
          </li>
        ))}
      </ul>
    </div>
  );
}
