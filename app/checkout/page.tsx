"use client";

import { useState, useEffect, type ReactNode } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import type { UseFormRegisterReturn, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  MapPin,
  CreditCard as CreditCardIcon,
  ChevronRight,
  CheckCircle2,
  Building,
  LogIn,
  Banknote,
  ArrowLeft,
  ShieldCheck,
  Truck,
  ShoppingBag,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/app/actions/orders";
import { getProfile } from "@/app/actions/profile";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { countries, idTypes } from "@/config/constants";
import { InputGroup, SelectInputGrid } from "@/components/ui/FormInput";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "El nombre es obligatorio"),
  customerLastName: z.string().min(2, "El apellido es obligatorio"),
  customerNit: z.string().min(5, "Cédula o NIT no válido"),
  customerIdType: z.string().default("CC"),
  customerAddress: z.string().min(5, "Dirección no válida"),
  customerDetails: z.string().optional(),
  customerCity: z.string().min(2, "Ciudad obligatoria"),
  customerState: z.string().min(2, "Departamento obligatorio"),
  customerPhone: z.string().min(7, "Teléfono no válido"),
  customerPhoneCountry: z.string().default("+57"),
  saveInfo: z.boolean().default(false),
  paymentMethod: z
    .enum(["efectivo", "transferencia", "tarjeta"])
    .default("efectivo"),
  billingDifferent: z.boolean().default(false),
  billingName: z.string().optional(),
  billingLastName: z.string().optional(),
  billingNit: z.string().optional(),
  billingIdType: z.string().optional(),
  billingAddress: z.string().optional(),
  billingDetails: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingPhone: z.string().optional(),
  billingPhoneCountry: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<unknown | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !isProcessing) {
      router.push("/carrito");
    }
  }, [cart, isProcessing, router]);

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
      customerIdType: "CC",
      customerAddress: "",
      customerCity: "",
      customerState: "",
      customerPhone: "",
      customerPhoneCountry: "+57",
      customerDetails: "",
      paymentMethod: "efectivo",
      billingDifferent: false,
      saveInfo: false,
      billingName: "",
      billingLastName: "",
      billingNit: "",
      billingIdType: "CC",
      billingAddress: "",
      billingDetails: "",
      billingCity: "",
      billingState: "",
      billingPhone: "",
      billingPhoneCountry: "+57",
    },
  });

  useEffect(() => {
    // Create client inside the effect to avoid referencing outer `supabase` and satisfy hook deps
    const client = createClient();
    client.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        // Fetch profile data to auto-fill
        getProfile().then((profile) => {
          if (profile) {
            if (profile.fullName) {
              const names = profile.fullName.split(" ");
              setValue("customerName", names[0] || "");
              setValue("customerLastName", names.slice(1).join(" ") || "");
            }
            if (profile.phone) setValue("customerPhone", profile.phone);
            if (profile.idNumber) setValue("customerNit", profile.idNumber);

            // Auto-fill Shipping Address
            const shipping = (profile.addresses as any[]).find(
              (a) => a.type === "SHIPPING",
            );
            if (shipping) {
              setValue("customerAddress", shipping.street);
              setValue("customerCity", shipping.city);
              setValue("customerState", shipping.state);
            }

            // Auto-fill Billing Address
            const billing = (profile.addresses as any[]).find((a) => a.type === "BILLING");
            if (billing) {
              setValue("billingName", billing.fullName?.split(" ")[0] || "");
              setValue(
                "billingLastName",
                billing.fullName?.split(" ").slice(1).join(" ") || "",
              );
              setValue("billingNit", billing.idNumber || "");
              if (billing.idType) setValue("billingIdType", billing.idType);
              setValue("billingAddress", billing.street);
              setValue("billingCity", billing.city);
              setValue("billingState", billing.state);
              setValue("billingPhone", billing.phone);
            }
          }
        });
      }
    });
  }, [setValue]);

  const billingDifferent = watch("billingDifferent");
  const paymentMethod = watch("paymentMethod");

  const handleCreateOrder = async (formData: CheckoutFormValues) => {
    setIsProcessing(true);

    const orderData = {
      items: cart.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      customerName: formData.customerName,
      customerLastName: formData.customerLastName,
      customerPhone: formData.customerPhone,
      customerPhoneCountry: formData.customerPhoneCountry,
      customerAddress: `${formData.customerAddress}${formData.customerDetails ? `, ${formData.customerDetails}` : ""}`,
      customerCity: formData.customerCity,
      customerState: formData.customerState,
      customerNit: formData.customerNit,
      customerIdType: formData.customerIdType,
      totalAmount: totalPrice,
      billingDifferent: formData.billingDifferent,
      billingName: formData.billingName,
      billingLastName: formData.billingLastName,
      billingNit: formData.billingNit,
      billingIdType: formData.billingIdType,
      billingAddress: formData.billingAddress
        ? `${formData.billingAddress}${formData.billingDetails ? `, ${formData.billingDetails}` : ""}`
        : undefined,
      billingCity: formData.billingCity,
      billingState: formData.billingState,
      billingPhone: formData.billingPhone,
      billingPhoneCountry: formData.billingPhoneCountry,
      saveInfo: formData.saveInfo,
    };

    const result = await createOrder(orderData);

    if (result.success) {
      const phoneNumber = siteConfig.links.whatsappNumber || "573218515161";
      const displayId = `MZ-${result.orderNumber || result.orderId.slice(-6).toUpperCase()}`;
      let message = `*PEDIDO CONFIRMADO #${displayId}*\n\n`;
      message += `Hola Möiz! Acabo de confirmar mi pedido en la web:\n\n`;
      cart.forEach((item) => {
        message += `- ${item.name} x${item.quantity}\n`;
      });
      message += `\n*TOTAL: $${totalPrice.toLocaleString("es-CO")}*\n\n`;
      message += `*DATOS DE ENVÍO:*\n`;
      message += `Cliente: ${formData.customerName} ${formData.customerLastName}\n`;
      message += `Cédula/NIT: ${formData.customerNit}\n`;
      message += `Teléfono: ${formData.customerPhone}\n`;
      message += `Dirección: ${formData.customerAddress} ${formData.customerDetails || ""}\n`;
      message += `Ciudad: ${formData.customerCity}, ${formData.customerState}\n`;
      message += `\n*MÉTODO DE PAGO:* ${formData.paymentMethod.toUpperCase()}`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

      window.open(whatsappUrl, "_blank");

      clearCart();
      router.push(`/pedidos/${result.orderId}`);
      toast.success("¡Pedido creado con éxito!");
    } else {
      toast.error(result.error || "Error al crear el pedido");
    }
    setIsProcessing(false);
  };

  if (cart.length === 0 && !isProcessing) return null;

  return (
    <main className="bg-[#FAF9F6] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white">
      <Navbar />

      <div className="flex-1 pt-12 md:pt-20 px-6 max-w-7xl mx-auto w-full pb-24">
        <div className="flex flex-col gap-1 inline-flex mb-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors font-bold text-sm mb-4"
          >
            <ArrowLeft size={16} /> Volver al carrito
          </button>
          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter">
            Finalizar Compra
          </h1>
          <p className="text-zinc-500 font-medium">
            Estás a un paso de recibir lo mejor para tu peludito
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Columna Izquierda: Formulario */}
          <div className="lg:col-span-8 space-y-12">
            <form
              onSubmit={handleSubmit(handleCreateOrder)}
              className="space-y-12 bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl border border-zinc-100"
            >
              {!user && (
                <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                      <LogIn size={24} />
                    </div>
                    <div>
                      <p className="font-black text-zinc-900 text-lg">
                        ¿Ya tienes una cuenta?
                      </p>
                      <p className="text-sm text-zinc-500 font-medium tracking-tight leading-relaxed">
                        Inicia sesión para usar tus datos guardados y comprar
                        más rápido.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/login?next=/checkout")}
                    className="w-full md:w-auto px-10 py-4 bg-zinc-900 text-white rounded-full font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-zinc-900/10 active:scale-95"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              )}

              {/* Seccion: Datos de Envio */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] rounded-2xl flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
                    Datos de Envío
                  </h3>
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
                    options={countries.map(c => ({ label: `${c.flag} ${c.code}`, value: c.code }))}
                    placeholder="321 000 0000"
                    type="tel"
                    error={errors.customerPhone}
                  />
                  <div className="md:col-span-2">
                    <InputGroup
                      label="Dirección"
                      register={register("customerAddress")}
                      error={errors.customerAddress}
                      placeholder="Calle 123 #45-67"
                    />
                  </div>
                  <InputGroup
                    label="Casa, Apto (Opcional)"
                    register={register("customerDetails")}
                    error={errors.customerDetails}
                    placeholder="Edificio Möiz, Apto 502"
                  />
                  <InputGroup
                    label="Ciudad"
                    register={register("customerCity")}
                    error={errors.customerCity}
                    placeholder="Ej. Bogotá"
                  />
                  <div className="md:col-span-2">
                    <InputGroup
                      label="Departamento"
                      register={register("customerState")}
                      error={errors.customerState}
                      placeholder="Ej. Cundinamarca"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-4 cursor-pointer group bg-zinc-50/50 p-6 rounded-[2rem] border border-zinc-100/50 hover:bg-zinc-50 transition-colors">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      {...register("saveInfo")}
                      className="peer sr-only"
                    />
                    <div className="w-7 h-7 border-2 border-zinc-200 rounded-xl peer-checked:bg-[var(--moiz-green)] peer-checked:border-[var(--moiz-green)] transition-all"></div>
                    <CheckCircle2
                      size={18}
                      className="absolute left-1.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                    />
                  </div>
                  <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900 transition-colors">
                    Guardar mi información para consultar más rápidamente la
                    proxima vez
                  </span>
                </label>
              </div>

              {/* Seccion: Opciones de Pago */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 text-zinc-900 rounded-2xl flex items-center justify-center">
                    <CreditCardIcon size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
                    Opciones de Pago
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <PaymentOption
                    active={paymentMethod === "efectivo"}
                    onClick={() => setValue("paymentMethod", "efectivo")}
                    icon={<Banknote size={24} />}
                    label="Efectivo"
                    description="Contra entrega"
                  />
                  <PaymentOption
                    active={paymentMethod === "transferencia"}
                    onClick={() => setValue("paymentMethod", "transferencia")}
                    icon={<div className="font-black text-lg">N</div>}
                    label="Transferencia"
                    description="QR Nequi/Daviplata"
                  />
                  <PaymentOption
                    active={paymentMethod === "tarjeta"}
                    onClick={() => setValue("paymentMethod", "tarjeta")}
                    icon={<CreditCardIcon size={24} />}
                    label="Tarjeta"
                    description="Visa / Mastercard"
                  />
                </div>
              </div>

              {/* Seccion: Facturacion */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 text-zinc-900 rounded-2xl flex items-center justify-center">
                    <Building size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
                    Datos de Facturación
                  </h3>
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
                          options={countries.map(c => ({ label: `${c.flag} ${c.code}`, value: c.code }))}
                          placeholder="321 000 0000"
                          type="tel"
                          error={errors.billingPhone}
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

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-6 bg-[var(--moiz-green)] text-zinc-950 rounded-[2rem] font-black text-xl shadow-2xl shadow-[var(--moiz-green)]/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-4 active:scale-95 group"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" /> Procesando Pedido...
                  </>
                ) : (
                  <>
                    Finalizar y Pagar{" "}
                    <ChevronRight
                      size={28}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Columna Derecha: Resumen de Pedido */}
          <div className="lg:col-span-4 space-y-8 sticky top-32">
            <div className="bg-zinc-900 rounded-[3rem] p-10 text-white shadow-3xl relative overflow-hidden">
              {/* Background Decor */}
              <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-[var(--moiz-green)]/10 blur-[80px] rounded-full" />
              <div className="absolute bottom-[-5%] left-[-5%] w-32 h-32 bg-white/5 blur-[50px] rounded-full" />

              <h2 className="text-3xl font-black mb-10 tracking-tight flex items-center gap-3">
                <ShoppingBag className="text-[var(--moiz-green)]" /> Tu Pedido
              </h2>

              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 mb-10 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center group">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex-shrink-0 flex items-center justify-center p-2 border border-white/10 group-hover:border-[var(--moiz-green)]/30 transition-colors">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-contain h-full w-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.name}</p>
                      <p className="text-white/40 text-xs font-medium">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <p className="font-black text-[var(--moiz-green)] text-sm">
                      ${(item.price * item.quantity).toLocaleString("es-CO")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pb-8 border-b border-white/10 mb-8">
                <div className="flex justify-between text-white/60 font-medium">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-white/60">Envío Estándar</span>
                  {totalPrice >= 400000 ? (
                    <span className="text-[var(--moiz-green)] font-black">
                      GRATIS
                    </span>
                  ) : (
                    <span className="text-zinc-500 italic text-[11px]">
                      Por calcular
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-10">
                <span className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">
                  Total a recibir
                </span>
                <span className="text-5xl font-black text-white leading-none">
                  ${totalPrice.toLocaleString("es-CO")}
                </span>
              </div>

              <div className="space-y-4 bg-white/5 p-6 rounded-[2.5rem] border border-white/10">
                <div className="flex items-center gap-3 text-xs font-bold text-white/50">
                  <ShieldCheck className="text-[var(--moiz-green)]" size={16} />{" "}
                  Pago 100% Protegido
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-white/50">
                  <Truck className="text-[var(--moiz-green)]" size={16} />{" "}
                  Despacho en 24-48h
                </div>
              </div>
            </div>

            <div className="bg-[var(--moiz-green)]/5 border-2 border-[var(--moiz-green)]/10 p-8 rounded-[3rem] items-center gap-4 flex flex-col text-center">
              <div className="w-12 h-12 bg-[var(--moiz-green)] text-zinc-950 rounded-full flex items-center justify-center">
                <Info size={24} />
              </div>
              <div>
                <p className="font-black text-zinc-900 leading-tight">
                  ¿Tienes dudas?
                </p>
                <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-widest text-[9px] mb-3">
                  Escríbenos por WhatsApp
                </p>
                <a
                  href={`https://wa.me/${siteConfig.links.whatsappNumber || "573218515161"}`}
                  target="_blank"
                  className="inline-flex py-3 px-6 bg-zinc-900 text-white rounded-full font-bold text-xs"
                >
                  Hablar con un asesor
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
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
      className={`p-8 border-2 rounded-[2.5rem] flex flex-col gap-4 text-left transition-all ${active ? "border-[var(--moiz-green)] bg-white shadow-2xl shadow-[var(--moiz-green)]/10" : "border-zinc-50 bg-zinc-50/30 opacity-60 hover:opacity-100 hover:shadow-xl hover:bg-white"}`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${active ? "bg-[var(--moiz-green)] text-zinc-950" : "bg-zinc-100 text-zinc-400"}`}
      >
        {icon}
      </div>
      <div>
        <p className="font-black text-zinc-900 text-lg leading-none mb-1">
          {label}
        </p>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          {description}
        </p>
      </div>
    </button>
  );
}

function BillingSelection({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-8 border-2 rounded-[2rem] flex items-center justify-between transition-all ${active ? "border-[var(--moiz-green)] bg-white shadow-lg" : "border-zinc-50 bg-zinc-50/30 opacity-60"}`}
    >
      <div className="flex items-center gap-5">
        <div
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${active ? "border-[var(--moiz-green)]" : "border-zinc-300"}`}
        >
          {active && (
            <div className="w-3 h-3 bg-[var(--moiz-green)] rounded-full animate-scale-in" />
          )}
        </div>
        <span className="font-black text-zinc-900">{label}</span>
      </div>
    </button>
  );
}
