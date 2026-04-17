import * as z from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "El nombre es obligatorio"),
  customerLastName: z.string().min(2, "El apellido es obligatorio"),
  customerEmail: z.string().email("Correo electrónico no válido"),
  customerNit: z.string().min(5, "Cédula o NIT no válido"),
  customerIdType: z.string().default("CC"),
  customerAddress: z.string().min(5, "Dirección no válida"),
  customerDetails: z.string().optional(),
  customerCity: z.string().min(2, "Ciudad obligatoria"),
  customerState: z.string().min(2, "Departamento obligatorio"),
  customerPhone: z.string().min(7, "Teléfono no válido"),
  customerPhoneCountry: z.string().default("+57"),
  saveInfo: z.boolean().default(false),
  shippingMethod: z.enum(["estandar", "domicilio"]).default("estandar"),
  paymentMethod: z.enum(["efectivo", "transferencia", "tarjeta", "epayco"]).default("efectivo"),
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

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
