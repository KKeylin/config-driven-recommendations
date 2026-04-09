import React, { useRef, useState } from "react";

export interface AvatarUploadProps {
  value: string | undefined;
  name?: string;
  onChange: (value: string | undefined) => void;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
}

function resizeToBase64(file: File, size = 128): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("No canvas context")); return; }
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function AvatarUpload({ value, name, onChange }: AvatarUploadProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showUrlField, setShowUrlField] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File): Promise<void> {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    setError(null);
    try {
      const base64 = await resizeToBase64(file);
      onChange(base64);
    } catch {
      setError("Failed to process image");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent): void {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-gray-600">Avatar</span>
      <div className="flex items-center gap-4">
        {/* Preview */}
        <div
          className="w-16 h-16 rounded-full shrink-0 overflow-hidden ring-2 ring-gray-100 cursor-pointer"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          title="Click or drop to upload"
        >
          {value ? (
            <img src={value} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-lg font-semibold">
              {getInitials(name ?? "")}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm text-blue-500 hover:text-blue-600 transition-colors text-left"
          >
            {value ? "Replace photo" : "Upload photo"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors text-left"
            >
              Remove
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowUrlField((v) => !v)}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors text-left"
          >
            {showUrlField ? "Hide URL field" : "Or enter URL"}
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {showUrlField && (
        <input
          type="text"
          placeholder="https://... or data:image/..."
          value={typeof value === "string" && value.startsWith("http") ? value : ""}
          onChange={(e) => onChange(e.target.value || undefined)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}