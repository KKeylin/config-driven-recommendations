# testimonials-widget — Architecture & Decisions

## What we're building

**testimonials-widget** — a reusable, config-driven React component that renders LinkedIn-style testimonials in a beautiful UI. Anyone can fork it, fill in their own `testimonials.config.ts`, and get a polished testimonials section — no code changes needed beyond the config.

### Core concept

```
testimonials.config.json ← user fills this in (their data); validated via parseConfig()
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
│   ├── demo/              ← Next.js app (live demo + /editor route, Vercel deploy)
│   └── mf-remote/         ← Module Federation remote entry (iteration 4)
├── packages/
│   ├── core/              ← React component + TypeScript types (npm package)
│   ├── config-schema/     ← Zod validation schema
│   └── editor/            ← Visual config builder (npm package)
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

### Iteration 2 — Next.js demo app ✓ DONE
- [x] `apps/demo` — Next.js 16 app router
- [x] Populate with real testimonials data
- [x] Deploy to Vercel (live demo link in README)
- [x] Polish UI — animations, responsive layout
- [x] Tooltip on endorsement weight badge (level + yearsExperience of the author)
- [x] Avatar support — rendered in card with deterministic-color initials fallback
- [x] Author LinkedIn URLs — `recommendationUrl` (given-recommendations tab) with fallback to `author.linkedinUrl`
- [x] Endorsement weight badge — absolute positioned under avatar, expands on hover to reveal `yearsExperience`
- [x] Signature row — date (left) + author name italic (right) between quote and footer
- [x] `classPrefix` prop — all elements get semantic CSS classes (`t-card`, `t-text`, etc.), prefix is configurable; `tw-reserved-*` classes are stable internal hooks immune to prefix changes
- [x] `peer` renamed to `colleague` in endorsement weight levels

### Iteration 3 — Config Editor ✓ DONE
- [x] `packages/editor` — new package, exports `TestimonialsEditor`, `Toolbar`, `ExportPanel`, `ImportPanel`, `ConfirmModal`
- [x] Form UI for `author` (Header section with show/hide toggle), `testimonials[]`, `theme` (Settings)
- [x] Avatar upload: `<input type="file">` → center-crop → resize to 128×128 via canvas → base64; no external dependencies
- [x] Import: load `.json` → Zod validation → populate form (with per-field error messages); drag & drop file support
- [x] Export: form state → download `.json`; validation with green/red highlighting per card
- [x] `apps/demo` — `/editor` route: split-screen (editor left, live `TestimonialsWidget` preview right)
- [x] Drag & drop reordering via native HTML5 Drag and Drop API, no dependencies
- [x] Scroll-sync: opening a recommendation scrolls both panels; focusing author fields scrolls preview to top
- [x] Active card highlight in preview while editing
- [x] Add / delete recommendations; Clear all data with confirmation modal
- [x] `showHeader` toggle — hides the widget header entirely; useful for embedding just the cards
- [x] Custom links array (`Person.links`) — arbitrary label+url pairs replacing github/portfolio fields
- [x] `Person.summary`, `Person.links` added to schema and rendered in widget
- [x] Edit/Back navigation between demo and editor
- [x] Info banner explaining editor purpose and workflow
- [x] `ThemeForm` — Settings block in editor: `colorScheme` (auto/light/dark), `accentColor`, `backgroundColor` with color pickers
- [x] `Person.name` and `Person.title` made optional — header works without them
- [x] `parseConfig(raw)` helper in core — validates unknown JSON against Zod schema, throws descriptive errors; solves TypeScript string literal widening for JSON imports
- [x] Class-based dark mode via Tailwind v4 `@custom-variant dark` — supports both system preference and per-widget override (`dark`/`light` class on widget root)
- [x] Editor panel uses inverse theme vs. preview panel (MutationObserver on `html.dark`)
- [x] Accent color applied to author name and profile links via `--accent` CSS custom property
- [x] `backgroundColor` applied via inline style on widget root; disabled in editor when `colorScheme: auto`

### Iteration 4 — Module Federation remote ✓ DONE
- [x] `apps/mf-remote` — Webpack 5 MF remote entry (port 3001 in dev)
- [x] Expose `TestimonialsWidget` as MF remote (`testimonialsRemote/TestimonialsWidget`)
- [x] Document how to consume from a host app (see below)

### Iteration 5 — npm publish ✓ DONE
- [x] Publish `config-driven-testimonials` and `@config-driven-testimonials/editor` to npm (`v1.0.0`)
- [x] README with usage examples and config reference
- [x] GitHub Actions CI/CD (ci.yml + publish.yml)

### Iteration 6 — Deep-link support ✓ DONE
- [x] `?highlight=<id>` URL param — highlights the matching testimonial card (ring + bg) and scrolls it into view on load
- [x] `activeTestimonialId` prop wired up in demo page via `searchParams` (Next.js 16 async prop)
- [x] `DeepLinkScroller` client component handles `scrollIntoView` without adding hooks to the core widget

### Iteration 7 — Carousel variant + package polish ✓ DONE
- [x] `carousel` added to `ThemeConfig.variant`; `carouselInterval` field (1–60 000 ms)
- [x] `TestimonialsWidget` refactored into `CardsView` / `CarouselView` / `shared` modules
- [x] `CarouselView`: 3D fan layout (center card full opacity, ±1 scaled at 0.85/0.5, ±2 at 0.72/0.2), CSS `translateX` + `scale` transitions
- [x] Expand-on-hover: active card collapses to 3 lines, expands to full text on hover via `max-height` animation to measured `scrollHeight`
- [x] Auto-advance with `setInterval`; pauses on mouse hover over carousel
- [x] Dot navigation with `role="tablist"` / `role="tab"` ARIA pattern
- [x] ESLint 9 flat config added to `packages/core` and `packages/editor`
- [x] All TypeScript types derived from Zod schemas via `z.infer<>` — deleted manual `types.ts`; single source of truth eliminates schema/type drift
- [x] `min(1)` Zod constraints on required Testimonial fields (`id`, `text`, `relationship`, `date`, `company`, `period`)
- [x] Missing prop type exports added to `packages/editor` public API

### Iteration 8 — WCAG 2.1 Level AA / EN 301 549 compliance ✓ DONE

**Level A:**
- [x] **2.2.2 Pause, Stop, Hide** — pause/play toggle button on carousel; `aria-pressed` reflects state
- [x] **4.1.2 Name, Role, Value** — carousel root: `role="region"` + `aria-label`; dots: `aria-label="Slide N of M: Name"`; active slide: `aria-current="true"`
- [x] **1.1.1 Non-text Content** — avatar `alt` changed to `"Profile photo of Name"` / `"Profile photo"` in widget and editor
- [x] **1.3.1 Info and Relationships** — carousel slides wrapped in `<ul>/<li>`; cards view was already compliant
- [x] **2.4.4 Link Purpose** — avatar LinkedIn link gets `aria-label="View Name's LinkedIn profile"`

**Level AA:**
- [x] **1.4.3 Minimum Contrast** — `text-zinc-400 dark:text-zinc-500` → `text-zinc-600 dark:text-zinc-400` on all muted body text (date, attribution, meta, current role, source label); zinc-600 on white = 7.0:1, zinc-400 on zinc-900 = 5.7:1
- [x] **2.4.7 Focus Visible** — `focus-visible:ring-2 focus-visible:ring-blue-400` added to avatar link, author name link, source link, carousel dot buttons, pause button
- [x] **1.4.10 Reflow** — verified: no horizontal scroll at 320 px viewport width

**Carousel UX (mobile):**
- [x] Touch swipe left/right to navigate slides (50 px threshold, `onTouchStart` / `onTouchEnd`)
- [x] Text collapse disabled on touch devices (`window.matchMedia('(hover: hover)')`) — full card text shown immediately
- [x] Height anchor tracks hover/device state — container grows with expanded card, navigation never overlapped
- [x] `IntersectionObserver` on carousel root — auto-advance pauses when component is fully scrolled out of viewport, preventing layout shift in content below

---

## Config shape

```typescript
export interface TestimonialConfig {
  author: Person;
  testimonials: Testimonial[];
  theme?: ThemeConfig;
}

