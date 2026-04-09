import React from "react";
import type { Person } from "@config-driven-testimonials/config-schema";
import { Field, Textarea } from "../ui/fields.js";

export interface HeaderFormProps {
  author: Person;
  showHeader: boolean;
  onAuthorChange: (author: Person) => void;
  onShowHeaderChange: (show: boolean) => void;
  onFocus?: () => void;
}

export function HeaderForm({ author, showHeader, onAuthorChange, onShowHeaderChange, onFocus }: HeaderFormProps): React.ReactElement {
  function set<K extends keyof Person>(key: K, val: Person[K]): void {
    onAuthorChange({ ...author, [key]: val });
  }

  const links = author.links ?? [];

  function setLink(index: number, field: "label" | "url", val: string): void {
    const next = links.slice();
    next[index] = { ...next[index]!, [field]: val };
    set("links", next);
  }

  function removeLink(index: number): void {
    const next = links.slice();
    next.splice(index, 1);
    set("links", next.length ? next : undefined);
  }

  function addLink(): void {
    set("links", [...links, { label: "", url: "" }]);
  }

  return (
    <section onFocus={onFocus}>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Header</h2>
        <button
          type="button"
          role="switch"
          aria-checked={showHeader}
          onClick={() => onShowHeaderChange(!showHeader)}
          className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
            showHeader ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform duration-200 ${
              showHeader ? "translate-x-4.5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showHeader ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col gap-3">
          <Field label="Name" value={author.name ?? ""} onChange={(v) => set("name", v || undefined)} />
          <Field label="Title" value={author.title ?? ""} onChange={(v) => set("title", v || undefined)} />
          <Textarea
            label="Summary"
            value={author.summary ?? ""}
            onChange={(v) => set("summary", v || undefined)}
            rows={2}
          />
          <Field
            label="LinkedIn URL"
            value={author.linkedinUrl ?? ""}
            onChange={(v) => set("linkedinUrl", v || undefined)}
          />

          {/* Custom links */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-gray-600">Links</span>
            {links.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) => setLink(index, "label", e.target.value)}
                  className="w-28 shrink-0 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => setLink(index, "url", e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  title="Remove link"
                  className="shrink-0 p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 011-1h4a1 1 0 011 1m-7 0H5m14 0h-2" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLink}
              className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 transition-colors self-start mt-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add link
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}