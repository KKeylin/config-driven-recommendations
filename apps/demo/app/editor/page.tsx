"use client";

import React, { useRef, useState } from "react";
import {
  TestimonialsEditor,
  Toolbar,
  ExportPanel,
  ImportPanel,
  ConfirmModal,
} from "@config-driven-testimonials/editor";
import type { PanelId } from "@config-driven-testimonials/editor";
import { TestimonialsWidget, parseConfig } from "config-driven-testimonials";
import initialConfigJson from "./editor.defaultConfig.json";
import type { TestimonialConfig } from "config-driven-testimonials";

const initialConfig = parseConfig(initialConfigJson);

function EditorNotice(): React.ReactElement {
  return (
    <div className="mb-6 flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 px-4 py-3">
      <svg className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-amber-700 dark:text-amber-300">
          Changes here <strong>won&apos;t affect the demo site.</strong> This is a config builder —
          use <strong>Export</strong> to download your <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1 rounded">testimonials.config.json</code>,
          then load it into your own project alongside the <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1 rounded">config-driven-testimonials</code> package.
        </p>
      </div>
      <div className="group relative shrink-0">
        <svg className="w-4 h-4 text-amber-400 dark:text-amber-500 cursor-default" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
        </svg>
        <div className="absolute right-0 top-6 z-50 hidden group-hover:block w-72 rounded-lg bg-gray-900 px-4 py-3 text-xs text-gray-200 shadow-xl">
          <p className="font-semibold text-white mb-1">How this works</p>
          <p>This editor helps you configure the <code className="text-amber-300">TestimonialsWidget</code> component. It&apos;s not a CMS — it&apos;s a visual config builder.</p>
          <p className="mt-2">Your workflow:</p>
          <ol className="mt-1 ml-3 list-decimal space-y-1 text-gray-300">
            <li>Fill in your data here</li>
            <li>Export the JSON config</li>
            <li>Add it to your project</li>
            <li>Pass it to <code className="text-amber-300">{'<TestimonialsWidget config={...} />'}</code></li>
          </ol>
          <div className="absolute -top-1.5 right-1 w-3 h-3 rotate-45 bg-gray-900" />
        </div>
      </div>
    </div>
  );
}

const EMPTY_CONFIG: TestimonialConfig = {
  author: { name: "", title: "" },
  testimonials: [],
};

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function EditorPage() {
  const [config, setConfig] = useState<TestimonialConfig>(initialConfig);
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [activeTestimonialId, setActiveTestimonialId] = useState<string | null>(null);
  const [systemDark, setSystemDark] = useState(false);
  const previewRef = useRef<HTMLElement>(null);

  React.useEffect(() => {
    const html = document.documentElement;
    const update = () => setSystemDark(html.classList.contains('dark'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  function scrollPreviewTo(targetScrollTop: number): void {
    const container = previewRef.current;
    if (!container) return;
    const c = container;
    const start = c.scrollTop;
    const duration = 700;
    const startTime = performance.now();
    function tick(now: number): void {
      const progress = Math.min((now - startTime) / duration, 1);
      c.scrollTop = start + (targetScrollTop - start) * easeInOutCubic(progress);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function handleAuthorFocus(): void {
    scrollPreviewTo(0);
  }

  function handleRecommendationOpen(id: string | null): void {
    setActiveTestimonialId(id);
    if (!id) return;
    setTimeout(() => {
      const el = previewRef.current?.querySelector<HTMLElement>(`[data-testimonial-id="${id}"]`);
      const container = previewRef.current;
      if (!el || !container) return;
      const c = container;
      const end = c.scrollTop + (el.getBoundingClientRect().top - c.getBoundingClientRect().top) - 24;
      const start = c.scrollTop;
      const duration = 700;
      const startTime = performance.now();
      function tick(now: number): void {
        const progress = Math.min((now - startTime) / duration, 1);
        c.scrollTop = start + (end - start) * easeInOutCubic(progress);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, 16);
  }

  function handleImport(imported: TestimonialConfig): void {
    setConfig(imported);
    setActivePanel(null);
  }

  function handleClearConfirm(): void {
    setConfig(EMPTY_CONFIG);
    setShowClearModal(false);
  }

  return (
    <>
      <Toolbar
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        exportPanel={<ExportPanel config={config} />}
        importPanel={<ImportPanel onApply={handleImport} />}
        onClearRequest={() => setShowClearModal(true)}
        backHref="/"
      />
      <div className="flex h-screen pt-12 overflow-hidden">
        <aside className={`w-1/2 overflow-y-auto border-r p-6 ${systemDark ? 'light bg-white border-zinc-200' : 'dark bg-zinc-900 border-zinc-700'}`}>
          <EditorNotice />
          <TestimonialsEditor
            value={config}
            onChange={setConfig}
            showValidation={activePanel === "export"}
            onRecommendationOpen={handleRecommendationOpen}
            onAuthorFocus={handleAuthorFocus}
          />
        </aside>
        <main
          ref={previewRef}
          className="w-1/2 overflow-y-auto p-6 bg-gray-50 dark:bg-zinc-950"
          {...(config.theme?.backgroundColor ? { style: { backgroundColor: config.theme.backgroundColor } } : {})}
        >
          <TestimonialsWidget config={config} activeTestimonialId={activeTestimonialId ?? undefined} />
        </main>
      </div>
      {showClearModal && (
        <ConfirmModal
          title="Clear all data?"
          description="This will remove the author info and all recommendations. This action cannot be undone."
          confirmLabel="Clear data"
          onConfirm={handleClearConfirm}
          onCancel={() => setShowClearModal(false)}
        />
      )}
    </>
  );
}
