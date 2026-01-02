import React, { useCallback, useState } from "react";
import {
  UploadCloud,
  FileType,
  Check,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { ExplanationStyle, DocumentInputState } from "../types";

interface DocumentInputProps {
  isLoading: boolean;
  onSubmit: (input: DocumentInputState) => void;
  error?: string | null;
}

export const DocumentInput: React.FC<DocumentInputProps> = ({
  isLoading,
  onSubmit,
  error,
}) => {
  const [state, setState] = useState<DocumentInputState>({
    text: "",
    file: null,
    fileBase64: null,
    style: ExplanationStyle.SIMPLE_30_SEC,
  });

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      setState((prev) => ({ ...prev, file, fileBase64: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  }, []);

  const handleSubmit = () => {
    if (!state.text.trim() && !state.file) return;
    onSubmit(state);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          <textarea
            className="w-full h-48 p-4 bg-slate-50 border rounded-xl resize-none"
            placeholder="Paste the confusing text here..."
            value={state.text}
            onChange={(e) =>
              setState((p) => ({ ...p, text: e.target.value }))
            }
            disabled={isLoading}
          />

          {!state.file && (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer ${
                dragActive ? "border-brand-500 bg-brand-50" : "border-slate-200"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() =>
                document.getElementById("file-upload")?.click()
              }
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*,application/pdf"
                onChange={(e) =>
                  e.target.files && processFile(e.target.files[0])
                }
              />
              <UploadCloud className="mx-auto mb-2" />
              <p className="text-sm">Upload image or PDF</p>
            </div>
          )}

          {state.file && (
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
              <span className="text-sm">{state.file.name}</span>
              <button onClick={() => setState((p) => ({ ...p, file: null, fileBase64: null }))}>
                <X />
              </button>
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              [ExplanationStyle.SIMPLE_30_SEC, "30 Second Summary"],
              [ExplanationStyle.ELI5, "Explain like I'm 15"],
              [ExplanationStyle.ACTION_ONLY, "Action Items Only"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setState((p) => ({ ...p, style: id }))}
                className={`p-3 rounded-xl border ${
                  state.style === id
                    ? "border-brand-500 text-brand-600"
                    : "border-slate-200"
                }`}
              >
                {label}
                {state.style === id && <Check className="inline ml-2" />}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading || (!state.text && !state.file)}
            className="w-full py-4 rounded-xl bg-brand-600 text-white font-bold disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex justify-center gap-2">
                <Loader2 className="animate-spin" /> Analyzing…
              </span>
            ) : (
              "Explain Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
