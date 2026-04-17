import { PaymentInitData } from "@/types/payment";

/**
 * Servicio para integración con Wompi (Bancolombia)
 * Documentación: https://docs.wompi.co/
 */
export const initWompiCheckout = (data: PaymentInitData, publicKey: string) => {
  // @ts-ignore
  if (typeof window !== "undefined" && window.Wompi) {
    // @ts-ignore
    const checkout = new window.WompiWidget({
      currency: data.currency,
      amountInCents: data.amountInCents,
      reference: data.reference,
      publicKey: publicKey,
      redirectUrl: data.redirectUrl,
      customerData: {
        email: data.customerEmail,
        fullName: data.customerFullName,
        phoneNumber: data.customerPhone,
      }
    });

    checkout.open((result: any) => {
      console.log("Wompi Result:", result);
      // Aquí se manejaría el resultado inmediato si no hay redirección
    });
  } else {
    console.error("Wompi script not loaded");
  }
};

export const loadWompiScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.getElementById("wompi-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "wompi-script";
      script.src = "https://checkout.wompi.co/widget.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
};
