import { TestimonialsWidget } from 'config-driven-testimonials';
import config from '../testimonials.config';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 px-4">
      <TestimonialsWidget config={config} />
    </main>
  );
}