"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/app/actions/orders";
import { getProfile } from "@/app/actions/profile";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";
import { LocationUtils } from "@/lib/location-utils";
import { MessagingService } from "@/services/messaging-service";
import { startPaymentFlow } from "@/services/payments";
import { PaymentInitData } from "@/types/payment";
import { PaymentOrchestrator } from "@/services/payment-orchestrator";
import { checkoutSchema, type CheckoutFormValues } from "../lib/schema";

export function useCheckoutForm() {
  const router = useRouter();
  const { cart, totalPrice, finalPrice, appliedCoupon, discountAmount, clearCart } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const realIsSubmittingRef = useRef(false); 

  const [user, setUser] = useState<any>(null);
  const [successOrder, setSuccessOrder] = useState<any>(null);
  const [recentCart, setRecentCart] = useState<any[]>([]);
  const [availableCustomerCities, setAvailableCustomerCities] = useState<string[]>([]);
  const [availableBillingCities, setAvailableBillingCities] = useState<string[]>([]);
  const [showSaveInfoPopover, setShowSaveInfoPopover] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema) as unknown as Resolver<CheckoutFormValues>,
    defaultValues: {
      customerName: "",
      customerLastName: "",
      customerEmail: "",
      customerNit: "",
      customerIdType: "CC",
      customerAddress: "",
      customerDetails: "",
      customerCity: "",
      customerState: "",
      customerPhone: "",
      customerPhoneCountry: "+57",
      saveInfo: false,
      shippingMethod: "estandar",
      paymentMethod: "tarjeta",
      billingDifferent: false,
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

  const { setValue, watch } = form;

  // 1. Load User & Profile
  useEffect(() => {
    async function loadUser() {
      const client = createClient();
      const { data: { user } } = await client.auth.getUser();

      if (user) {
        setUser(user);
        const profile = await getProfile();
        if (profile) {
          if (profile.fullName) {
            const names = profile.fullName.split(" ");
            setValue("customerName", names[0] || "");
            setValue("customerLastName", names.slice(1).join(" ") || "");
          }
          if (profile.email) setValue("customerEmail", profile.email);
          else if (user.email) setValue("customerEmail", user.email);
          
          if (profile.phone) setValue("customerPhone", profile.phone);
          if (profile.idNumber) setValue("customerNit", profile.idNumber);

          const shipping = profile.addresses.find((a) => a.type === "SHIPPING");
          if (shipping) {
            setValue("customerAddress", shipping.street);
            setValue("customerCity", shipping.city);
            setValue("customerState", shipping.state);
          }

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

  // 2. Watchers & Derived State
  const shippingMethod = watch("shippingMethod");
  const customerState = watch("customerState");
  const billingState = watch("billingState");
  const customerCity = watch("customerCity");

  const isLocalDeliveryAvailable = LocationUtils.isLocalDeliveryAvailable(customerState || "", customerCity || "");

  useEffect(() => {
    if (!isLocalDeliveryAvailable && shippingMethod === "domicilio") {
      setValue("shippingMethod", "estandar");
    }
  }, [isLocalDeliveryAvailable, shippingMethod, setValue]);

  useEffect(() => {
    setAvailableCustomerCities(LocationUtils.getCitiesByRegion(customerState || ""));
  }, [customerState]);

  useEffect(() => {
    setAvailableBillingCities(LocationUtils.getCitiesByRegion(billingState || ""));
  }, [billingState]);

  // 3. Protection against empty cart
  useEffect(() => {
    if (cart.length === 0 && !successOrder && !isProcessing) {
      router.push("/productos");
      toast.error("Tu carrito está vacío. Agrega productos antes de comprar.");
    }
  }, [cart.length, successOrder, isProcessing, router]);

  // 4. Submit Handler
  const handleCreateOrder = async (formData: CheckoutFormValues) => {
    if (realIsSubmittingRef.current) return;
    
    if (cart.length === 0) {
      toast.error("Tu carrito está vacío.");
      return;
    }

    realIsSubmittingRef.current = true;
    setIsProcessing(true);

    try {
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
        customerAddress: [formData.customerAddress, formData.customerDetails].filter(Boolean).join(", ") || "Recogida/Sin Dirección",
        customerCity: formData.customerCity,
        customerState: formData.customerState,
        customerNit: formData.customerNit,
        customerEmail: formData.customerEmail,
        customerIdType: formData.customerIdType,
        totalAmount: finalPrice,
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

      if ("error" in result) {
        toast.error(result.error || "Error al crear el pedido");
        return;
      }

      // A partir de aquí, TypeScript sabe que 'result' es el objeto de éxito
      const displayId = `MZ-${result.orderNumber || result.orderId.slice(-6).toUpperCase()}`;
      
      // Messaging & WhatsApp
      const whatsappMsg = MessagingService.generateOrderWhatsAppMessage(
        { ...formData, ...orderData }, 
        displayId, 
        cart, 
        appliedCoupon, 
        totalPrice, 
        finalPrice, 
        discountAmount
      );

      // Payment Flow using Orchestrator
      const paymentData: PaymentInitData = {
        amountInCents: Math.round(finalPrice * 100),
        currency: "COP",
        reference: displayId,
        customerEmail: formData.customerEmail,
        customerFullName: `${formData.customerName} ${formData.customerLastName}`,
        customerPhone: formData.customerPhone,
        redirectUrl: `${window.location.origin}/pedidos/${displayId}`,
        signature: result.wompiSignature ?? undefined
      };

      await PaymentOrchestrator.processPayment(formData.paymentMethod, paymentData);
      await PaymentOrchestrator.handleWhatsAppFollowup(formData.paymentMethod, whatsappMsg);

      if (!user) {
        setRecentCart([...cart]);
        setSuccessOrder({
          displayId,
          totalAmount: totalPrice,
          finalAmount: finalPrice,
          discountAmount,
          couponCode: appliedCoupon?.code,
        });
      } else {
        toast.success("¡Pedido creado con éxito!");
      }
    } catch (err: any) {
      toast.error(err.message || "Error al procesar el pago");
    } finally {
      realIsSubmittingRef.current = false;
      setIsProcessing(false);
    }
  };

  return {
    form,
    user,
    isProcessing,
    successOrder,
    recentCart,
    availableCustomerCities,
    availableBillingCities,
    isLocalDeliveryAvailable,
    handleCreateOrder,
    cart,
    totalPrice,
    finalPrice,
    appliedCoupon,
    discountAmount,
    showSaveInfoPopover,
    setShowSaveInfoPopover
  };
}
