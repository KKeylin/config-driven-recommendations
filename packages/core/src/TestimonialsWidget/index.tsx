import type { Testimonial, TestimonialSource, EndorsementWeight } from '@config-driven-testimonials/config-schema';
import type { TestimonialsWidgetProps } from './TestimonialsWidget.types';

function resolveSourceUrl(testimonial: Testimonial): string | undefined {
  if (testimonial.recommendationUrl) return testimonial.recommendationUrl;
  if (testimonial.author.linkedinUrl) return testimonial.author.linkedinUrl;
  if (testimonial.source.type === 'linkedin') return testimonial.source.url;
  return undefined;
}

function formatSourceLabel(source: TestimonialSource): string {
  if (source.type === 'linkedin') return 'Source of recommendation';
  if (source.type === 'reference-letter') return 'Source of recommendation: reference letter available upon request';
  return 'Source of recommendation: verbal reference available';
}

const levelColors: Record<EndorsementWeight['level'], string> = {
  'report':   'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'mentee':   'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'peer':     'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  'lead':     'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'manager':  'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  'director': 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'vp':       'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'c-level':  'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const initialsColors = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
];

function getInitialsColor(name: string): string {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return initialsColors[hash % initialsColors.length] ?? initialsColors[0] ?? '';
}

function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }): React.ReactElement {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="h-22 w-22 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800"
      />
    );
  }
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className={`flex h-22 w-22 items-center justify-center rounded-full text-lg font-semibold ring-2 ring-zinc-100 dark:ring-zinc-800 ${getInitialsColor(name)}`}>
      {initials}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }): React.ReactElement {
  const sourceLabel = formatSourceLabel(testimonial.source);
  const sourceUrl = resolveSourceUrl(testimonial);
  const { author } = testimonial;

  return (
    <div data-testid="testimonial-card" className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:shadow-zinc-900/50">
      <p className="text-base leading-7 text-zinc-600 dark:text-zinc-300">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="flex items-start gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <div className="flex shrink-0 flex-col items-center gap-2">
          {author.linkedinUrl ? (
            <a href={author.linkedinUrl} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80">
              <Avatar name={author.name} {...(author.avatarUrl ? { avatarUrl: author.avatarUrl } : {})} />
            </a>
          ) : (
            <Avatar name={author.name} {...(author.avatarUrl ? { avatarUrl: author.avatarUrl } : {})} />
          )}
          {testimonial.weight && (
            <div className="group relative">
              <span className={`inline-flex cursor-default items-center rounded-full px-2 py-0.5 text-xs font-medium ${levelColors[testimonial.weight.level]}`}>
                {testimonial.weight.level.charAt(0).toUpperCase() + testimonial.weight.level.slice(1)}
              </span>
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-white shadow-md group-hover:block dark:bg-zinc-700">
                {testimonial.weight.level.charAt(0).toUpperCase() + testimonial.weight.level.slice(1)}
                {testimonial.weight.yearsExperience !== undefined && ` · ${testimonial.weight.yearsExperience} yrs exp`}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          {author.linkedinUrl ? (
            <a
              href={author.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
            >
              {author.name}
            </a>
          ) : (
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {author.name}
            </span>
          )}
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
          <div className="mt-2 flex items-center gap-2">
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {sourceLabel} ↗
              </a>
            ) : (
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                {sourceLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsWidget({ config }: TestimonialsWidgetProps): React.ReactElement {
  return (
    <div data-testid="testimonials-widget" className="mx-auto max-w-3xl">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
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
        {config.testimonials.map((testimonial, index) => (
          <li
            key={testimonial.id}
            style={{
              animation: 'fadeInUp 0.4s ease-out both',
              animationDelay: `${index * 0.06}s`,
            }}
          >
            <TestimonialCard testimonial={testimonial} />
          </li>
        ))}
      </ul>
    </div>
  );
}