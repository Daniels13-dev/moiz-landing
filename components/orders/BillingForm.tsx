"use client";

import { motion } from "framer-motion";
import { InputGroup } from "./CheckoutSteps";

interface BillingFormProps {
  register: any;
  errors: any;
}

export default function BillingForm({ register, errors }: BillingFormProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-zinc-100 mt-2">
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
        <InputGroup
          label="Cédula o NIT"
          register={register("billingNit")}
          error={errors.billingNit}
          placeholder="123456789"
        />
        <InputGroup
          label="Teléfono"
          register={register("billingPhone")}
          error={errors.billingPhone}
          placeholder="321 000 0000"
        />
        <div className="md:col-span-2">
          <InputGroup
            label="Dirección"
            register={register("billingAddress")}
            error={errors.billingAddress}
            placeholder="Calle 123 #45-67"
          />
        </div>
        <InputGroup
          label="Casa, Apto, Bloque (Opcional)"
          register={register("billingDetails")}
          error={errors.billingDetails}
          placeholder="Apto 502"
        />
        <InputGroup
          label="Ciudad"
          register={register("billingCity")}
          error={errors.billingCity}
          placeholder="Ej. Bogotá"
        />
        <InputGroup
          label="Departamento"
          register={register("billingState")}
          error={errors.billingState}
          placeholder="Ej. Cundinamarca"
        />
      </div>
    </motion.div>
  );
}
