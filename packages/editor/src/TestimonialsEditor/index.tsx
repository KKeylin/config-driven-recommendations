import React from "react";
import type { TestimonialConfig } from "@config-driven-testimonials/config-schema";
import { HeaderForm } from "../HeaderForm/index.js";
import { TestimonialsList } from "../TestimonialsList/index.js";
import { ThemeForm } from "../ThemeForm/index.js";

export interface TestimonialsEditorProps {
  value: TestimonialConfig;
  onChange: (config: TestimonialConfig) => void;
  showValidation?: boolean;
  onRecommendationOpen?: (id: string | null) => void;
  onAuthorFocus?: () => void;
}

export function TestimonialsEditor({ value, onChange, showValidation = false, onRecommendationOpen, onAuthorFocus }: TestimonialsEditorProps): React.ReactElement {
  const showHeader = value.theme?.showHeader !== false;

  return (
    <div className="flex flex-col gap-8">
      <HeaderForm
        author={value.author}
        showHeader={showHeader}
        onAuthorChange={(author) => onChange({ ...value, author })}
        onShowHeaderChange={(show) => onChange({ ...value, theme: { variant: "cards", ...value.theme, showHeader: show } })}
        {...(onAuthorFocus !== undefined ? { onFocus: onAuthorFocus } : {})}
      />
      <hr className="border-gray-200 dark:border-zinc-700" />
      <ThemeForm
        value={value.theme}
        onChange={(theme) => onChange({ ...value, theme })}
      />
      <hr className="border-gray-200 dark:border-zinc-700" />
      <TestimonialsList
        value={value.testimonials}
        onChange={(testimonials) => onChange({ ...value, testimonials })}
        showValidation={showValidation}
        {...(onRecommendationOpen !== undefined ? { onOpen: onRecommendationOpen } : {})}
      />
    </div>
  );
}
