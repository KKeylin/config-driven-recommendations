import Link from 'next/link';
import { TestimonialsWidget, parseConfig } from 'config-driven-testimonials';
import configJson from '../testimonials.config.json';

const config = parseConfig(configJson);

export default function Home() {
  return (
    <main
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 px-4"
      {...(config.theme?.backgroundColor ? { style: { backgroundColor: config.theme.backgroundColor } } : {})}
    >
      <Link
        href="/editor"
        className="fixed top-4 right-4 z-50 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 112.97 2.97L7.5 19.79l-4 1 1-4 12.362-12.303z" />
        </svg>
        Edit
      </Link>
      <TestimonialsWidget config={config} />
    </main>
  );
}
