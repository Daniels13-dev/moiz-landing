"use client";

import { Building } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BillingSelection } from "./CheckoutFormComponents";
import { InputGroup, SelectInputGrid, SelectGroup } from "@/components/ui/FormInput";
import { countries, idTypes, COLOMBIA_REGIONS } from "@/config/constants";

interface BillingFormSectionProps {
  register: any;
  errors: any;
  billingDifferent: boolean;
  setValue: any;
  availableBillingCities: string[];
  billingState?: string | undefined;
}

export default function BillingFormSection({
  register,
  errors,
  billingDifferent,
  setValue,
  availableBillingCities,
  billingState,
}: BillingFormSectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-zinc-100 text-zinc-900 rounded-2xl flex items-center justify-center">
          <Building size={24} />
        </div>
        <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Datos de Facturación</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <BillingSelection
          active={!billingDifferent}
          onClick={() => setValue("billingDifferent", false)}
          label="Misma que envío"
        />
        <BillingSelection
          active={billingDifferent}
          onClick={() => setValue("billingDifferent", true)}
          label="Dirección diferente"
        />
      </div>

      <AnimatePresence>
        {billingDifferent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-zinc-100 mt-4">
              <InputGroup
                label="Nombre"
                register={register("billingName")}
                error={errors.billingName}
                placeholder="Ej. Juan"
              />
              <InputGroup
                label="Apellidos"
                register={register("billingLastName")}
                error={errors.billingLastName}
                placeholder="Ej. Pérez"
              />
              <SelectInputGrid
                label="Cédula o NIT"
                selectRegister={register("billingIdType")}
                inputRegister={register("billingNit")}
                options={idTypes}
                placeholder="123456789"
                error={errors.billingNit}
              />
              <SelectInputGrid
                label="Teléfono"
                selectRegister={register("billingPhoneCountry")}
                inputRegister={register("billingPhone")}
                options={countries.map((c: any) => ({
                  label: `${c.flag} ${c.code}`,
                  value: c.code,
                }))}
                placeholder="321 000 0000"
                type="tel"
                error={errors.billingPhone}
              />
              <InputGroup
                label="Dirección"
                register={register("billingAddress")}
                error={errors.billingAddress}
                placeholder="Calle 123 #45-67"
              />
              <InputGroup
                label="Casa, Apto (Opcional)"
                register={register("billingDetails")}
                error={errors.billingDetails}
                placeholder="Edificio Möiz, Apto 502"
              />
              <SelectGroup
                label="Departamento"
                register={register("billingState")}
                options={Object.keys(COLOMBIA_REGIONS).map((d) => ({
                  label: d,
                  value: d,
                }))}
                error={errors.billingState}
              />
              <SelectGroup
                label="Ciudad / Municipio"
                register={register("billingCity")}
                options={availableBillingCities.map((c) => ({ label: c, value: c }))}
                disabled={!billingState}
                error={errors.billingCity}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
