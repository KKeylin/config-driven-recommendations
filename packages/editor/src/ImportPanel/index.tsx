import { ChangeEvent, DragEvent, ReactElement, useRef, useState } from "react";
import type { TestimonialConfig } from "@config-driven-testimonials/config-schema";
import { TestimonialConfigSchema } from "@config-driven-testimonials/config-schema";

export interface ImportPanelProps {
  onApply: (config: TestimonialConfig) => void;
}

type ParseState =
  | { status: "idle" }
  | { status: "valid"; config: TestimonialConfig; filename: string }
  | { status: "invalid"; errors: string[]; filename: string };

export function ImportPanel({ onApply }: ImportPanelProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<ParseState>({ status: "idle" });
  const [dragging, setDragging] = useState(false);

  function processFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") return;

      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        setState({ status: "invalid", errors: ["File is not valid JSON"], filename: file.name });
        return;
      }

      const result = TestimonialConfigSchema.safeParse(parsed);
      if (result.success) {
        setState({ status: "valid", config: result.data, filename: file.name });
      } else {
        const errors = result.error.issues.map((i) => {
          const path = i.path.length ? `${i.path.join(".")}: ` : "";
          return `${path}${i.message}`;
        });
        setState({ status: "invalid", errors, filename: file.name });
      }
    };
    reader.readAsText(file);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: DragEvent): void {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  function handleApply(): void {
    if (state.status === "valid") {
      onApply(state.config);
      setState({ status: "idle" });
    }
  }

  function reset(): void {
    setState({ status: "idle" });
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-5 cursor-pointer transition-colors ${
          dragging ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }`}
      >
        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-sm text-gray-500">
          Drop <span className="font-medium text-gray-700">testimonials.config.json</span> here, or{" "}
          <span className="text-blue-500">click to browse</span>
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Result */}
      {state.status === "valid" && (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-800">{state.filename}</p>
              <p className="text-xs text-green-600">
                {state.config.testimonials.length} recommendation{state.config.testimonials.length !== 1 ? "s" : ""} · valid
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reset}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {state.status === "invalid" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-red-700">{state.filename} — invalid config</p>
            <button
              type="button"
              onClick={reset}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Dismiss
            </button>
          </div>
          <ul className="flex flex-col gap-0.5">
            {state.errors.map((e) => (
              <li key={e} className="text-xs text-red-600">— {e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}