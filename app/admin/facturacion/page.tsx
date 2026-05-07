"use client";

import { useState } from "react";
import { getInvoicesReport } from "@/app/actions/billing";
import {
  Download,
  Table,
  Calendar as CalendarIcon,
  FileSpreadsheet,
  Loader2,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function BillingAdminPage() {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const downloadReport = async () => {
    setLoading(true);
    try {
      const data = await getInvoicesReport(startDate || undefined, endDate || undefined);

      if (data.length === 0) {
        toast.error("No se encontraron facturas en este rango.");
        return;
      }

      // Generate CSV
      const headers = [
        "Factura",
        "Pedido",
        "Fecha",
        "Cliente",
        "NIT",
        "Email",
        "Subtotal",
        "Descuento",
        "Total",
        "Items",
      ];
      const csvRows = [
        headers.join(","),
        ...data.map((row) =>
          [
            row.factura,
            row.pedido,
            row.fecha,
            `"${row.cliente}"`,
            row.nit,
            row.email,
            row.subtotal,
            row.descuento,
            row.total,
            `"${row.items}"`,
          ].join(","),
        ),
      ];

      const csvContent = "\uFEFF" + csvRows.join("\n"); // Add BOM for Excel UTF-8 support
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `Reporte_Facturacion_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Reporte generado con éxito");
    } catch (err) {
      toast.error("Error al generar el reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#FAF9F6] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white">
      <div className="flex-1 pt-12 px-6 max-w-5xl mx-auto w-full pb-24">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-zinc-400 font-bold text-sm hover:text-[var(--moiz-green)] transition-colors group mb-8"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver al panel
        </Link>

        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <FileSpreadsheet size={14} /> Contabilidad Möiz
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter mb-4">
            Resumen de <span className="text-[var(--moiz-green)]">Facturación</span>
          </h1>
          <p className="text-zinc-500 font-medium max-w-lg">
            Genera reportes de todas las facturas emitidas para tu gestión contable o fiscal.
          </p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-zinc-100 mb-12">
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100">
                <CalendarIcon size={24} className="text-zinc-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-zinc-900">Rango de Fecha</h3>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                  Opcional para filtrar
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">
                  Desde
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-[1.2rem] outline-none focus:ring-4 focus:ring-[var(--moiz-green)]/15 focus:border-[var(--moiz-green)] transition-all font-bold text-zinc-900"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">
                  Hasta
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-[1.2rem] outline-none focus:ring-4 focus:ring-[var(--moiz-green)]/15 focus:border-[var(--moiz-green)] transition-all font-bold text-zinc-900"
                />
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 text-zinc-400">
                <Table size={20} />
                <span className="text-sm font-medium">Formato compatible con Excel (.csv)</span>
              </div>
              <button
                onClick={downloadReport}
                disabled={loading}
                className="w-full md:w-auto px-10 py-5 bg-zinc-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-zinc-900/20 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                {loading ? "Generando..." : "Descargar Reporte"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-zinc-100 shadow-sm shrink-0">
              <ChevronRight size={18} className="text-[var(--moiz-green)]" />
            </div>
            <div>
              <h4 className="font-black text-zinc-900 mb-1">Automatizado</h4>
              <p className="text-xs font-medium text-zinc-500 leading-relaxed italic">
                Solo se incluyen facturas de pedidos marcados como &quot;Pagado&quot;.
              </p>
            </div>
          </div>
          <div className="p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-zinc-100 shadow-sm shrink-0">
              <ChevronRight size={18} className="text-[var(--moiz-green)]" />
            </div>
            <div>
              <h4 className="font-black text-zinc-900 mb-1">Detalle Legal</h4>
              <p className="text-xs font-medium text-zinc-500 leading-relaxed italic">
                El archivo incluye NIT, base imponible y desglose de items para tu contador.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
