import React from "react";
import type {
  Testimonial,
  TestimonialSource,
  AssociatedRoleType,
  EndorsementWeight,
} from "@config-driven-testimonials/config-schema";
import { Field, Textarea, Select } from "../ui/fields.js";
import { AvatarUpload } from "../AvatarUpload";

export interface TestimonialFormProps {
  value: Testimonial;
  onChange: (testimonial: Testimonial) => void;
}

const ROLE_TYPE_OPTIONS: { value: AssociatedRoleType; label: string }[] = [
  { value: "employment", label: "Employment" },
  { value: "contract", label: "Contract" },
  { value: "education", label: "Education" },
  { value: "side-project", label: "Side project" },
];

const WEIGHT_LEVEL_OPTIONS: { value: EndorsementWeight["level"]; label: string }[] = [
  { value: "report", label: "Report" },
  { value: "mentee", label: "Mentee" },
  { value: "colleague", label: "Colleague" },
  { value: "lead", label: "Lead" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
  { value: "vp", label: "VP" },
  { value: "c-level", label: "C-Level" },
];

const SOURCE_TYPE_OPTIONS: { value: TestimonialSource["type"]; label: string }[] = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "reference-letter", label: "Reference letter" },
  { value: "verbal", label: "Verbal" },
];

export function TestimonialForm({ value, onChange }: TestimonialFormProps): React.ReactElement {
  function set<K extends keyof Testimonial>(key: K, val: Testimonial[K]): void {
    onChange({ ...value, [key]: val });
  }

  function setAuthor(key: keyof Testimonial["author"], val: string): void {
    onChange({ ...value, author: { ...value.author, [key]: val || undefined } });
  }

  function setRole(key: keyof Testimonial["associatedRole"], val: string): void {
    onChange({ ...value, associatedRole: { ...value.associatedRole, [key]: val || undefined } });
  }

  function setSourceType(type: TestimonialSource["type"]): void {
    if (type === "linkedin") onChange({ ...value, source: { type: "linkedin", url: "" } });
    else if (type === "reference-letter") onChange({ ...value, source: { type: "reference-letter", available: true } });
    else onChange({ ...value, source: { type: "verbal" } });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Quote */}
      <Textarea
        label="Text"
        value={value.text}
        onChange={(v) => set("text", v)}
        rows={5}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Relationship" value={value.relationship} onChange={(v) => set("relationship", v)} required />
        <Field label="Date" value={value.date} onChange={(v) => set("date", v)} required />
      </div>

      <Field
        label="Recommendation URL"
        value={value.recommendationUrl ?? ""}
        onChange={(v) => set("recommendationUrl", v || undefined)}
      />

      {/* Author */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3">Recommender</p>
        <div className="flex flex-col gap-3 pl-3 border-l-2 border-gray-100 dark:border-zinc-700">
          <Field label="Name" value={value.author.name ?? ""} onChange={(v) => setAuthor("name", v)} required />
          <Field label="Title" value={value.author.title ?? ""} onChange={(v) => setAuthor("title", v)} required />
          <Field
            label="LinkedIn URL"
            value={value.author.linkedinUrl ?? ""}
            onChange={(v) => setAuthor("linkedinUrl", v)}
          />
          <AvatarUpload
            value={value.author.avatarUrl}
            {...(value.author.name ? { name: value.author.name } : {})}
            onChange={(v) => {
              const author = { ...value.author };
              if (v !== undefined) author.avatarUrl = v;
              else delete author.avatarUrl;
              onChange({ ...value, author });
            }}
          />
        </div>
      </div>

      {/* Associated role */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3">Associated Role</p>
        <div className="flex flex-col gap-3 pl-3 border-l-2 border-gray-100 dark:border-zinc-700">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Company"
              value={value.associatedRole.company}
              onChange={(v) => setRole("company", v)}
              required
            />
            <Field
              label="Period"
              value={value.associatedRole.period}
              onChange={(v) => setRole("period", v)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Type"
              value={value.associatedRole.type}
              options={ROLE_TYPE_OPTIONS}
              onChange={(v) => setRole("type", v)}
            />
            <Field
              label="Project (optional)"
              value={value.associatedRole.project ?? ""}
              onChange={(v) => setRole("project", v)}
            />
          </div>
        </div>
      </div>

      {/* Source */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3">Source</p>
        <div className="flex flex-col gap-3 pl-3 border-l-2 border-gray-100 dark:border-zinc-700">
          <Select
            label="Type"
            value={value.source.type}
            options={SOURCE_TYPE_OPTIONS}
            onChange={setSourceType}
          />
          {value.source.type === "linkedin" && (
            <Field
              label="LinkedIn URL"
              value={value.source.url}
              onChange={(v) => onChange({ ...value, source: { type: "linkedin", url: v } })}
              required
            />
          )}
        </div>
      </div>

      {/* Weight */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3">Endorsement Weight</p>
        <div className="flex flex-col gap-3 pl-3 border-l-2 border-gray-100 dark:border-zinc-700">
          <Select
            label="Level"
            value={value.weight?.level ?? "colleague"}
            options={WEIGHT_LEVEL_OPTIONS}
            onChange={(v) => {
              const w: EndorsementWeight = { level: v };
              if (value.weight?.yearsExperience !== undefined) w.yearsExperience = value.weight.yearsExperience;
              set("weight", w);
            }}
          />
          <Field
            label="Years of experience"
            value={String(value.weight?.yearsExperience ?? "")}
            onChange={(v) => {
              const w: EndorsementWeight = { level: value.weight?.level ?? "colleague" };
              if (v) w.yearsExperience = Number(v);
              set("weight", w);
            }}
          />
        </div>
      </div>
    </div>
  );
}
