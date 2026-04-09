import { cn } from "@/lib/utils";

export type OrderStatus =
  | "pendiente"
  | "pagado"
  | "enviado"
  | "entregado"
  | "cancelado";

const statusConfig = {
  pendiente: {
    label: "Pendiente",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  pagado: {
    label: "Pagado",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  enviado: {
    label: "Enviado",
    className: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  entregado: {
    label: "Entregado",
    className: "bg-zinc-100 text-zinc-700 border-zinc-200",
    dot: "bg-zinc-500",
  },
  cancelado: {
    label: "Cancelado",
    className: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};

export default function OrderStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const config = statusConfig[status as OrderStatus] || statusConfig.pendiente;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
        config.className,
        className,
      )}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full animate-pulse", config.dot)}
      />
      {config.label}
    </span>
  );
}
