export type PaymentGateway = "WOMPI" | "EPAYCO" | "CASH_ON_DELIVERY";

export interface PaymentInitData {
  amountInCents: number;
  currency: string;
  reference: string;
  customerEmail: string;
  customerFullName: string;
  customerPhone?: string;
  redirectUrl: string;
}

export interface PaymentConfig {
  wompiPublicKey: string;
  epaycoPublicKey: string;
  isProduction: boolean;
}
