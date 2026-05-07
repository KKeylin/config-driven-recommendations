import { ReactElement } from "react";
import type { ThemeConfig } from "@config-driven-testimonials/config-schema";
import { Select, ColorField, NumberField } from "../ui/fields.js";

export interface ThemeFormProps {
  value: ThemeConfig | undefined;
  onChange: (theme: ThemeConfig) => void;
}

const VARIANT_OPTIONS: { value: NonNullable<ThemeConfig["variant"]>; label: string }[] = [
  { value: "cards", label: "Cards" },
  { value: "carousel", label: "Carousel" },
];

const COLOR_SCHEME_OPTIONS: { value: NonNullable<ThemeConfig["colorScheme"]>; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const DEFAULT_THEME: ThemeConfig = { variant: "cards", colorScheme: "auto" };
const DEFAULT_BG: Record<"light" | "dark", string> = {
  light: "#fafafa",
  dark: "#09090b",
};

export function ThemeForm({ value, onChange }: ThemeFormProps): ReactElement {
  const theme = value ?? DEFAULT_THEME;
  const colorScheme = theme.colorScheme ?? "auto";
  const isAuto = colorScheme === "auto";
  const isCarousel = (theme.variant ?? "cards") === "carousel";

  function handleColorSchemeChange(v: NonNullable<ThemeConfig["colorScheme"]>): void {
    const next = { ...theme, colorScheme: v };
    if (v === "auto") {
      delete next.backgroundColor;
    } else {
      next.backgroundColor = DEFAULT_BG[v];
    }
    onChange(next);
  }

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-4">Settings</h2>
      <div className="flex flex-col gap-3">
        <Select
          label="Variant"
          value={theme.variant ?? "cards"}
          options={VARIANT_OPTIONS}
          onChange={(v) => onChange({ ...theme, variant: v as NonNullable<ThemeConfig["variant"]> })}
        />
        <Select
          label="Color scheme"
          value={colorScheme}
          options={COLOR_SCHEME_OPTIONS}
          onChange={handleColorSchemeChange}
        />
        <ColorField
          label="Accent color"
          value={theme.accentColor ?? ""}
          onChange={(v) => {
            const next = { ...theme };
            if (v) next.accentColor = v;
            else delete next.accentColor;
            onChange(next);
          }}
          hint="Applied to name and profile links."
        />
        <NumberField
          label="Carousel duration (ms)"
          value={theme.carouselInterval}
          onChange={(v) => {
            const next = { ...theme };
            if (v !== undefined) next.carouselInterval = v;
            else delete next.carouselInterval;
            onChange(next);
          }}
          min={1}
          max={60000}
          step={500}
          hint={isCarousel ? "Auto-advance interval. Default: 5000 ms." : "Only applies to carousel variant."}
          disabled={!isCarousel}
        />
        <ColorField
          label="Background color"
          value={theme.backgroundColor ?? ""}
          onChange={(v) => {
            const next = { ...theme };
            if (v) next.backgroundColor = v;
            else delete next.backgroundColor;
            onChange(next);
          }}
          hint={isAuto ? "Managed automatically in auto mode." : "Overrides the page background behind the widget."}
          disabled={isAuto}
        />
      </div>
    </section>
  );
}