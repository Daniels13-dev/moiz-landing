import { siteConfig } from "@/config/site";
import { LocationUtils } from "@/lib/location-utils";

/**
 * Servicio para manejar la comunicación y mensajería del negocio.
 */
export class MessagingService {
  /**
   * Genera el mensaje de WhatsApp para confirmación de pedido.
   */
  static generateOrderWhatsAppMessage(orderData: any, displayId: string, cart: any[], appliedCoupon?: any, totalPrice: number = 0, finalPrice: number = 0, discountAmount: number = 0) {
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
    message += `Envío: ${LocationUtils.getShippingMethodLabel(orderData.shippingMethod)}\n\n`;
    
    message += `*DATOS DE ENVÍO:*\n`;
    message += `Cliente: ${orderData.customerName} ${orderData.customerLastName || ""}\n`;
    message += `Cédula/NIT: ${orderData.customerNit}\n`;
    message += `Teléfono: ${orderData.customerPhone}\n`;
    message += `Dirección: ${orderData.customerAddress}\n`;
    message += `Ciudad: ${orderData.customerCity}, ${orderData.customerState}\n`;
    message += `\n*MÉTODO DE PAGO:* ${orderData.paymentMethod.toUpperCase()}`;

    return message;
  }

  /**
   * Retorna la URL de WhatsApp configurada.
   */
  static getWhatsAppUrl(message: string) {
    const phoneNumber = siteConfig.links.whatsappNumber || "573218515161";
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  }
}
