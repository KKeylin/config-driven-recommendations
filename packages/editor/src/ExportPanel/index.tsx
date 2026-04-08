import React from "react";
import type { TestimonialConfig } from "@config-driven-testimonials/config-schema";
import { validateAuthor, validateTestimonial } from "../validate.js";

export interface ExportPanelProps {
  config: TestimonialConfig;
}

export function ExportPanel({ config }: ExportPanelProps): React.ReactElement {
  const authorResult = validateAuthor(config.author);
  const testimonialResults = config.testimonials.map((t) => ({
    testimonial: t,
    result: validateTestimonial(t),
  }));

  const allValid = authorResult.valid && testimonialResults.every((r) => r.result.valid);

  function handleDownload(): void {
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "testimonials.config.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (allValid) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-green-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span className="text-sm font-medium text-gray-700">Config is ready to export</span>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M8 12l4 4 4-4M12 4v12" />
          </svg>
          Download testimonials.config.json
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-red-600">Fix the following errors before exporting:</p>
      <ul className="flex flex-col gap-2">
        {!authorResult.valid && (
          <ErrorGroup label="Author" errors={authorResult.errors} />
        )}
        {testimonialResults
          .filter((r) => !r.result.valid)
          .map((r, i) => (
            <ErrorGroup
              key={r.testimonial.id}
              label={`#${config.testimonials.indexOf(r.testimonial) + 1} — ${r.testimonial.author?.name || "Unnamed"}`}
              errors={r.result.errors}
            />
          ))}
      </ul>
    </div>
  );
}

interface ErrorGroupProps {
  label: string;
  errors: string[];
}

function ErrorGroup({ label, errors }: ErrorGroupProps): React.ReactElement {
  return (
    <li className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
      <p className="text-sm font-semibold text-red-700 mb-1">{label}</p>
      <ul className="flex flex-col gap-0.5">
        {errors.map((e) => (
          <li key={e} className="text-xs text-red-600">— {e}</li>
        ))}
      </ul>
    </li>
  );
}
