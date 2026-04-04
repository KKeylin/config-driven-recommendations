# config-driven-testimonials

> **Work in progress** — currently at Iteration 1 (core packages). See [roadmap](#roadmap) below.

A reusable, config-driven React component that renders LinkedIn-style testimonials in a polished UI. Fill in your own `testimonials.config.ts` — no code changes needed beyond the config.

---

## Core concept

```
testimonials.config.ts   ← you fill this in (your data)
        ↓
config-driven-testimonials   ← npm package (this repo)
        ↓
Beautiful UI             ← Next.js demo app (coming in iteration 2)
        ↓
MF remote entry          ← consumable as a microfrontend (iteration 3)
```

The config is validated at runtime with Zod — wrong data structure gives you a clear error, not a silent crash.

---

## Quick start

```ts
import { TestimonialsWidget } from 'config-driven-testimonials';
import type { TestimonialConfig } from 'config-driven-testimonials';

const config: TestimonialConfig = {
  author: {
    name: 'Your Name',
    title: 'Senior Engineer',
    linkedinUrl: 'https://linkedin.com/in/yourprofile',
  },
  testimonials: [
    {
      id: '1',
      author: { name: 'Jane Smith', title: 'Engineering Manager' },
      text: 'An exceptional engineer and a great team player.',
      relationship: 'Managed at Acme Corp',
      date: '2024-01',
      source: { type: 'linkedin', url: 'https://linkedin.com/in/janesmith' },
      associatedRole: { company: 'Acme Corp', period: '2022–2024' },
      weight: { level: 'manager' },
    },
  ],
};

export default function App() {
  return <TestimonialsWidget config={config} />;
}
```

---

## Testimonial sources

Each testimonial has a `source` field that reflects how the recommendation can be verified:

| Type | Description |
|---|---|
| `linkedin` | Public LinkedIn recommendation — includes a direct URL |
| `reference-letter` | Official reference letter — available upon request |
| `verbal` | Verbal reference — contact available upon request |

---

## Endorsement weight

The optional `weight` field signals the seniority of the person who gave the recommendation:

`report` · `mentee` · `peer` · `lead` · `manager` · `director` · `vp` · `c-level`

---

## Monorepo structure

```
config-driven-testimonials/
├── packages/
│   ├── core/              ← React component (this is the npm package)
│   └── config-schema/     ← Zod validation schema + TypeScript types
├── apps/
│   ├── demo/              ← Next.js demo app (iteration 2)
│   └── mf-remote/         ← Module Federation remote entry (iteration 3)
└── docs/
    └── ARCHITECTURE.md    ← full technical decisions
```

---

## Tech stack

| Tool | Reason |
|---|---|
| TypeScript (strict) | Type safety at every layer |
| Zod | Runtime config validation — catches bad data before it reaches the UI |
| React 18 | Component library |
| Turborepo | Monorepo orchestration with smart caching |
| pnpm | Fast, strict dependency resolution |
| Vitest | Zero-config testing with native TypeScript support |
| Next.js 14+ | Demo app with SSR *(iteration 2)* |
| Webpack 5 MF | Module Federation remote entry *(iteration 3)* |
| TailwindCSS + shadcn/ui | Utility-first styling, no runtime CSS-in-JS *(iteration 2)* |

---

## Roadmap

- [x] **Iteration 1** — Turborepo monorepo, TypeScript config schema, Zod validation, React component, unit tests
- [ ] **Iteration 2** — Next.js demo app, real testimonials data, Tailwind UI, deploy to Vercel
- [ ] **Iteration 3** — Webpack 5 Module Federation remote entry
- [ ] **Iteration 4** — Publish to npm, GitHub Actions CI/CD

---

## License

MIT