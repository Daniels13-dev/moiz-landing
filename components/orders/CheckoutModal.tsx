"use client";

import { useForm } from "react-hook-form";
import type { UseFormRegisterReturn, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  X,
  Loader2,
  MapPin,
  CreditCard,
  ChevronRight,
  CheckCircle2,
  Building,
  LogIn,
  CreditCard as CardIcon,
  Banknote,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "El nombre es obligatorio"),
  customerLastName: z.string().min(2, "El apellido es obligatorio"),
  customerNit: z.string().min(5, "Cédula o NIT no válido"),
  customerAddress: z.string().min(5, "Dirección no válida"),
  customerDetails: z.string().optional(),
  customerCity: z.string().min(2, "Ciudad obligatoria"),
  customerState: z.string().min(2, "Departamento obligatorio"),
  customerPhone: z.string().min(7, "Teléfono no válido"),
  saveInfo: z.boolean().default(false),
  paymentMethod: z
    .enum(["efectivo", "transferencia", "tarjeta"])
    .default("efectivo"),
  billingDifferent: z.boolean().default(false),
  billingName: z.string().optional(),
  billingLastName: z.string().optional(),
  billingNit: z.string().optional(),
  billingAddress: z.string().optional(),
  billingDetails: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingPhone: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CheckoutFormValues) => void;
  isProcessing: boolean;
  totalPrice: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onSubmit,
  isProcessing,
  totalPrice,
}: CheckoutModalProps) {
  const [user, setUser] = useState<unknown | null>(null);
  const router = useRouter();

  useEffect(() => {
    const client = createClient();
    client.auth.getUser().then(({ data: { user } }: any) => {
      setUser(user);
    });
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(
      checkoutSchema,
    ) as unknown as Resolver<CheckoutFormValues>,
    defaultValues: {
      customerName: "",
      customerLastName: "",
      customerNit: "",
      customerAddress: "",
      customerCity: "",
      customerState: "",
      customerPhone: "",
      customerDetails: "",
      paymentMethod: "efectivo",
      billingDifferent: false,
      saveInfo: false,
      billingName: "",
      billingLastName: "",
      billingNit: "",
      billingAddress: "",
      billingDetails: "",
      billingCity: "",
      billingState: "",
      billingPhone: "",
    },
  });

  const billingDifferent = watch("billingDifferent");
  const paymentMethod = watch("paymentMethod");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-4xl max-h-[90vh] bg-white rounded-t-[3rem] md:rounded-[3rem] shadow-2xl z-[70] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-zinc-100 bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">
                  Finalizar Compra
                </h2>
                <p className="text-zinc-500 font-medium text-sm">
                  Ingresa tus datos para el envío y pago
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 bg-zinc-50 text-zinc-400 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12"
            >
              {!user && (
                <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center flex-shrink-0">
                      <LogIn size={20} />
                    </div>
                    <div>
                      <p className="font-black text-zinc-900">
                        ¿Ya tienes una cuenta?
                      </p>
                      <p className="text-sm text-zinc-500 font-medium">
                        Inicia sesión para una compra más rápida
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/login?next=/carrito")}
                    className="px-8 py-3 bg-zinc-900 text-white rounded-full font-bold text-sm hover:scale-105 transition-all"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              )}

              {/* Seccion: Datos de Envio */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] rounded-lg flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight">
                    Datos de Envío
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <InputGroup
                    label="Cédula o NIT"
                    register={register("customerNit")}
                    error={errors.customerNit}
                    placeholder="123456789"
                  />
                  <InputGroup
                    label="Teléfono"
                    register={register("customerPhone")}
                    error={errors.customerPhone}
                    placeholder="321 000 0000"
                  />
                  <div className="md:col-span-2 text-zinc-400">
                    <InputGroup
                      label="Dirección"
                      register={register("customerAddress")}
                      error={errors.customerAddress}
                      placeholder="Calle 123 #45-67"
                    />
                  </div>
                  <InputGroup
                    label="Casa, Apto, Bloque (Opcional)"
                    register={register("customerDetails")}
                    error={errors.customerDetails}
                    placeholder="Apto 502"
                  />
                  <InputGroup
                    label="Ciudad"
                    register={register("customerCity")}
                    error={errors.customerCity}
                    placeholder="Ej. Bogotá"
                  />
                  <InputGroup
                    label="Departamento"
                    register={register("customerState")}
                    error={errors.customerState}
                    placeholder="Ej. Cundinamarca"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      {...register("saveInfo")}
                      className="peer sr-only"
                    />
                    <div className="w-6 h-6 border-2 border-zinc-200 rounded-lg peer-checked:bg-[var(--moiz-green)] peer-checked:border-[var(--moiz-green)] transition-all"></div>
                    <CheckCircle2
                      size={16}
                      className="absolute left-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                    />
                  </div>
                  <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900 transition-colors">
                    Guardar mi información y consultar más rápidamente la
                    proxima vez
                  </span>
                </label>
              </div>

              {/* Seccion: Opciones de Pago */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] rounded-lg flex items-center justify-center">
                    <CreditCard size={18} />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight">
                    Opciones de Pago
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PaymentOption
                    active={paymentMethod === "efectivo"}
                    onClick={() => setValue("paymentMethod", "efectivo")}
                    icon={<Banknote size={20} />}
                    label="Efectivo"
                    description="Contra entrega"
                  />
                  <PaymentOption
                    active={paymentMethod === "transferencia"}
                    onClick={() => setValue("paymentMethod", "transferencia")}
                    icon={<CardIcon size={20} />}
                    label="Transferencia"
                    description="Bancolombia/Nequi"
                  />
                  <PaymentOption
                    active={paymentMethod === "tarjeta"}
                    onClick={() => setValue("paymentMethod", "tarjeta")}
                    icon={<CreditCard size={20} />}
                    label="Tarjeta"
                    description="Crédito o Débito"
                  />
                </div>
              </div>

              {/* Seccion: Facturacion */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] rounded-lg flex items-center justify-center">
                    <Building size={18} />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight">
                    Dirección de Facturación
                  </h3>
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setValue("billingDifferent", false)}
                    className={`w-full p-6 border rounded-[2rem] flex items-center justify-between transition-all ${!billingDifferent ? "border-[var(--moiz-green)] bg-[var(--moiz-green)]/5" : "border-zinc-100 bg-zinc-50"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${!billingDifferent ? "border-[var(--moiz-green)]" : "border-zinc-300"}`}
                      >
                        {!billingDifferent && (
                          <div className="w-2.5 h-2.5 bg-[var(--moiz-green)] rounded-full" />
                        )}
                      </div>
                      <span className="font-bold text-zinc-900 text-left">
                        La misma dirección del envío
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setValue("billingDifferent", true)}
                    className={`w-full p-6 border rounded-[2rem] flex items-center justify-between transition-all ${billingDifferent ? "border-[var(--moiz-green)] bg-[var(--moiz-green)]/5" : "border-zinc-100 bg-zinc-50"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${billingDifferent ? "border-[var(--moiz-green)]" : "border-zinc-300"}`}
                      >
                        {billingDifferent && (
                          <div className="w-2.5 h-2.5 bg-[var(--moiz-green)] rounded-full" />
                        )}
                      </div>
                      <span className="font-bold text-zinc-900 text-left">
                        Usar una dirección diferente
                      </span>
                    </div>
                  </button>
                </div>

                <AnimatePresence>
                  {billingDifferent && (
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
                  )}
                </AnimatePresence>
              </div>

              {/* Botón Final */}
              <div className="bg-zinc-900 p-8 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 mt-12">
                <div>
                  <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">
                    Total a Pagar
                  </p>
                  <p className="text-3xl font-black">
                    ${totalPrice.toLocaleString("es-CO")}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full md:w-auto px-12 py-5 bg-[var(--moiz-green)] text-zinc-950 rounded-full font-black text-lg shadow-xl hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Confirmar Compra <ChevronRight size={24} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InputGroup({
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
      {error && (
        <p className="text-red-500 text-[10px] font-bold px-1">
          {error.message}
        </p>
      )}
    </div>
  );
}

function PaymentOption({
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
