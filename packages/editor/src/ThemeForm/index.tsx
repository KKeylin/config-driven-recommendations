import React from "react";
import type { ThemeConfig } from "@config-driven-testimonials/config-schema";
import { Select, Field } from "../ui/fields.js";

export interface ThemeFormProps {
  value: ThemeConfig | undefined;
  onChange: (theme: ThemeConfig) => void;
}

const VARIANT_OPTIONS: { value: ThemeConfig["variant"]; label: string }[] = [
  { value: "cards", label: "Cards" },
  { value: "masonry", label: "Masonry" },
  { value: "timeline", label: "Timeline" },
];

const COLOR_SCHEME_OPTIONS: { value: NonNullable<ThemeConfig["colorScheme"]>; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const DEFAULT_THEME: ThemeConfig = { variant: "cards", colorScheme: "auto" };

export function ThemeForm({ value, onChange }: ThemeFormProps): React.ReactElement {
  const theme = value ?? DEFAULT_THEME;

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Settings</h2>
      <div className="flex flex-col gap-3">
        <Select
          label="Variant"
          value={theme.variant}
          options={VARIANT_OPTIONS}
          onChange={(v) => onChange({ ...theme, variant: v })}
        />
        <Select
          label="Color scheme"
          value={theme.colorScheme ?? "auto"}
          options={COLOR_SCHEME_OPTIONS}
          onChange={(v) => onChange({ ...theme, colorScheme: v })}
        />
        <Field
          label="Accent color"
          value={theme.accentColor ?? ""}
          onChange={(v) => {
            const next = { ...theme };
            if (v) next.accentColor = v;
            else delete next.accentColor;
            onChange(next);
          }}
          hint="Any valid CSS color, e.g. #3b82f6 or oklch(60% 0.2 250)"
        />
      </div>
    </section>
  );
}
