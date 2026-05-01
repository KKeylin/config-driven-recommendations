import type { TestimonialsWidgetProps } from './TestimonialsWidget.types';
import { CardsView } from './CardsView';
import { CarouselView } from './CarouselView';

export function TestimonialsWidget({ config, classPrefix = 't', activeTestimonialId }: TestimonialsWidgetProps): React.ReactElement {
  const p = classPrefix;
  const variant = config.theme?.variant ?? 'cards';
  const colorScheme = config.theme?.colorScheme;
  const accentColor = config.theme?.accentColor;
  const backgroundColor = config.theme?.backgroundColor;
  const rootStyle: React.CSSProperties = {
    ...(accentColor ? { '--accent': accentColor } as React.CSSProperties : {}),
    ...(backgroundColor ? { backgroundColor } : {}),
  };
  return (
    <div
      data-testid="testimonials-widget"
      className={`${p}-widget mx-auto max-w-3xl${colorScheme === 'dark' ? ' dark' : colorScheme === 'light' ? ' light' : ''}`}
      {...(Object.keys(rootStyle).length ? { style: rootStyle } : {})}
    >
      {config.theme?.showHeader !== false && (
        <div className="mb-10 text-center">
          <h2
            className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100"
            {...(accentColor ? { style: { color: 'var(--accent)' } } : {})}
          >
            {config.author.name}
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">{config.author.title}</p>
          {config.author.summary && (
            <p className="mt-3 max-w-xl mx-auto text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm rounded-xl px-4 py-3">
              {config.author.summary}
            </p>
          )}
          {(config.author.linkedinUrl || config.author.links?.length) && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {config.author.linkedinUrl && (
                <a href={config.author.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  {...(accentColor ? { style: { borderColor: 'var(--accent)', color: 'var(--accent)' } } : {})}>
                  LinkedIn ↗
                </a>
              )}
              {config.author.links?.map((link) => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  {...(accentColor ? { style: { borderColor: 'var(--accent)', color: 'var(--accent)' } } : {})}>
                  {link.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {variant === 'carousel' ? (
        <CarouselView
          testimonials={config.testimonials}
          p={p}
          interval={config.theme?.carouselInterval}
        />
      ) : (
        <CardsView
          testimonials={config.testimonials}
          p={p}
          activeTestimonialId={activeTestimonialId}
        />
      )}
    </div>
  );
}