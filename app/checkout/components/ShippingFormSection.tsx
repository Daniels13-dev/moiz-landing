"use client";

import { MapPin, Info, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InputGroup, SelectInputGrid, SelectGroup } from "@/components/ui/FormInput";
import { countries, idTypes, COLOMBIA_REGIONS } from "@/config/constants";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CheckoutFormValues } from "../lib/schema";

interface ShippingFormSectionProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  user: unknown;
  customerState: string;
  availableCustomerCities: string[];
  showSaveInfoPopover: boolean;
  setShowSaveInfoPopover: (show: boolean) => void;
}

export default function ShippingFormSection({
  register,
  errors,
  user,
  customerState,
  availableCustomerCities,
  showSaveInfoPopover,
  setShowSaveInfoPopover,
}: ShippingFormSectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] rounded-2xl flex items-center justify-center">
          <MapPin size={24} />
        </div>
        <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Datos de Envío</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputGroup
          label="Nombre"
          register={register("customerName")}
          error={errors.customerName}
          placeholder="Ej. Juan"
        />
        <InputGroup
          label="Apellidos"
          register={register("customerLastName")}
          error={errors.customerLastName}
          placeholder="Ej. Pérez"
        />
        <div className="md:col-span-2">
          <InputGroup
            label="Correo Electrónico"
            register={register("customerEmail")}
            error={errors.customerEmail}
            placeholder="ejemplo@correo.com"
            type="email"
          />
        </div>

        <SelectInputGrid
          label="Cédula o NIT"
          selectRegister={register("customerIdType")}
          inputRegister={register("customerNit")}
          options={idTypes}
          placeholder="123456789"
          error={errors.customerNit}
        />

        <SelectInputGrid
          label="Teléfono"
          selectRegister={register("customerPhoneCountry")}
          inputRegister={register("customerPhone")}
          options={countries.map((c) => ({
            label: `${c.flag} ${c.code}`,
            value: c.code,
          }))}
          placeholder="321 000 0000"
          type="tel"
          error={errors.customerPhone}
        />
        <InputGroup
          label="Dirección"
          register={register("customerAddress")}
          error={errors.customerAddress}
          placeholder="Calle 123 #45-67"
        />
        <InputGroup
          label="Casa, Apto (Opcional)"
          register={register("customerDetails")}
          error={errors.customerDetails}
          placeholder="Edificio Möiz, Apto 502"
        />
        <SelectGroup
          label="Departamento"
          register={register("customerState")}
          options={Object.keys(COLOMBIA_REGIONS).map((d) => ({ label: d, value: d }))}
          error={errors.customerState}
        />
        <SelectGroup
          label="Ciudad / Municipio"
          register={register("customerCity")}
          options={availableCustomerCities.map((c) => ({ label: c, value: c }))}
          disabled={!customerState}
          error={errors.customerCity}
        />
      </div>

      <div className="relative">
        <AnimatePresence>
          {showSaveInfoPopover && !user && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-6 mb-4 z-50 w-72 p-5 bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl text-white text-xs font-medium leading-relaxed"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--moiz-green)]/20 text-[var(--moiz-green)] flex items-center justify-center shrink-0">
                  <Info size={16} />
                </div>
                <div>
                  <p className="font-black text-sm mb-1">Inicia sesión primero</p>
                  <p className="text-white/60">
                    Necesitas una cuenta activa para poder guardar tus datos de envío de forma
                    segura.
                  </p>
                </div>
              </div>
              <div className="absolute bottom-[-6px] left-10 w-3 h-3 bg-zinc-900 rotate-45 border-r border-b border-white/10" />
            </motion.div>
          )}
        </AnimatePresence>

        <label
          onClick={() => {
            if (!user) {
              setShowSaveInfoPopover(true);
              setTimeout(() => setShowSaveInfoPopover(false), 3000);
            }
          }}
          className={`flex items-center gap-4 p-6 rounded-[2rem] border transition-all ${
            user
              ? "cursor-pointer group bg-zinc-50/50 border-zinc-100/50 hover:bg-zinc-50"
              : "cursor-not-allowed bg-zinc-100/20 border-zinc-100 opacity-60"
          }`}
        >
          <div className="relative flex items-center">
            <input
              type="checkbox"
              {...register("saveInfo")}
              disabled={!user}
              className="peer sr-only"
            />
            <div
              className={`w-7 h-7 border-2 rounded-xl transition-all ${
                user
                  ? "border-zinc-200 peer-checked:bg-[var(--moiz-green)] peer-checked:border-[var(--moiz-green)]"
                  : "border-zinc-200 bg-zinc-100"
              }`}
            ></div>
            <CheckCircle2
              size={18}
              className="absolute left-1.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
            />
          </div>
          <span
            className={`text-sm font-bold transition-colors ${
              user ? "text-zinc-600 group-hover:text-zinc-900" : "text-zinc-400"
            }`}
          >
            Guardar mi información para consultar más rápidamente la proxima vez
          </span>
        </label>
      </div>
    </div>
  );
}
