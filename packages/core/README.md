# config-driven-testimonials

**A polished React testimonials widget powered entirely by a single JSON config.**
No database. No API. No CMS. Avatars are embedded in the config as base64 — deploy it anywhere, instantly.

- **Zero infrastructure** — your data lives in one `.json` file, not in a server
- **Truly portable** — works on Vercel, GitHub Pages, S3, or any static host
- **Self-contained avatars** — images are base64-encoded inside the config, no external storage needed
- **Configure once, reuse everywhere** — drop in a new host app, point at the same config, done
- **Multiple display variants** — `cards`, `carousel` (3D fan, auto-advance, swipe), `timeline`, `masonry`
- **Accessible by default** — WCAG 2.1 Level AA compliant

[![npm](https://img.shields.io/npm/v/config-driven-testimonials)](https://www.npmjs.com/package/config-driven-testimonials)
[![license](https://img.shields.io/npm/l/config-driven-testimonials)](./LICENSE)
[![WCAG Checked](https://achecker.ca/api/v1/scan/11db60c5-bd9c-4567-a4f7-3ca4478bcc0a/badge)](https://achecker.ca/scan/11db60c5-bd9c-4567-a4f7-3ca4478bcc0a)

---

### See it in action

> **[▶ Live demo](https://config-driven-testimonials-demo.vercel.app)**

> **[✏ Try the visual editor — build your config in minutes, export JSON, drop it in](https://config-driven-testimonials-demo.vercel.app/editor)**

---

## Install

```bash
npm install config-driven-testimonials
# or
pnpm add config-driven-testimonials
```

React 18+ is a peer dependency.

---

## Quick start

```tsx
import { TestimonialsWidget, parseConfig } from 'config-driven-testimonials';
import configJson from './testimonials.config.json';

const config = parseConfig(configJson);

export function TestimonialsSection() {
  return <TestimonialsWidget config={config} />;
}
```

Create `testimonials.config.json` using the [visual editor](https://config-driven-testimonials-demo.vercel.app/editor) or write it by hand — see the [Config reference](#config-reference) below.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `config` | `TestimonialConfig` | required | Validated config object |
| `classPrefix` | `string` | `'t'` | Prefix for all CSS class names |
| `activeTestimonialId` | `string` | — | Highlights one card (used by the editor preview) |

---

## parseConfig

Use `parseConfig` when loading a JSON file to get runtime validation and correct TypeScript types:

```ts
import { parseConfig } from 'config-driven-testimonials';
import raw from './testimonials.config.json';

const config = parseConfig(raw); // throws with a descriptive message if invalid
```

---

## Config reference

```ts
interface TestimonialConfig {
  author: Person;            // your profile — shown in the widget header
  testimonials: Testimonial[];
  theme?: ThemeConfig;
}
```

### Person

```ts
interface Person {
  name?: string;
  title?: string;
  summary?: string;          // short bio rendered under title
  avatarUrl?: string;        // URL or base64 data URI
  linkedinUrl?: string;
  links?: { label: string; url: string }[];  // GitHub, portfolio, etc.
  currentRole?: { title: string; company: string };
}
```

### Testimonial

```ts
interface Testimonial {
  id: string;
  author: Person;            // who wrote the recommendation
  text: string;
  relationship: string;      // e.g. "Managed Kostya at RBC"
  date: string;              // e.g. "March 2024"
  source: TestimonialSource;
  recommendationUrl?: string;
  associatedRole: {
    company: string;
    period: string;          // e.g. "2022 – 2024"
    type: 'employment' | 'contract' | 'education' | 'side-project';
    project?: string;
  };
  weight?: EndorsementWeight;
}
```

### TestimonialSource

```ts
type TestimonialSource =
  | { type: 'linkedin'; url: string }
  | { type: 'reference-letter'; available: true }
  | { type: 'verbal'; contactAvailable?: boolean };
```

### EndorsementWeight

Signals the seniority and context of the endorser. Rendered as a badge on the card.

```ts
interface EndorsementWeight {
  level: 'report' | 'mentee' | 'colleague' | 'lead' | 'manager' | 'director' | 'vp' | 'c-level';
  yearsExperience?: number;  // shown on badge hover
}
```

### ThemeConfig

```ts
interface ThemeConfig {
  variant?: 'cards' | 'carousel' | 'timeline' | 'masonry';  // default: 'cards'
  colorScheme?: 'light' | 'dark' | 'auto';  // default: 'auto'
  accentColor?: string;         // CSS color value, e.g. '#6366f1'
  backgroundColor?: string;     // overrides the page background behind the widget
  showHeader?: boolean;         // default: true
  carouselInterval?: number;    // auto-advance interval in ms (1–60 000); default: 5000
  timeline?: {
    groupBy?: 'type' | 'company';
    include?: ('employment' | 'contract' | 'education' | 'side-project')[];
  };
}
```

---

## Display variants

| Variant | Description |
|---|---|
| `cards` | Stacked cards with fade-in animation. Default. |
| `carousel` | 3D fan layout. Active card is centred; adjacent cards are scaled and dimmed. Auto-advances every `carouselInterval` ms. Pause/play button included. Swipe on touch devices. |
| `timeline` | Cards grouped by role type or company, ordered chronologically. |
| `masonry` | Pinterest-style column layout. |

---

## CSS class customization

Every rendered element receives a semantic class prefixed by `classPrefix` (default `'t'`): `t-card`, `t-text`, `t-avatar`, `t-badge`, etc. Override any of them in your stylesheet:

```
.t-card {
  border-radius: 16px;
}
```

Change the prefix to avoid conflicts:

```tsx
<TestimonialsWidget config={config} classPrefix="my" />
/* renders: my-card, my-text, my-avatar … */
```

---

## Related

- [@config-driven-testimonials/editor](https://www.npmjs.com/package/@config-driven-testimonials/editor) — visual config builder
- [GitHub](https://github.com/KKeylin/config-driven-recommendations)
