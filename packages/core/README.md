# config-driven-testimonials

**A polished React testimonials widget powered entirely by a single JSON config.**
No database. No API. No CMS. Avatars are embedded in the config as base64 — deploy it anywhere, instantly.

- **Zero infrastructure** — your data lives in one `.json` file, not in a server
- **Truly portable** — works on Vercel, GitHub Pages, S3, or any static host
- **Self-contained avatars** — images are base64-encoded inside the config, no external storage needed
- **Configure once, reuse forever** — drop in a new host app, point at the same config, done

[![npm](https://img.shields.io/npm/v/config-driven-testimonials)](https://www.npmjs.com/package/config-driven-testimonials)
[![license](https://img.shields.io/npm/l/config-driven-testimonials)](./LICENSE)

---

### See it in action

> **[▶ Live demo](https://config-driven-recommendations-demo.vercel.app)**

> **[✏ Try the visual editor — build your config in minutes, export JSON, drop it in](https://config-driven-recommendations-demo.vercel.app/editor)**

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

Create `testimonials.config.json` using the [visual editor](https://config-driven-recommendations-demo.vercel.app/editor) or write it by hand — see the [Config reference](#config-reference) below.

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
  variant: 'cards' | 'timeline' | 'masonry';
  colorScheme?: 'light' | 'dark' | 'auto';  // default: 'auto'
  accentColor?: string;       // CSS color value, e.g. '#6366f1'
  backgroundColor?: string;   // overrides the page background behind the widget
  showHeader?: boolean;       // default: true
}
```

---

## CSS class customization

Every rendered element receives a semantic class prefixed by `classPrefix` (default `'t'`): `t-card`, `t-text`, `t-avatar`, `t-badge`, etc. Override any of them in your stylesheet:

```css
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