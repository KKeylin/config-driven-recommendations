import { ReactElement } from "react";

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  required?: boolean;
}

export function Field({ label, value, onChange, hint, required }: FieldProps): ReactElement {
  return (
    <label className="flex flex-col gap-1">
      <FieldLabel label={label} required={required} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100 dark:focus:border-blue-400"
      />
      {hint && <span className="text-xs text-gray-400 dark:text-zinc-500">{hint}</span>}
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

export function Textarea({ label, value, onChange, rows = 4, required }: TextareaProps): ReactElement {
  return (
    <label className="flex flex-col gap-1">
      <FieldLabel label={label} required={required} />
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100 dark:focus:border-blue-400"
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

export function Select<T extends string>({ label, value, options, onChange, required }: SelectProps<T>): ReactElement {
  return (
    <label className="flex flex-col gap-1">
      <FieldLabel label={label} required={required} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  disabled?: boolean;
}

export function ColorField({ label, value, onChange, hint, disabled }: ColorFieldProps): ReactElement {
  return (
    <div className={`flex flex-col gap-1 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <FieldLabel label={label} />
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} — color picker`}
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="h-9 w-10 cursor-pointer rounded border border-gray-300 p-0.5 disabled:cursor-not-allowed"
        />
        <input
          type="text"
          aria-label={`${label} — hex value`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. #3b82f6"
          disabled={disabled}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100"
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label={`Clear ${label}`}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        )}
      </div>
      {hint && <span className="text-xs text-gray-400 dark:text-zinc-500">{hint}</span>}
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  disabled?: boolean;
}

export function NumberField({ label, value, onChange, min, max, step, hint, disabled }: NumberFieldProps): ReactElement {
  return (
    <label className={`flex flex-col gap-1 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <FieldLabel label={label} />
      <input
        type="number"
        value={value ?? ''}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw === '' ? undefined : Number(raw));
        }}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100 dark:focus:border-blue-400 disabled:cursor-not-allowed"
      />
      {hint && <span className="text-xs text-gray-400 dark:text-zinc-500">{hint}</span>}
    </label>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean | undefined }): ReactElement {
  return (
    <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </span>
  );
}