export interface Person {
  name?: string;                // optional — header can be used without displaying a name
  title?: string;               // optional — header can be used without displaying a title
  summary?: string;             // short bio, rendered under title in widget header
  avatarUrl?: string;           // URL or base64 (data:image/jpeg;base64,...)
  linkedinUrl?: string;
  links?: { label: string; url: string }[];  // arbitrary links (GitHub, Medium, etc.)
  currentRole?: { title: string; company: string };
}

export type AssociatedRoleType = 'employment' | 'contract' | 'education' | 'side-project';

export interface Testimonial {
  id: string;
  author: Person;
  text: string;
  relationship: string;            // e.g. "Managed Kostya at RBC"
  date: string;
  source: TestimonialSource;
  recommendationUrl?: string;      // direct link to given-recommendations on author's profile
  associatedRole: {
    company: string;
    period: string;
    type: AssociatedRoleType;      // used for timeline grouping and filtering
    project?: string;              // specific product/team within the company
  };
  weight?: EndorsementWeight;
}

export interface EndorsementWeight {
  level: 'report' | 'mentee' | 'colleague' | 'lead' | 'manager' | 'director' | 'vp' | 'c-level';
  yearsExperience?: number;
}

export type TestimonialSource =
  | { type: 'linkedin'; url: string }
  | { type: 'reference-letter'; available: true }
  | { type: 'verbal'; contactAvailable?: boolean };

