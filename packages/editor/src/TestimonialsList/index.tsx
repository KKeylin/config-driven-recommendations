import React, { useRef, useState } from "react";
import type { Testimonial } from "@config-driven-testimonials/config-schema";
import { TestimonialForm } from "../TestimonialForm/index.js";
import { validateTestimonial } from "../validate.js";
import { smoothScrollToElement } from "../utils/smoothScroll.js";

export interface TestimonialsListProps {
  value: Testimonial[];
  onChange: (testimonials: Testimonial[]) => void;
  showValidation?: boolean;
  onOpen?: (id: string | null) => void;
}

interface DropPosition {
  index: number;
  side: "above" | "below";
}

function createEmptyTestimonial(): Testimonial {
  return {
    id: crypto.randomUUID(),
    author: { name: "", title: "" },
    text: "",
    relationship: "",
    date: new Date().getFullYear().toString(),
    source: { type: "linkedin", url: "" },
    associatedRole: { company: "", period: "", type: "employment" },
  };
}

export function TestimonialsList({ value, onChange, showValidation = false, onOpen }: TestimonialsListProps): React.ReactElement {
  const [openId, setOpenId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<DropPosition | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const dragIndexRef = useRef<number | null>(null);

  function toggle(id: string): void {
    const next = openId === id ? null : id;
    setOpenId(next);
    onOpen?.(next);
    if (next) {
      setTimeout(() => {
        const el = cardRefs.current.get(next);
        if (el) smoothScrollToElement(el);
      }, 16);
    }
  }

  function update(index: number, testimonial: Testimonial): void {
    const next = value.slice();
    next[index] = testimonial;
    onChange(next);
  }

  function remove(index: number): void {
    const next = value.slice();
    const removed = next.splice(index, 1)[0];
    if (openId === removed?.id) {
      setOpenId(null);
      onOpen?.(null);
    }
    onChange(next);
  }

  function add(): void {
    const t = createEmptyTestimonial();
    onChange([...value, t]);
    setTimeout(() => toggle(t.id), 16);
  }

  // — DnD handlers —

  function handleDragStart(index: number): void {
    dragIndexRef.current = index;
  }

  function handleDragOver(e: React.DragEvent, index: number): void {
    e.preventDefault();
    if (dragIndexRef.current === null || dragIndexRef.current === index) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const side: "above" | "below" = e.clientY < rect.top + rect.height / 2 ? "above" : "below";
    setDropPosition({ index, side });
  }

  function handleDrop(e: React.DragEvent, index: number): void {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === index) { reset(); return; }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const insertAfter = e.clientY >= rect.top + rect.height / 2;
    const insertAt = insertAfter ? index + 1 : index;

    const next = value.slice();
    const [item] = next.splice(from, 1);
    const adjustedIndex = from < insertAt ? insertAt - 1 : insertAt;
    next.splice(adjustedIndex, 0, item!);
    onChange(next);
    reset();
  }

  function reset(): void {
    dragIndexRef.current = null;
    setDropPosition(null);
  }

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
        Recommendations{" "}
        <span className="ml-1 text-gray-400 font-normal normal-case tracking-normal">({value.length})</span>
      </h2>
      <div className="flex flex-col gap-2">
        {value.map((testimonial, index) => {
          const isOpen = openId === testimonial.id;
          const isDragging = dragIndexRef.current === index;
          const validation = showValidation ? validateTestimonial(testimonial) : null;

          const borderClass = validation
            ? validation.valid ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
            : "border-gray-200";

          const showLineAbove = dropPosition?.index === index && dropPosition.side === "above";
          const showLineBelow = dropPosition?.index === index && dropPosition.side === "below";

          return (
            <div
              key={testimonial.id}
              ref={(el) => { if (el) cardRefs.current.set(testimonial.id, el); else cardRefs.current.delete(testimonial.id); }}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={() => setDropPosition(null)}
              onDrop={(e) => handleDrop(e, index)}
              className="relative"
            >
              {showLineAbove && <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full z-10 -translate-y-1" />}

              <div className={`rounded-lg border overflow-hidden transition-colors ${borderClass} ${isDragging ? "opacity-40" : ""}`}>
                <div className="flex items-center">
                  {/* Drag handle */}
                  <div
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnd={reset}
                    title="Drag to reorder"
                    className="shrink-0 pl-3 pr-1 py-3 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <circle cx="5.5" cy="4" r="1.2" />
                      <circle cx="10.5" cy="4" r="1.2" />
                      <circle cx="5.5" cy="8" r="1.2" />
                      <circle cx="10.5" cy="8" r="1.2" />
                      <circle cx="5.5" cy="12" r="1.2" />
                      <circle cx="10.5" cy="12" r="1.2" />
                    </svg>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggle(testimonial.id)}
                    className="flex-1 flex items-center text-left hover:brightness-95 transition-all px-3 py-3 min-w-0"
                  >
                    <span className="text-3xl font-bold text-gray-200 w-10 shrink-0 leading-none select-none">
                      {index + 1}
                    </span>
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1 ml-3">
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {testimonial.author.name || <span className="text-gray-400 italic">Unnamed</span>}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {testimonial.associatedRole.company || "—"} · {testimonial.date || "—"}
                      </span>
                    </div>
                    {validation && !validation.valid && (
                      <span className="ml-3 shrink-0 text-xs text-red-500 font-medium">
                        {validation.errors.length} error{validation.errors.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    <svg
                      className={`ml-3 shrink-0 w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    title="Remove recommendation"
                    className="shrink-0 px-3 py-3 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 011-1h4a1 1 0 011 1m-7 0H5m14 0h-2" />
                    </svg>
                  </button>
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-white">
                    <TestimonialForm
                      value={testimonial}
                      onChange={(updated) => update(index, updated)}
                    />
                  </div>
                )}
              </div>

              {showLineBelow && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full z-10 translate-y-1" />}
            </div>
          );
        })}

        <button
          type="button"
          onClick={add}
          className="mt-1 flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add recommendation
        </button>
      </div>
    </section>
  );
}