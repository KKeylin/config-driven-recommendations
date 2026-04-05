# testimonials-widget — Architecture & Decisions

## What we're building

**testimonials-widget** — a reusable, config-driven React component that renders LinkedIn-style testimonials in a beautiful UI. Anyone can fork it, fill in their own `testimonials.config.ts`, and get a polished testimonials section — no code changes needed beyond the config.

### Core concept

```
testimonials.config.ts   ← user fills this in (their data)
        ↓
  @testimonials/core     ← npm package (our code)
        ↓
  Beautiful UI           ← Next.js demo app (live demo with author's real data)
        ↓
  MF remote entry        ← consumed as microfrontend in future personal site
```

---

## Monorepo structure (Turborepo)

```
testimonials-widget/
├── apps/
│   ├── demo/              ← Next.js app (live demo, Vercel deploy)
│   └── mf-remote/         ← Module Federation remote entry (later iteration)
├── packages/
│   ├── core/              ← React component + TypeScript types (npm package)
│   └── config-schema/     ← Zod validation schema
├── turbo.json
├── docs/
│   └── ARCHITECTURE.md    ← this file
└── CLAUDE.md              ← local AI context (gitignored)
```

---

## Iteration plan

### Iteration 1 — Core package + TypeScript schema ✓ DONE
- [x] Set up Turborepo monorepo
- [x] `packages/core` — React component, strict TypeScript interfaces
- [x] `packages/config-schema` — Zod schema for config validation
- [x] Basic rendering: testimonial cards with person info, role, company, source label
- [x] Unit tests (11 tests across both packages)

### Iteration 2 — Next.js demo app (CURRENT)
- [ ] `apps/demo` — Next.js 14+ app router
- [ ] Populate with real testimonials data
- [ ] Deploy to Vercel (live demo link in README)
- [ ] Polish UI — animations, responsive layout
- [ ] Tooltip on endorsement weight badge (level + yearsExperience of the author)

### Iteration 3 — Module Federation remote
- [ ] `apps/mf-remote` — Webpack 5 MF remote entry
- [ ] Expose `TestimonialsWidget` as MF remote
- [ ] Document how to consume from a host app

### Iteration 4 — npm publish
- [ ] Publish `@kKeylin/testimonials-widget` to npm
- [ ] README with usage examples and config reference
- [ ] GitHub Actions CI/CD

---

## Config shape

```typescript
export interface TestimonialConfig {
  author: Person
  testimonials: Testimonial[]
  theme?: ThemeConfig
}

export interface Person {
  name: string
  title: string
  avatarUrl?: string
  linkedinUrl?: string
}

export interface Testimonial {
  id: string
  author: Person                  // who wrote the recommendation
  text: string
  relationship: string            // e.g. "Managed Kostya at RBC"
  date: string
  linkedinUrl?: string            // direct link to the recommendation
  associatedRole: {               // which job this relates to
    company: string
    period: string
  }
  weight?: EndorsementWeight      // seniority signal
}

export interface EndorsementWeight {
  level: 'peer' | 'lead' | 'manager' | 'director' | 'vp' | 'c-level'
  yearsExperience?: number
}

export interface ThemeConfig {
  variant: 'cards' | 'timeline' | 'masonry'
  colorScheme?: 'light' | 'dark' | 'auto'
  accentColor?: string
}
```

---

## Technical decisions

| Decision | Choice | Reason |
|---|---|---|
| Monorepo tool | Turborepo | Fast setup, native Next.js/Vercel support, low overhead |
| Package manager | pnpm | Efficient disk usage, strict dependency resolution |
| Schema validation | Zod | Runtime safety + TypeScript inference |
| Styling | TailwindCSS + shadcn/ui | Modern, no runtime CSS-in-JS overhead |
| Deploy | Vercel | Free tier, auto-deploy from GitHub |
| MF bundler | Webpack 5 | Industry standard for Module Federation |

---

## Coding conventions

- **TypeScript strict mode** — always
- **Semicolons** — always, every statement ends with `;`
- **Named exports** — no default exports in packages
- **No `any`** — use `unknown` + type guards if needed
- **Component files** — `ComponentName/index.tsx` + `ComponentName.types.ts`
- **Tests** — Vitest, co-located with source files
- **Commits** — conventional commits (`feat:`, `fix:`, `chore:`)

---

## What to avoid

- Over-engineering iteration 1 — ship the core types and a working component first
- Adding features not in the current iteration scope
- Any `any` types
- CSS-in-JS solutions (use Tailwind)
- Unnecessary dependencies