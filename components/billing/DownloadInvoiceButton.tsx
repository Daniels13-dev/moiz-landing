"use client";

import { useState } from "react";
import { getPublicInvoice } from "@/app/actions/orders";
import { toast } from "sonner";

export default function DownloadInvoiceButton({
  orderNumber,
  customerNit,
}: {
  orderNumber: string;
  customerNit: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "generating">("idle");

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
    <button
      onClick={handleDownload}
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
  );
}
