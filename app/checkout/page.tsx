"use client";

import { useState, useEffect, type ReactNode } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  CreditCard as CreditCardIcon,
  ChevronRight,
  Banknote,
  ArrowLeft,
  Truck,
  ShoppingBag,
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
import { countries, idTypes, COLOMBIA_REGIONS } from "@/config/constants";
import { InputGroup, SelectInputGrid, SelectGroup } from "@/components/ui/FormInput";

// Lib
import { checkoutSchema, type CheckoutFormValues } from "./lib/schema";

// Sub-components
import SuccessView from "./components/SuccessView";
import OrderSummary from "./components/OrderSummary";
import PromotionLoginBox from "./components/PromotionLoginBox";
import ShippingFormSection from "./components/ShippingFormSection";
import BillingFormSection from "./components/BillingFormSection";
import {
  ShippingOption,
  PaymentOption,
  BillingSelection,
} from "./components/CheckoutFormComponents";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, finalPrice, appliedCoupon, discountAmount, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const [showSaveInfoPopover, setShowSaveInfoPopover] = useState(false);
  const [successOrder, setSuccessOrder] = useState<{
    displayId: string;
    totalAmount: number;
    finalAmount: number;
    discountAmount: number;
    couponCode?: string;
  } | null>(null);
  const [recentCart, setRecentCart] = useState<
    { id: string; name: string; quantity: number; price: number }[]
  >([]);
  const [showSubInfo, setShowSubInfo] = useState<string | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !isProcessing && !successOrder) {
      router.push("/carrito");
    }
  }, [cart, isProcessing, router, successOrder]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema) as unknown as Resolver<CheckoutFormValues>,
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
      shippingMethod: "estandar",
    },
  });

  useEffect(() => {
    async function loadUser() {
      const client = createClient();
      const {
        data: { user },
      } = await client.auth.getUser();

      if (user) {
        setUser(user);
        const profile = await getProfile();
        if (profile) {
          if (profile.fullName) {
            const names = profile.fullName.split(" ");
            setValue("customerName", names[0] || "");
            setValue("customerLastName", names.slice(1).join(" ") || "");
          }
          if (profile.phone) setValue("customerPhone", profile.phone);
          if (profile.idNumber) setValue("customerNit", profile.idNumber);

          // Auto-fill Shipping Address
          const shipping = profile.addresses.find((a) => a.type === "SHIPPING");
          if (shipping) {
            setValue("customerAddress", shipping.street);
            setValue("customerCity", shipping.city);
            setValue("customerState", shipping.state);
          }

          // Auto-fill Billing Address
          const billing = profile.addresses.find((a) => a.type === "BILLING");
          if (billing) {
            setValue("billingName", billing.fullName?.split(" ")[0] || "");
            setValue("billingLastName", billing.fullName?.split(" ").slice(1).join(" ") || "");
            setValue("billingNit", billing.idNumber || "");
            if (billing.idType) setValue("billingIdType", billing.idType);
            setValue("billingAddress", billing.street);
            setValue("billingCity", billing.city);
            setValue("billingState", billing.state);
            setValue("billingPhone", billing.phone);
          }
        }
      }
    }

    loadUser();
  }, [setValue]);

  const billingDifferent = watch("billingDifferent");
  const paymentMethod = watch("paymentMethod");
  const shippingMethod = watch("shippingMethod");
  const customerState = watch("customerState");
  const billingState = watch("billingState");
  const customerCity = watch("customerCity");

  const isLocalDeliveryAvailable =
    customerState === "Caldas" && ["Manizales", "Villamaría"].includes(customerCity);

  // Fallback to standard if local delivery becomes unavailable
  useEffect(() => {
    if (!isLocalDeliveryAvailable && shippingMethod === "domicilio") {
      setValue("shippingMethod", "estandar");
    }
  }, [isLocalDeliveryAvailable, shippingMethod, setValue]);

  const [availableCustomerCities, setAvailableCustomerCities] = useState<string[]>([]);
  const [availableBillingCities, setAvailableBillingCities] = useState<string[]>([]);

  useEffect(() => {
    const regions = COLOMBIA_REGIONS as Record<string, string[]>;
    const cities = regions[customerState] || [];
    setAvailableCustomerCities(cities);
  }, [customerState]);

  useEffect(() => {
    const regions = COLOMBIA_REGIONS as Record<string, string[]>;
    const cities = regions[billingState as string] || [];
    setAvailableBillingCities(cities);
  }, [billingState]);

  const handleCreateOrder = async (formData: CheckoutFormValues) => {
    setIsProcessing(true);

    const orderData = {
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        variantId: item.variantId,
        isSubscription: item.isSubscription,
        subscriptionInterval: item.subscriptionInterval,
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
      totalAmount: finalPrice, // Usamos el precio final con el cupón aplicado
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
      shippingMethod: formData.shippingMethod,
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
      if (appliedCoupon) {
        message += `\n*SUBTOTAL: $${totalPrice.toLocaleString("es-CO")}*\n`;
        message += `*DESCUENTO (${appliedCoupon.code}): -$${discountAmount.toLocaleString("es-CO")}*\n`;
      }
      message += `\n*TOTAL: $${finalPrice.toLocaleString("es-CO")}*\n\n`;
      message += `*LOGÍSTICA:*\n`;
      message += `Envío: ${formData.shippingMethod === "domicilio" ? "🛵 DOMICILIO MÖIZ (ENTREGA HOY)" : "🚚 ENVÍO NACIONAL ESTÁNDAR"}\n\n`;
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

      if (!user) {
        setRecentCart([...cart]);
        setSuccessOrder({
          displayId,
          totalAmount: totalPrice,
          finalAmount: finalPrice,
          discountAmount,
          couponCode: appliedCoupon?.code,
        });
        clearCart();
        toast.success("¡Pedido creado con éxito!");
      } else {
        const orderUrl = `/pedidos/MZ-${result.orderNumber}`;
        toast.success("¡Pedido creado con éxito!");
        clearCart();
        window.location.assign(orderUrl);
        return;
      }
    } else {
      toast.error(result.error || "Error al crear el pedido");
      setIsProcessing(false);
    }
  };

  // 1. If we have a success state (Guest Success)
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
          {/* Columna Izquierda: Formulario */}
          <div className="lg:col-span-8 space-y-12">
            <form
              onSubmit={handleSubmit(handleCreateOrder)}
              className="space-y-12 bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl border border-zinc-100"
            >
              {!user && <PromotionLoginBox />}

              {/* Seccion: Datos de Envio */}
              <ShippingFormSection
                register={register}
                errors={errors}
                user={user}
                customerState={customerState}
                availableCustomerCities={availableCustomerCities}
                showSaveInfoPopover={showSaveInfoPopover}
                setShowSaveInfoPopover={setShowSaveInfoPopover}
              />

              {/* Seccion: Opciones de Envío */}
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
                      <div className="absolute top-2 right-2 px-2 py-1 bg-zinc-100 text-zinc-400 text-[8px] font-black uppercase tracking-tighter rounded-md uppercase">
                        No disponible
                      </div>
                    )}
                  </div>
                </div>
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

          {/* Columna Derecha: Resumen de Pedido */}
          <OrderSummary />
        </div>
      </div>

      <Footer />
    </main>
  );
}