export interface ThemeConfig {
  variant?: 'cards' | 'carousel' | 'timeline' | 'masonry';
  colorScheme?: 'light' | 'dark' | 'auto';
  accentColor?: string;
  backgroundColor?: string;         // overrides page background behind the widget
  showHeader?: boolean;             // default true; set false to hide the header (embed cards only)
  carouselInterval?: number;        // auto-advance interval in ms; max 60 000 (60 s); default 5000
  timeline?: {
    groupBy?: 'type' | 'company';
    include?: AssociatedRoleType[];  // filter: show only these role types
  };
}
```

---

## packages/editor — public API

```tsx
// Main editor component
<TestimonialsEditor
  value={config}
  onChange={setConfig}
  showValidation={boolean}           // highlights cards green/red
  onRecommendationOpen={(id) => {}}  // fired when a card is expanded
  onAuthorFocus={() => {}}           // fired when any author field is focused
/>

// Fixed toolbar with Import/Export panels
<Toolbar
  activePanel={activePanel}
  onPanelChange={setActivePanel}
  exportPanel={<ExportPanel config={config} />}
  importPanel={<ImportPanel onApply={handleImport} />}
  onClearRequest={() => {}}
  backHref="/"
/>

// Panel components (used as slots in Toolbar)
<ExportPanel config={config} />
<ImportPanel onApply={(config) => {}} />

// Confirmation modal
<ConfirmModal
  title="..."
  description="..."
  confirmLabel="..."
  onConfirm={() => {}}
  onCancel={() => {}}
/>
```

---

## apps/mf-remote — Module Federation remote

The remote exposes `TestimonialsWidget` under the name `testimonialsRemote`.

### Live remote entry
```
https://cdt.koskei.com/remoteEntry.js
```

### Dev
```bash
pnpm --filter mf-remote dev   # serves remoteEntry.js at http://localhost:3001/remoteEntry.js
```

### Build
```bash
pnpm --filter mf-remote build  # outputs dist/remoteEntry.js
```

### Consuming from a host app (Webpack 5)

**`webpack.config.js` (host):**
```js
const { ModuleFederationPlugin } = require('webpack').container;

new ModuleFederationPlugin({
  remotes: {
    testimonialsRemote: 'testimonialsRemote@https://cdt.koskei.com/remoteEntry.js',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
});
```

**Usage in host component:**
```jsx
import React, { Suspense, lazy } from 'react';

const TestimonialsWidget = lazy(() =>
  import('testimonialsRemote/TestimonialsWidget').then((m) => ({ default: m.TestimonialsWidget }))
);

const config = { /* your TestimonialConfig */ };

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestimonialsWidget config={config} />
    </Suspense>
  );
}
```

### What is shared
| Module | Strategy | Reason |
|---|---|---|
| `react` | singleton | Only one React instance allowed per page |
| `react-dom` | singleton | Tied to the React singleton |
| `config-driven-testimonials` | bundled into remote | Not shared — host may not have it |

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
| Avatar resize | Canvas API | No deps, runs in browser, center-crop to 128×128 JPEG |
| DnD reorder | HTML5 native DnD | No deps, sufficient for list reordering |
| Import validation | Zod `safeParse` | Structured error messages per field |
| TypeScript types | `z.infer<>` from Zod schemas | Single source of truth — eliminates manual type drift |
| Linting | ESLint 9 flat config + `@typescript-eslint` | Consistent rules across core and editor packages |
| Accessibility standard | WCAG 2.1 Level AA / EN 301 549 | Enterprise and government deployment readiness |

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

- Over-engineering — ship the current iteration scope first
- Adding features not in the current iteration scope
- Any `any` types
- CSS-in-JS solutions (use Tailwind)
- Unnecessary dependencies