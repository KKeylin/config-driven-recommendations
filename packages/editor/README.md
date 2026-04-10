
# @config-driven-testimonials/editor

**Visual config builder for [config-driven-testimonials](https://www.npmjs.com/package/config-driven-testimonials).**
Fill in your testimonials, upload avatars, tweak the theme — then export a single JSON file and drop it into your app.

- **No backend required** — everything happens in the browser
- **Avatar upload built-in** — center-crops and encodes to base64 automatically
- **Import / export JSON** — with full Zod validation and per-field error messages
- **Drag & drop reordering** — native HTML5, no extra dependencies
- **Live preview** — see exactly what the widget will look like as you type

[![npm](https://img.shields.io/npm/v/@config-driven-testimonials/editor)](https://www.npmjs.com/package/@config-driven-testimonials/editor)
[![license](https://img.shields.io/npm/l/@config-driven-testimonials/editor)](./LICENSE)

---

### Try it without installing

> **[✏ Open the hosted editor](https://config-driven-recommendations-demo.vercel.app/editor)**

---

## Install

```bash
npm install @config-driven-testimonials/editor
# or
pnpm add @config-driven-testimonials/editor
```

React 18+ is a peer dependency. Requires Tailwind CSS v4 in the host app.

---

## Quick start

The editor is designed for a split-screen layout: editor on the left, live `TestimonialsWidget` preview on the right.

```tsx
import { useState } from 'react';
import { TestimonialsEditor, Toolbar, ExportPanel, ImportPanel } from '@config-driven-testimonials/editor';
import { TestimonialsWidget, parseConfig, type TestimonialConfig } from 'config-driven-testimonials';
import configJson from './testimonials.config.json';

export function EditorPage() {
  const [config, setConfig] = useState<TestimonialConfig>(parseConfig(configJson));
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '50%', overflowY: 'auto' }}>
        <Toolbar
          activePanel={activePanel}
          onPanelChange={setActivePanel}
          exportPanel={<ExportPanel config={config} />}
          importPanel={<ImportPanel onApply={setConfig} />}
          onClearRequest={() => setConfig(parseConfig({ author: {}, testimonials: [], theme: { variant: 'cards' } }))}
          backHref="/"
        />
        <TestimonialsEditor
          value={config}
          onChange={setConfig}
          onRecommendationOpen={setActiveId}
        />
      </div>
      <div style={{ width: '50%', overflowY: 'auto' }}>
        <TestimonialsWidget config={config} activeTestimonialId={activeId ?? undefined} />
      </div>
    </div>
  );
}
```

---

## API

### `TestimonialsEditor`

The main form component. Renders sections for author profile, testimonials list, and theme settings.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `TestimonialConfig` | required | Current config state |
| `onChange` | `(config) => void` | required | Called on every field change |
| `showValidation` | `boolean` | `false` | Highlights cards green/red based on validity |
| `onRecommendationOpen` | `(id: string \| null) => void` | — | Fired when a card is expanded |
| `onAuthorFocus` | `() => void` | — | Fired when any author field is focused |

### `Toolbar`

Fixed top bar with Import, Export, and Clear actions.

| Prop | Type | Description |
|---|---|---|
| `activePanel` | `string \| null` | Controls which panel is open |
| `onPanelChange` | `(id: string \| null) => void` | Panel open/close handler |
| `exportPanel` | `ReactNode` | Slot — pass `<ExportPanel config={config} />` |
| `importPanel` | `ReactNode` | Slot — pass `<ImportPanel onApply={fn} />` |
| `onClearRequest` | `() => void` | Called when user confirms "Clear all" |
| `backHref` | `string` | URL for the back navigation link |

### `ExportPanel`

Downloads the current config as a `.json` file.

```tsx
<ExportPanel config={config} />
```

### `ImportPanel`

Accepts a `.json` file (click or drag & drop), validates with Zod, calls `onApply` with the parsed config.

```tsx
<ImportPanel onApply={(config) => setConfig(config)} />
```

### `ConfirmModal`

Generic confirmation dialog used internally by the Toolbar. Export it if you need it elsewhere.

```tsx
<ConfirmModal
  title="Clear all data?"
  description="This will remove all testimonials and reset the config."
  confirmLabel="Clear"
  onConfirm={handleClear}
  onCancel={handleCancel}
/>
```

---

## Related

- [config-driven-testimonials](https://www.npmjs.com/package/config-driven-testimonials) — the widget itself
- [GitHub](https://github.com/KKeylin/config-driven-recommendations)
