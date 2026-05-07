"use client";

import { useState } from "react";
import { getPublicInvoice } from "@/app/actions/orders";
import { toast } from "sonner";
import { X, ShieldCheck } from "lucide-react";

export default function DownloadInvoiceButton({
  orderNumber,
  customerNit,
  customerPhone,
}: {
  orderNumber: string;
  customerNit: string;
  customerPhone: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "generating">("idle");
  const [showModal, setShowModal] = useState(false);
  const [lastFour, setLastFour] = useState("");

  const maskedPhone = customerPhone.length >= 4 
    ? `${customerPhone.slice(0, -4).replace(/./g, "*")} ****` 
    : "****";
  
  // Una versión más amigable que muestra el inicio si es largo:
  const friendlyMask = customerPhone.length > 7
    ? `${customerPhone.slice(0, 3)} ${customerPhone.slice(3, 6)} ****`
    : "**** ****";

  const handleValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const actualLastFour = customerPhone.replace(/\D/g, "").slice(-4);
    
    if (lastFour !== actualLastFour) {
      toast.error("Los 4 dígitos no coinciden. Inténtalo de nuevo.");
      return;
    }

    setShowModal(false);
    handleDownload();
  };

  const handleDownload = async () => {
    setStatus("loading");
    try {
      const invoiceData = await getPublicInvoice(orderNumber, customerNit);

      if (!invoiceData) {
        toast.error("La factura aún no está disponible");
        setStatus("idle");
        return;
      }

      setStatus("generating");

      const { pdf } = await import("@react-pdf/renderer");
      const { default: InvoicePDF } = await import("./InvoicePDF");

      const blob = await pdf(
        <InvoicePDF invoice={invoiceData} order={invoiceData.order} />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Factura-${invoiceData.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Factura descargada con éxito");
    } catch (err) {
      console.error("PDF Generation Error:", err);
      toast.error("Error al generar el PDF");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={status !== "idle"}
        className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap shadow-lg ${
          status !== "idle"
            ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
            : "bg-zinc-900 text-white shadow-zinc-900/10 hover:scale-105 hover:bg-zinc-800"
        }`}
      >
        <div className="relative w-3.5 h-3.5 flex items-center justify-center">
          {status !== "idle" ? (
            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          )}
        </div>

        <span>
          {status === "loading"
            ? "Buscando..."
            : status === "generating"
              ? "Generando..."
              : "Solicitar Factura"}
        </span>
      </button>

      {/* Modal de Validación */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-zinc-100 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-moiz-green/10 rounded-2xl flex items-center justify-center text-moiz-green">
                <ShieldCheck size={24} />
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-zinc-100 rounded-xl transition-colors"
              >
                <X size={20} className="text-zinc-400" />
              </button>
            </div>

            <h3 className="text-xl font-black text-zinc-900 mb-2 tracking-tight">
              Verifica tu Identidad
            </h3>
            <p className="text-zinc-500 text-sm font-medium mb-8 leading-relaxed">
              Para descargar la factura, ingresa los últimos 4 dígitos del teléfono registrado: 
              <span className="block mt-1 text-zinc-900 font-bold tracking-widest">{friendlyMask}</span>
            </p>

            <form onSubmit={handleValidation} className="space-y-4">
              <input
                type="text"
                maxLength={4}
                required
                placeholder="0000"
                value={lastFour}
                onChange={(e) => setLastFour(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-center text-2xl font-black tracking-[1em] focus:ring-2 focus:ring-moiz-green outline-none transition-all placeholder:tracking-normal placeholder:text-zinc-300"
                autoFocus
              />
              <button
                type="submit"
                disabled={status !== "idle"}
                className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-zinc-900/10 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {status !== "idle" && <Loader2 className="animate-spin" size={18} />}
                {status !== "idle" ? "Generando..." : "Confirmar y Descargar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
