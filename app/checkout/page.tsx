"use client";

import {
  Loader2,
  CreditCard as CreditCardIcon,
  ChevronRight,
  Banknote,
  ArrowLeft,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Hooks
import { useCheckoutForm } from "./hooks/useCheckoutForm";

// Sub-components
import SuccessView from "./components/SuccessView";
import OrderSummary from "./components/OrderSummary";
import PromotionLoginBox from "./components/PromotionLoginBox";
import ShippingFormSection from "./components/ShippingFormSection";
import BillingFormSection from "./components/BillingFormSection";
import {
  ShippingOption,
  PaymentOption,
} from "./components/CheckoutFormComponents";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    form,
    user,
    isProcessing,
    successOrder,
    recentCart,
    availableCustomerCities,
    availableBillingCities,
    isLocalDeliveryAvailable,
    handleCreateOrder,
    showSaveInfoPopover,
    setShowSaveInfoPopover
  } = useCheckoutForm();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  // Watchers for UI state
  const billingDifferent = watch("billingDifferent");
  const paymentMethod = watch("paymentMethod");
  const shippingMethod = watch("shippingMethod");
  const customerState = watch("customerState");
  const billingState = watch("billingState");

  if (successOrder) {
    return <SuccessView successOrder={successOrder} recentCart={recentCart} />;
  }

  return (
    <main className="bg-[#FAF9F6] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white">
      <Navbar />

      <div className="flex-1 pt-12 md:pt-20 px-6 max-w-7xl mx-auto w-full pb-24">
        <div className="flex flex-col gap-1 inline-flex mb-12">
          <button
            type="button"
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
          <div className="lg:col-span-8 space-y-12">
            <form
              onSubmit={handleSubmit(handleCreateOrder)}
              className="space-y-12 bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl border border-zinc-100"
            >
              {!user && <PromotionLoginBox />}

              <ShippingFormSection
                register={register}
                errors={errors}
                user={user}
                customerState={customerState || ""}
                availableCustomerCities={availableCustomerCities}
                showSaveInfoPopover={showSaveInfoPopover}
                setShowSaveInfoPopover={setShowSaveInfoPopover}
              />

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                    <Truck size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
                    Opciones de Envío
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ShippingOption
                    active={shippingMethod === "estandar"}
                    onClick={() => setValue("shippingMethod", "estandar")}
                    icon={<Truck size={24} />}
                    label="Envío Estándar"
                    description="Nacional (2-5 días)"
                  />
                  <div className="relative group">
                    <ShippingOption
                      active={shippingMethod === "domicilio"}
                      onClick={() => setValue("shippingMethod", "domicilio")}
                      disabled={!isLocalDeliveryAvailable}
                      icon={<ShoppingBag size={24} />}
                      label="Domicilio Möiz"
                      description={
                        isLocalDeliveryAvailable
                          ? "Entrega Rápida (Hoy)"
                          : "Solo Manizales/Villamaría"
                      }
                    />
                    {!isLocalDeliveryAvailable && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-zinc-100 text-zinc-400 text-[8px] font-black uppercase tracking-tighter rounded-md">
                        No disponible
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 text-zinc-900 rounded-2xl flex items-center justify-center">
                    <CreditCardIcon size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
                    Opciones de Pago
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Selector de Pestañas */}
                  <div className="flex p-1.5 bg-zinc-100 rounded-[2rem] gap-1">
                    <button
                      type="button"
                      onClick={() => setValue("paymentMethod", "tarjeta")}
                      className={`flex-1 py-4 rounded-[1.8rem] font-black text-sm uppercase tracking-widest transition-all ${
                        paymentMethod === "tarjeta" 
                        ? "bg-white text-zinc-900 shadow-sm" 
                        : "text-zinc-400 hover:text-zinc-600"
                      }`}
                    >
                      Tarjeta / PSE
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("paymentMethod", "transferencia")}
                      className={`flex-1 py-4 rounded-[1.8rem] font-black text-sm uppercase tracking-widest transition-all ${
                        paymentMethod === "transferencia" 
                        ? "bg-white text-zinc-900 shadow-sm" 
                        : "text-zinc-400 hover:text-zinc-600"
                      }`}
                    >
                      Transferencia
                    </button>
                  </div>

                  {/* Contenido Dinámico */}
                  <div className="min-h-[140px] animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {paymentMethod === "tarjeta" ? (
                      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 flex items-center gap-6 shadow-sm">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                          <CreditCardIcon size={32} />
                        </div>
                        <div>
                          <p className="text-xl font-black text-zinc-900 tracking-tight mb-1">Pago Seguro con Wompi</p>
                          <p className="text-sm text-zinc-500 font-medium">Aceptamos todas las tarjetas de crédito, débito y PSE.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-12 h-12 bg-[var(--moiz-green)] text-zinc-950 rounded-xl flex items-center justify-center font-black text-xl">N</div>
                          <div>
                            <p className="font-black text-zinc-900 leading-tight">Datos de Transferencia</p>
                            <p className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Nequi / Daviplata</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group hover:border-[var(--moiz-green)] transition-colors">
                            <p className="text-[10px] uppercase font-black text-zinc-400 tracking-wider mb-1">Nequi</p>
                            <p className="text-zinc-900 font-black text-xl tracking-tight">310 594 0065</p>
                          </div>
                          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group hover:border-[var(--moiz-green)] transition-colors">
                            <p className="text-[10px] uppercase font-black text-zinc-400 tracking-wider mb-1">Daviplata</p>
                            <p className="text-zinc-900 font-black text-xl tracking-tight">310 449 4494</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          </div>
                          <p className="text-xs text-amber-800 font-bold leading-tight">
                            Envía el comprobante a nuestro WhatsApp de soporte: <span className="block text-sm font-black text-amber-900">321 851 5161</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <BillingFormSection
                register={register}
                errors={errors}
                billingDifferent={billingDifferent}
                setValue={setValue}
                availableBillingCities={availableBillingCities}
                billingState={billingState}
              />

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

          <OrderSummary />
        </div>
      </div>

      <Footer />
    </main>
  );
}
