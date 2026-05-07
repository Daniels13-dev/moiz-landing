import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().cuid(),
  productName: z.string().min(2),
  quantity: z.number().int().min(1).max(99),
  price: z.number().positive(),
  variantId: z.string().cuid().optional(),
  isSubscription: z.boolean().optional(),
  subscriptionInterval: z.string().optional(),
});

/**
 * Esquema único de Checkout y Creación de Pedidos.
 * Centralizado para ser usado tanto en el Formulario (Frontend) como en la Acción (Backend).
 */
export const checkoutSchema = z.object({
  // Items del carrito (añadidos en el backend o validados en el submit)
  items: z.array(orderItemSchema).min(1).optional(),
  totalAmount: z.number().positive().optional(),

  // Datos del Cliente
  customerName: z.string().min(2, "El nombre es obligatorio"),
  customerLastName: z.string().optional(),
  customerEmail: z.string().email("Correo electrónico no válido"),
  customerPhone: z.string().min(7, "Teléfono no válido"),
  customerPhoneCountry: z.string().default("+57"),
  customerNit: z.string().min(5, "Cédula o NIT no válido"),
  customerIdType: z.string().default("CC"),
  customerAddress: z.string().min(5, "La dirección es obligatoria"),
  customerDetails: z.string().optional(),
  customerCity: z.string().min(2, "La ciudad es obligatoria"),
  customerState: z.string().min(2, "El departamento es obligatorio"),
  
  // Opciones de Pedido
  shippingMethod: z.enum(["estandar", "domicilio"]).default("estandar"),
  paymentMethod: z.enum(["efectivo", "transferencia", "tarjeta", "epayco"]).default("efectivo"),
  saveInfo: z.boolean().default(false),

  // Facturación Diferente
  billingDifferent: z.boolean().default(false),
  billingName: z.string().optional(),
  billingLastName: z.string().optional(),
  billingNit: z.string().optional(),
  billingIdType: z.string().default("CC"),
  billingAddress: z.string().optional(),
  billingDetails: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingPhone: z.string().optional(),
  billingPhoneCountry: z.string().default("+57"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const trackOrderSchema = z.object({
  orderDisplay: z.string().min(4),
  nit: z.string().min(5),
});
