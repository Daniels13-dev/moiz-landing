import prisma from "@/lib/prisma";
import { Clock, Calendar, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import SubscriptionReminderCard from "./SubscriptionReminderCard";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptions() {
  const reminders = await prisma.subscriptionReminder.findMany({
    orderBy: { reminderDate: "asc" },
    include: {
      user: {
        include: {
          addresses: true,
        },
      },
      product: true,
    },
  });

  const pending = reminders.filter((r) => r.status === "pendiente");
  const completed = reminders.filter((r) => r.status === "completado");

  return (
    <div className="max-w-7xl mx-auto px-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-zinc-400 font-bold text-sm hover:text-[var(--moiz-green)] transition-colors group mb-8"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Volver al panel
      </Link>

      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-5xl font-black text-zinc-900 tracking-tighter mb-2">Suscripciones</h1>
          <p className="text-zinc-500 font-medium text-lg">
            Recordatorios y gestión de ventas recurrentes.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-4 rounded-3xl border border-zinc-100 shadow-sm flex flex-col items-center gap-1">
            <span className="text-[10px] font-black uppercase text-zinc-400">Pendientes</span>
            <span className="text-2xl font-black text-zinc-900 leading-none">{pending.length}</span>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl border border-zinc-100 shadow-sm flex flex-col items-center gap-1">
            <span className="text-[10px] font-black uppercase text-zinc-400">Completadas</span>
            <span className="text-2xl font-black text-[var(--moiz-green)] leading-none">
              {completed.length}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-8 pb-20">
        <section>
          <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
            <Clock className="text-zinc-400" size={24} /> Próximos Recordatorios
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pending.length > 0 ? (
              pending.map((reminder) => (
                <SubscriptionReminderCard key={reminder.id} reminder={reminder} />
              ))
            ) : (
              <div className="col-span-full py-20 bg-white border border-dashed border-zinc-200 rounded-[3rem] text-center">
                <Calendar size={48} className="mx-auto text-zinc-200 mb-4" />
                <p className="text-zinc-400 font-bold">No hay recordatorios pendientes.</p>
              </div>
            )}
          </div>
        </section>

        {completed.length > 0 && (
          <section className="pt-20 border-t border-zinc-100">
            <h2 className="text-2xl font-black text-zinc-300 mb-6 flex items-center gap-3">
              <ShieldCheck className="text-zinc-200" size={24} /> Historial de Entregas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
              {completed.map((reminder) => (
                <SubscriptionReminderCard key={reminder.id} reminder={reminder} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
