import { PaymentGateway, PaymentInitData } from "@/types/payment";
import { startPaymentFlow } from "./payments";
import { MessagingService } from "./messaging-service";

/**
 * Orquestador de pagos centralizado.
 * Desacopla la lógica de selección de pasarela de los componentes de UI.
 */
export class PaymentOrchestrator {
  private static readonly GATEWAY_MAP: Record<string, PaymentGateway> = {
    tarjeta: "WOMPI",
    epayco: "EPAYCO",
    efectivo: "CASH_ON_DELIVERY",
    transferencia: "CASH_ON_DELIVERY",
  };

  /**
   * Determina la pasarela correcta según el método seleccionado.
   */
  static getGateway(method: string): PaymentGateway {
    return this.GATEWAY_MAP[method] || "CASH_ON_DELIVERY";
  }

  /**
   * Inicia el flujo de pago correspondiente.
   */
  static async processPayment(method: string, data: PaymentInitData) {
    const gateway = this.getGateway(method);
    return await startPaymentFlow(gateway, data);
  }

  /**
   * Verifica si el método requiere seguimiento manual por WhatsApp.
   */
  static requiresWhatsAppManualFollowup(method: string): boolean {
    return ["efectivo", "transferencia"].includes(method);
  }

  /**
   * Ejecuta el backup de WhatsApp si es necesario.
   */
  static async handleWhatsAppFollowup(method: string, message: string) {
    if (this.requiresWhatsAppManualFollowup(method)) {
      const url = MessagingService.getWhatsAppUrl(message);
      window.open(url, "_blank");
    }
  }
}
