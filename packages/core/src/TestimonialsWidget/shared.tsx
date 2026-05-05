'use client';

import { useRef, useState, useEffect } from 'react';
import type { Testimonial, TestimonialSource, EndorsementWeight } from '@config-driven-testimonials/config-schema';

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export function resolveSourceUrl(testimonial: Testimonial): string | undefined {
  if (testimonial.recommendationUrl) return testimonial.recommendationUrl;
  if (testimonial.author.linkedinUrl) return testimonial.author.linkedinUrl;
  if (testimonial.source.type === 'linkedin') return testimonial.source.url;
  return undefined;
}

export function formatSourceLabel(source: TestimonialSource): string {
  if (source.type === 'linkedin') return 'Source of recommendation';
  if (source.type === 'reference-letter') return 'Source of recommendation: reference letter available upon request';
  return 'Source of recommendation: verbal reference available';
}

export const levelColors: Record<EndorsementWeight['level'], string> = {
  'report':    'bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
  'mentee':    'bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
  'colleague': 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  'lead':      'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  'manager':   'bg-violet-50 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
  'director':  'bg-orange-50 text-orange-900 dark:bg-orange-950 dark:text-orange-300',
  'vp':        'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300',
  'c-level':   'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
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

export function getInitialsColor(name: string): string {
  if (!name) return initialsColors[0] ?? '';
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return initialsColors[hash % initialsColors.length] ?? initialsColors[0] ?? '';
}

export function Avatar({ name, avatarUrl, p }: { name?: string; avatarUrl?: string; p: string }): React.ReactElement {
  const initials = name ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '?';
  return (
    <div className="tw-reserved-avatar-wrapper h-22 w-22 overflow-hidden ring-2 ring-zinc-100 dark:ring-zinc-800">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name ? `Profile photo of ${name}` : 'Profile photo'}
          className={`${p}-avatar tw-reserved-avatar h-full w-full object-cover`}
        />
      ) : (
        <div className={`${p}-avatar tw-reserved-avatar flex h-full w-full items-center justify-center text-lg font-semibold ${getInitialsColor(name ?? '')}`}>
          {initials}
        </div>
      )}
    </div>
  );
}

// 3 lines × leading-7 (1.75rem per line)
const COLLAPSED_TEXT_HEIGHT = '5.25rem';

export function TestimonialCard({ testimonial, p, active, collapsed }: { testimonial: Testimonial; p: string; active?: boolean; collapsed?: boolean }): React.ReactElement {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [fullTextHeight, setFullTextHeight] = useState<number | null>(null);

  useEffect(() => {
    if (textRef.current) {
      setFullTextHeight(textRef.current.scrollHeight);
    }
  }, [testimonial.text]);

  const isCollapsible = collapsed !== undefined;
  const maxHeight = isCollapsible
    ? collapsed
      ? COLLAPSED_TEXT_HEIGHT
      : fullTextHeight != null ? `${fullTextHeight}px` : undefined
    : undefined;

  const sourceLabel = formatSourceLabel(testimonial.source);
  const sourceUrl = resolveSourceUrl(testimonial);
  const { author } = testimonial;

  return (
    <div data-testid="testimonial-card" className={`${p}-card group flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md [@media(hover:hover)]:bg-zinc-50 [@media(hover:hover)]:hover:bg-white dark:bg-zinc-900 dark:[@media(hover:hover)]:bg-zinc-900 dark:[@media(hover:hover)]:hover:bg-zinc-800 dark:hover:shadow-zinc-950/50 ${active ? "!bg-white !shadow-md ring-2 ring-blue-200 dark:!bg-zinc-800 dark:ring-blue-800" : ""}`}>
      <div
        className="relative overflow-hidden"
        style={{
          maxHeight,
          transition: isCollapsible ? 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)' : undefined,
        }}
      >
        <p ref={textRef} className={`${p}-text text-base leading-7 text-zinc-600 [@media(hover:hover)]:group-hover:text-zinc-900 dark:text-zinc-300 dark:[@media(hover:hover)]:group-hover:text-zinc-100`}>
          &ldquo;{testimonial.text}&rdquo;
        </p>
        {isCollapsible && (
          <div
            className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none"
            style={{
              opacity: collapsed ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          />
        )}
      </div>
      <div className={`${p}-signature flex items-center justify-between`}>
        <span className="text-xs text-zinc-600 dark:text-zinc-400">{formatDate(testimonial.date)}</span>
        <span className="text-sm italic text-zinc-600 dark:text-zinc-400">— {author.name}</span>
      </div>
      <div className="flex items-start gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <div className="relative shrink-0">
          {author.linkedinUrl ? (
            <a href={author.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={author.name ? `View ${author.name}'s LinkedIn profile` : 'View LinkedIn profile'} className="transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:rounded-full">
              <Avatar {...(author.name ? { name: author.name } : {})} {...(author.avatarUrl ? { avatarUrl: author.avatarUrl } : {})} p={p} />
            </a>
          ) : (
            <Avatar {...(author.name ? { name: author.name } : {})} {...(author.avatarUrl ? { avatarUrl: author.avatarUrl } : {})} p={p} />
          )}
          {testimonial.weight && (
            <div className={`${p}-badge tw-reserved-badge inline-flex flex-col items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColors[testimonial.weight.level]}`}>
              <span>{testimonial.weight.level.charAt(0).toUpperCase() + testimonial.weight.level.slice(1)}</span>
              {testimonial.weight.yearsExperience !== undefined && (
                <span className={`${p}-badge-years tw-reserved-badge-years`}>{testimonial.weight.yearsExperience} yrs exp</span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          {author.linkedinUrl ? (
            <a
              href={author.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${p}-author-name font-semibold text-zinc-900 dark:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:rounded`}
            >
              {author.name}
            </a>
          ) : (
            <span className={`${p}-author-name font-semibold text-zinc-900 dark:text-zinc-100`}>
              {author.name}
            </span>
          )}
          <span className={`${p}-author-title text-sm text-zinc-600 dark:text-zinc-300`}>
            {author.title}
          </span>
          {author.currentRole && (
            <span className={`${p}-author-role text-sm text-zinc-600 dark:text-zinc-400`}>
              Now: {author.currentRole.title} at {author.currentRole.company}
            </span>
          )}
          <span className={`${p}-meta mt-1 text-xs text-zinc-600 dark:text-zinc-400`}>
            {testimonial.relationship} · {testimonial.associatedRole.company}, {testimonial.associatedRole.period}
          </span>
          <div className="mt-2 flex items-center gap-2">
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={author.name ? `LinkedIn recommendation from ${author.name}` : sourceLabel}
              className={`${p}-source inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}
              >
                {sourceLabel} ↗
              </a>
            ) : (
              <span className={`${p}-source text-xs text-zinc-600 dark:text-zinc-400`}>
                {sourceLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}