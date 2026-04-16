"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  required?: boolean;
  onUrlChange?: (url: string) => void;
}

type Phase = "idle" | "uploading" | "processing" | "done" | "error";

export default function ImageUpload({
  name,
  defaultValue = "",
  required,
  onUrlChange,
}: ImageUploadProps) {
  // previewUrl  = what the user sees (local temp URL or final Cloudinary URL)
  // cloudinaryUrl = value stored in the hidden input → sent to the form/DB
  const [previewUrl, setPreviewUrl] = useState(defaultValue);
  const [cloudinaryUrl, setCloudinaryUrl] = useState(defaultValue);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes");
      return;
    }

    setError("");
    setWarning("");
    setCloudinaryUrl(""); // Clear previous Cloudinary URL while processing

    // ── Phase 1: Save locally and show preview immediately ──────────────────
    setPhase("uploading");

    let filename: string;
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al guardar");

      filename = data.filename;
      setPreviewUrl(data.tempUrl); // Ahora es una URL de Cloudinary (temp)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen");
      setPhase("error");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // ── Phase 2: Remove background + upload to Cloudinary (background) ──────
    setPhase("processing");

    try {
      const res = await fetch("/api/upload/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });

      const data = await res.json();

      if (data.warning) setWarning(data.warning);

      if (!res.ok && !data.keepLocal) {
        throw new Error(data.error || "Error al procesar");
      }

      const finalUrl = data.transparentUrl || data.url || data.tempUrl;
      setPreviewUrl(finalUrl);
      setCloudinaryUrl(finalUrl);
      onUrlChange?.(finalUrl);
      setPhase("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar la imagen");
      setPhase("error");
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = () => {
    setPreviewUrl("");
    setCloudinaryUrl("");
    setPhase("idle");
    setError("");
    setWarning("");
  };

  const isProcessing = phase === "uploading" || phase === "processing";

  return (
    <div className="space-y-3">
      {/* Hidden field — only has a value once Cloudinary URL is ready */}
      <input type="hidden" name={name} value={cloudinaryUrl} required={required} />

      {/* Preview area */}
      {previewUrl ? (
        <div className="relative w-full h-40 bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden flex items-center justify-center">
          <Image
            src={previewUrl}
            alt="Vista previa"
            fill
            className="object-contain p-4"
            unoptimized
          />

          {/* Processing overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-2 rounded-2xl">
              <Loader2 size={28} className="animate-spin text-white" />
              <span className="text-white text-xs font-black uppercase tracking-widest">
                {phase === "uploading" ? "Guardando..." : "Quitando fondo..."}
              </span>
            </div>
          )}

          {/* Done badge */}
          {phase === "done" && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-[var(--moiz-green)] text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow">
              <CheckCircle2 size={12} />
              Listo
            </div>
          )}

          {/* Remove button — disabled while processing */}
          {!isProcessing && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div className="w-full h-40 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-zinc-400">
          <ImageIcon size={28} />
          <span className="text-xs font-bold">Sin imagen</span>
        </div>
      )}

      {/* Upload button */}
      <label
        className={`flex items-center justify-center gap-2 w-full p-3 bg-zinc-50 border border-zinc-200 rounded-2xl transition-all group ${
          isProcessing
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-[var(--moiz-green)]/50 hover:bg-[var(--moiz-green)]/5"
        }`}
      >
        {phase === "uploading" && (
          <>
            <Loader2 size={16} className="animate-spin text-[var(--moiz-green)]" />
            <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
              Guardando imagen...
            </span>
          </>
        )}
        {phase === "processing" && (
          <>
            <Sparkles size={16} className="text-[var(--moiz-green)] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-[var(--moiz-green)]">
              Quitando fondo · Subiendo a nube...
            </span>
          </>
        )}
        {(phase === "idle" || phase === "done" || phase === "error") && (
          <>
            <Upload
              size={16}
              className="text-zinc-400 group-hover:text-[var(--moiz-green)] transition-colors"
            />
            <span className="text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-[var(--moiz-green)] transition-colors">
              {cloudinaryUrl ? "Cambiar imagen" : "Subir imagen"}
            </span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
      </label>

      {/* Status messages */}
      {error && (
        <p className="flex items-center gap-1 text-red-500 text-xs font-bold pl-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
      {warning && !error && (
        <p className="flex items-center gap-1 text-amber-500 text-xs font-bold pl-1">
          <AlertCircle size={12} />
          {warning}
        </p>
      )}
      {phase === "processing" && (
        <p className="text-zinc-400 text-xs pl-1">
          Puedes continuar llenando el formulario, la imagen se actualizará automáticamente.
        </p>
      )}
    </div>
  );
}
