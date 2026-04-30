import { ReactElement, ReactNode } from "react";

export type PanelId = "export" | "import";

export interface ToolbarProps {
  activePanel: PanelId | null;
  onPanelChange: (id: PanelId | null) => void;
  exportPanel?: ReactNode;
  importPanel?: ReactNode;
  onClearRequest?: () => void;
  backHref?: string;
}

export function Toolbar({ activePanel, onPanelChange, exportPanel, importPanel, onClearRequest, backHref }: ToolbarProps): ReactElement {
  function toggle(id: PanelId): void {
    onPanelChange(activePanel === id ? null : id);
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center gap-2 px-6 h-12 bg-slate-800">
        <span className="text-sm font-semibold text-slate-300 mr-4">Recommendations Editor</span>
        <ToolbarButton active={activePanel === "export"} onClick={() => toggle("export")}>
          Export…
        </ToolbarButton>
        <ToolbarButton active={activePanel === "import"} onClick={() => toggle("import")}>
          Import…
        </ToolbarButton>
        {onClearRequest && (
          <>
            <div className="mx-2 h-4 w-px bg-slate-600" />
            <button
              type="button"
              onClick={onClearRequest}
              className="px-3 py-1.5 rounded-md text-sm font-medium text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
            >
              Clear data
            </button>
          </>
        )}
        {backHref && (
          <a
            href={backHref}
            className="ml-auto flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </a>
        )}
      </div>

      <div
        className={`fixed top-12 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg overflow-hidden transition-all duration-200 ease-in-out ${
          activePanel ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {activePanel === "export" && (
          <div className="px-6 py-5">
            {exportPanel ?? <p className="text-sm text-gray-400">Export panel — coming soon</p>}
          </div>
        )}
        {activePanel === "import" && (
          <div className="px-6 py-5">
            {importPanel ?? <p className="text-sm text-gray-400">Import panel — coming soon</p>}
          </div>
        )}
      </div>
    </>
  );
}

interface ToolbarButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

function ToolbarButton({ active, onClick, children }: ToolbarButtonProps): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-slate-600 text-white"
          : "text-slate-300 hover:bg-slate-700 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}