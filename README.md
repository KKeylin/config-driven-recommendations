# config-driven-recommendations

> **Work in progress** — Iteration 3 complete, Iteration 4 (Module Federation) next. See [roadmap](#roadmap) below.

**[Live Demo →](https://config-driven-testimonials-demo.vercel.app/)** · **[Config Editor →](https://config-driven-testimonials-demo.vercel.app/editor)**

A reusable, config-driven React component that renders LinkedIn-style testimonials in a polished UI. Fill in your own `testimonials.config.ts` — no code changes needed beyond the config. Use the visual editor to build and export a config without touching code.

---

## Core concept

```
testimonials.config.ts   ← you fill this in (your data)
        ↓
config-driven-testimonials   ← npm package (this repo)
        ↓
Beautiful UI             ← Next.js demo app (live on Vercel)
        ↓
MF remote entry          ← consumable as a microfrontend (iteration 4)
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
    summary: 'A short bio shown under your title.',  // optional
    avatarUrl: '/avatars/your-photo.jpeg',            // optional; base64 also accepted
    linkedinUrl: 'https://linkedin.com/in/yourprofile',
    links: [                                          // optional arbitrary links
      { label: 'GitHub', url: 'https://github.com/yourhandle' },
    ],
  },
  testimonials: [
    {
      id: '1',
      author: {
        name: 'Jane Smith',
        title: 'Engineering Manager',
        avatarUrl: '/avatars/jane-smith.jpeg',  // optional — initials fallback if omitted
        linkedinUrl: 'https://linkedin.com/in/janesmith',
      },
      text: 'An exceptional engineer and a great team player.',
      relationship: 'Managed at Acme Corp',
      date: '2024-01',
      source: { type: 'linkedin', url: 'https://linkedin.com/in/janesmith' },
      recommendationUrl: 'https://linkedin.com/in/janesmith/details/recommendations/?detailScreenTabIndex=1', // optional
      associatedRole: {
        company: 'Acme Corp',
        period: '2022–2024',
        type: 'employment',  // 'employment' | 'contract' | 'education' | 'side-project'
      },
      weight: { level: 'manager', yearsExperience: 10 },
    },
  ],
};

export default function App() {
  return <TestimonialsWidget config={config} />;
  // custom class prefix:
  // return <TestimonialsWidget config={config} classPrefix="my" />;
  // → classes become: my-card, my-text, my-avatar, my-badge, etc.
}
```

---

## Config editor

The `/editor` route provides a visual split-screen builder: edit the config on the left, see the live widget preview on the right.

- Add, reorder (drag & drop), and delete testimonials
- Upload avatars — auto center-cropped and resized to 128×128
- Import an existing `.json` config (with Zod validation and per-field errors)
- Export the current config as `.json` ready for use

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

`report` · `mentee` · `colleague` · `lead` · `manager` · `director` · `vp` · `c-level`

---

## CSS customization

Every key element has a semantic CSS class for easy overrides. Default prefix is `t`, configurable via `classPrefix` prop:

| Class | Element |
|---|---|
| `t-widget` | Outer container |
| `t-card` | Testimonial card |
| `t-text` | Quote text |
| `t-signature` | Date + author name row |
| `t-author-name` | Author name |
| `t-author-title` | Author title |
| `t-author-role` | Author current role |
| `t-meta` | Relationship · company, period |
| `t-source` | Source of recommendation button |
| `t-avatar` | Avatar image or initials |
| `t-badge` | Endorsement weight badge |
| `t-badge-years` | Years of experience line in badge |

```css
/* example override */
.t-card { border-radius: 0; }
.t-text { font-size: 1.1rem; }
```

---

## Monorepo structure

```
config-driven-recommendations/
├── packages/
│   ├── core/              ← React component (npm: config-driven-testimonials)
│   ├── config-schema/     ← Zod validation schema + TypeScript types
│   └── editor/            ← Visual config builder (npm: @config-driven-testimonials/editor)
├── apps/
│   ├── demo/              ← Next.js demo app + /editor route (Vercel)
│   └── mf-remote/         ← Module Federation remote entry (iteration 4)
└── docs/
    └── ARCHITECTURE.md    ← full technical decisions
```

---

## Tech stack

| Tool | Reason |
|---|---|
| TypeScript (strict) | Type safety at every layer |
| Zod | Runtime config validation — catches bad data before it reaches the UI |
| React 19 | Component library |
| Turborepo | Monorepo orchestration with smart caching |
| pnpm | Fast, strict dependency resolution |
| Vitest | Zero-config testing with native TypeScript support |
| Next.js 16 | Demo app with SSR and App Router |
| TailwindCSS v4 + shadcn/ui | Utility-first styling, no runtime CSS-in-JS |
| HTML5 Drag and Drop API | Dependency-free list reordering in the editor |
| Canvas API | Avatar center-crop + resize to 128×128, no dependencies |
| Webpack 5 MF | Module Federation remote entry *(iteration 4)* |

---

## Roadmap

- [x] **Iteration 1** — Turborepo monorepo, TypeScript config schema, Zod validation, React component, unit tests
- [x] **Iteration 2** — Next.js demo app, real testimonials data, Tailwind UI, [deployed to Vercel](https://config-driven-testimonials-demo.vercel.app/)
- [x] **Iteration 3** — Visual config editor (`packages/editor`), split-screen `/editor` route, avatar upload, drag & drop reorder, import/export JSON
- [ ] **Iteration 4** — Webpack 5 Module Federation remote entry
- [ ] **Iteration 5** — Publish to npm, GitHub Actions CI/CD

---

## License

MIT