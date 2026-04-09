import React, { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { ChevronDown } from "lucide-react";

interface InputGroupProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: { message?: string };
  placeholder?: string;
  type?: string;
  className?: string;
}

export function InputGroup({
  label,
  register,
  error,
  placeholder,
  type = "text",
  className = "",
}: InputGroupProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">
        {label}
      </label>
      <input
        {...register}
        type={type}
        placeholder={placeholder}
        className={`w-full px-8 py-5 bg-zinc-50/50 border rounded-[1.5rem] outline-none transition-all font-bold text-zinc-900 placeholder:text-zinc-300 focus:bg-white focus:ring-4 focus:ring-[var(--moiz-green)]/15 ${error ? "border-red-500 bg-red-50/50" : "border-zinc-100 hover:border-zinc-300"}`}
      />
      {error && (
        <p className="text-red-500 text-[11px] font-black px-1 uppercase tracking-tight">
          {error.message}
        </p>
      )}
    </div>
  );
}

interface SelectInputGridProps {
  label: string;
  selectName: string;
  inputName: string;
  selectRegister: UseFormRegisterReturn;
  inputRegister: UseFormRegisterReturn;
  options: { label: string | ReactNode; value: string }[];
  placeholder?: string;
  type?: string;
  error?: { message?: string };
}

export function SelectInputGrid({
  label,
  selectRegister,
  inputRegister,
  options,
  placeholder,
  type = "text",
  error,
}: SelectInputGridProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">
        {label}
      </label>
      <div className="grid grid-cols-12 gap-3">
        <div className="relative col-span-4">
          <select
            {...selectRegister}
            className="w-full h-[62px] pl-5 pr-8 rounded-[1.5rem] bg-zinc-50/50 border border-zinc-100 focus:bg-white focus:border-[var(--moiz-green)] outline-none transition-all font-bold text-zinc-900 cursor-pointer appearance-none"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
        </div>
        <input
          {...inputRegister}
          type={type}
          placeholder={placeholder}
          className={`col-span-8 h-[62px] px-8 rounded-[1.5rem] bg-zinc-50/50 border outline-none transition-all font-bold text-zinc-900 placeholder:text-zinc-300 focus:bg-white focus:border-[var(--moiz-green)] ${error ? "border-red-500 bg-red-50/50" : "border-zinc-100 hover:border-zinc-300"}`}
        />
      </div>
      {error && (
        <p className="text-red-500 text-[11px] font-black px-1 uppercase tracking-tight">
          {error.message}
        </p>
      )}
    </div>
  );
}
