"use client";

import { type ReactNode } from "react";

export function PaymentOption({
  active,
  onClick,
  icon,
  label,
  description,
  details,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  description?: string;
  details?: ReactNode;
}) {
  return (
    <div
      role="button"
      onClick={onClick}
      className={`border-2 rounded-[2rem] flex flex-col md:flex-row transition-all cursor-pointer overflow-hidden ${
        active
          ? "border-[var(--moiz-green)] bg-white shadow-2xl shadow-[var(--moiz-green)]/10"
          : "border-zinc-50 bg-zinc-50/30 opacity-60 hover:opacity-100 hover:shadow-xl hover:bg-white"
      }`}
    >
      <div className={`p-4 md:p-8 flex items-center gap-5 text-left transition-all ${active && details ? "md:border-r border-zinc-100 md:min-w-[280px]" : "w-full"}`}>
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors flex-shrink-0 ${
            active ? "bg-[var(--moiz-green)] text-zinc-950" : "bg-zinc-100 text-zinc-400"
          }`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-black text-zinc-900 text-lg md:text-xl tracking-tight leading-tight mb-1">
            {label}
          </p>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-tight">
            {description}
          </p>
        </div>
      </div>

      {active && details && (
        <div className="flex-1 p-6 md:p-8 bg-zinc-50/30 animate-in fade-in slide-in-from-left-4 duration-500 flex items-center">
          <div className="w-full">
            {details}
          </div>
        </div>
      )}
    </div>
  );
}

export function BillingSelection({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <div
      role="button"
      onClick={onClick}
      className={`w-full p-8 border-2 rounded-[2rem] flex items-center justify-between transition-all cursor-pointer ${
        active
          ? "border-[var(--moiz-green)] bg-white shadow-lg"
          : "border-zinc-50 bg-zinc-50/30 opacity-60"
      }`}
    >
      <div className="flex items-center gap-5">
        <div
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
            active ? "border-[var(--moiz-green)]" : "border-zinc-300"
          }`}
        >
          {active && (
            <div className="w-3 h-3 bg-[var(--moiz-green)] rounded-full animate-scale-in" />
          )}
        </div>
        <span className="font-black text-zinc-900">{label}</span>
      </div>
    </div>
  );
}

export function ShippingOption({
  active,
  onClick,
  icon,
  label,
  description,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <div
      role="button"
      onClick={!disabled ? onClick : undefined}
      className={`w-full p-4 md:p-6 border-2 rounded-[2rem] flex items-center gap-4 text-left transition-all ${
        active
          ? "border-[var(--moiz-green)] bg-white shadow-2xl shadow-[var(--moiz-green)]/10 cursor-default"
          : disabled
            ? "border-zinc-50 bg-zinc-100/50 opacity-40 cursor-not-allowed"
            : "border-zinc-50 bg-zinc-50/30 hover:opacity-100 hover:shadow-xl hover:bg-white cursor-pointer"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
          active ? "bg-[var(--moiz-green)] text-zinc-950" : "bg-zinc-100 text-zinc-400"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-black text-zinc-900 text-base md:text-lg leading-tight mb-1">
          {label}
        </p>
        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-tight">
          {description}
        </p>
      </div>
    </div>
  );
}
