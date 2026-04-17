import { PaymentInitData } from "@/types/payment";

/**
 * Servicio para integración con ePayco
 * Documentación: https://docs.epayco.co/
 */
export const initEpaycoCheckout = (data: PaymentInitData, publicKey: string, isProduction: boolean) => {
  // @ts-ignore
  if (typeof window !== "undefined" && window.ePayco) {
    // @ts-ignore
    const handler = window.ePayco.checkout.configure({
      key: publicKey,
      test: !isProduction
    });

    const epaycoData = {
      name: "Compra en Moiz",
      description: `Pedido ${data.reference}`,
      invoice: data.reference,
      currency: data.currency.toLowerCase(),
      amount: (data.amountInCents / 100).toString(),
      tax_base: "0",
      tax: "0",
      country: "co",
      lang: "es",
      external: "false",
      confirmation: `${window.location.origin}/api/payments/epayco-webhook`,
      response: data.redirectUrl,
      // Attributes for customer
      email_billing: data.customerEmail,
      name_billing: data.customerFullName,
      mobile_billing: data.customerPhone,
    };

    handler.open(epaycoData);
  } else {
    console.error("ePayco script not loaded");
  }
};

export const loadEpaycoScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.getElementById("epayco-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "epayco-script";
      script.src = "https://checkout.epayco.co/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
};
