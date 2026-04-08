import React from "react";

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  required?: boolean;
}

export function Field({ label, value, onChange, hint, required }: FieldProps): React.ReactElement {
  return (
    <label className="flex flex-col gap-1">
      <FieldLabel label={label} required={required} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      {hint && <span className="text-xs text-gray-400">{hint}</span>}
    </label>
  );
}

interface TextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
}

export function Textarea({ label, value, onChange, rows = 4, required }: TextareaProps): React.ReactElement {
  return (
    <label className="flex flex-col gap-1">
      <FieldLabel label={label} required={required} />
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"
      />
    </label>
  );
}

interface SelectProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  required?: boolean;
}

export function Select<T extends string>({ label, value, options, onChange, required }: SelectProps<T>): React.ReactElement {
  return (
    <label className="flex flex-col gap-1">
      <FieldLabel label={label} required={required} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean | undefined }): React.ReactElement {
  return (
    <span className="text-xs font-medium text-gray-600">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </span>
  );
}