"use client";

import { startPaymentFlow } from "@/services/payments";
import { getOrderPaymentData } from "@/app/actions/orders";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useState } from "react";

interface RetryPaymentButtonProps {
  orderNumber: string; // Ej: "MZ-281095"
}

export default function RetryPaymentButton({ orderNumber }: RetryPaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Obtener datos frescos + firma de integridad desde el servidor
      const paymentData = await getOrderPaymentData(orderNumber);

      if (!paymentData.success || "error" in paymentData) {
        setError("No se pudo obtener los datos del pedido. Inténtalo de nuevo.");
        return;
      }

      // 2. Lanzar Wompi con todos los datos correctos
      const redirectUrl = `${window.location.origin}/pedidos/${orderNumber}`;
      await startPaymentFlow("WOMPI", {
        amountInCents: paymentData.amountInCents!,
        currency: "COP",
        reference: paymentData.reference!,
        customerEmail: paymentData.customerEmail || "",
        customerFullName: paymentData.customerName || "",
        customerPhone: paymentData.customerPhone || "",
        redirectUrl,
        signature: paymentData.signature || undefined,
      });
    } catch (err) {
      console.error("Error al reintentar pago:", err);
      setError("Error inesperado. Por favor recarga la página e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleRetry}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-black text-sm uppercase tracking-widest px-6 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
      >
        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        {loading ? "Preparando pago..." : "Reintentar Pago"}
      </button>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
}
