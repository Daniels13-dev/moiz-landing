import { PaymentGateway, PaymentInitData } from "@/types/payment";
import { loadWompiScript, initWompiCheckout } from "./wompi";
import { loadEpaycoScript, initEpaycoCheckout } from "./epayco";

const WOMPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || "";
const EPAYCO_PUBLIC_KEY = process.env.NEXT_PUBLIC_EPAYCO_PUBLIC_KEY || "";
const IS_PRODUCTION = process.env.NEXT_PUBLIC_PAYMENT_PRODUCTION === "true";

/**
 * Función principal para iniciar cualquier pasarela de pago.
 */
export const startPaymentFlow = async (
  gateway: PaymentGateway,
  data: PaymentInitData
) => {
  if (gateway === "CASH_ON_DELIVERY") {
    // Simplemente redirigir a la página de éxito para pago contra entrega
    window.location.href = data.redirectUrl + "?method=cod";
    return;
  }

  if (gateway === "WOMPI") {
    const loaded = await loadWompiScript();
    if (loaded) {
      initWompiCheckout(data, WOMPI_PUBLIC_KEY);
    } else {
      throw new Error("No se pudo cargar el script de Wompi");
    }
    return;
  }

  if (gateway === "EPAYCO") {
    const loaded = await loadEpaycoScript();
    if (loaded) {
      initEpaycoCheckout(data, EPAYCO_PUBLIC_KEY, IS_PRODUCTION);
    } else {
      throw new Error("No se pudo cargar el script de ePayco");
    }
    return;
  }
};
