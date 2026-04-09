import React from "react";
import type { Person } from "@config-driven-testimonials/config-schema";
import { Field } from "../ui/fields.js";

export interface AuthorFormProps {
  value: Person;
  onChange: (author: Person) => void;
  onFocus?: () => void;
}

export function AuthorForm({ value, onChange, onFocus }: AuthorFormProps): React.ReactElement {
  function set<K extends keyof Person>(key: K, val: Person[K]): void {
    onChange({ ...value, [key]: val });
  }

  return (
    <section onFocus={onFocus}>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Author</h2>
      <div className="flex flex-col gap-3">
        <Field label="Name" value={value.name ?? ""} onChange={(v) => set("name", v || undefined)} />
        <Field label="Title" value={value.title ?? ""} onChange={(v) => set("title", v || undefined)} />
        <Field
          label="LinkedIn URL"
          value={value.linkedinUrl ?? ""}
          onChange={(v) => set("linkedinUrl", v || undefined)}
        />
        <Field
          label="Avatar URL"
          value={value.avatarUrl ?? ""}
          onChange={(v) => set("avatarUrl", v || undefined)}
          hint="URL or base64. Upload coming soon."
        />
      </div>
    </section>
  );
}