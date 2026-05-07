"use client";

import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

export function InputGroup({
  label,
  register,
  error,
  placeholder,
  type = "text",
}: {
  label: string;
  register: UseFormRegisterReturn;
  error?: { message?: string } | undefined;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
        {label}
      </label>
      <input
        {...register}
        type={type}
        placeholder={placeholder}
        className={`w-full px-6 py-4 bg-zinc-50 border rounded-2xl outline-none transition-all font-bold text-zinc-900 placeholder:text-zinc-300 focus:ring-2 focus:ring-[var(--moiz-green)]/20 ${error ? "border-red-500" : "border-zinc-100"}`}
      />
      {error && <p className="text-red-500 text-[10px] font-bold px-1">{error.message}</p>}
    </div>
  );
}

export function PaymentOption({
  active,
  onClick,
  icon,
  label,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-6 border rounded-[2rem] flex flex-col gap-3 text-left transition-all ${active ? "border-[var(--moiz-green)] bg-[var(--moiz-green)]/5 scale-[1.02]" : "border-zinc-100 bg-zinc-50 opacity-60 hover:opacity-100"}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? "bg-[var(--moiz-green)] text-white" : "bg-zinc-200 text-zinc-500"}`}
      >
        {icon}
      </div>
      <div>
        <p className="font-black text-zinc-900 leading-none mb-1">{label}</p>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          {description}
        </p>
      </div>
    </button>
  );
}

export function StepHeader({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] rounded-lg flex items-center justify-center">
        <Icon size={18} />
      </div>
      <h3 className="text-xl font-black text-zinc-900 tracking-tight">{title}</h3>
    </div>
  );
}

export function CheckboxGroup({ label, register }: { label: string; register: UseFormRegisterReturn }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative flex items-center">
        <input type="checkbox" {...register} className="peer sr-only" />
        <div className="w-6 h-6 border-2 border-zinc-200 rounded-lg peer-checked:bg-[var(--moiz-green)] peer-checked:border-[var(--moiz-green)] transition-all"></div>
        <CheckCircle2
          size={16}
          className="absolute left-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
        />
      </div>
      <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900 transition-colors">
        {label}
      </span>
    </label>
  );
}
