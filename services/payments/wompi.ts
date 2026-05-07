import { PaymentInitData } from "@/types/payment";

/**
 * Servicio para integración con Wompi (Bancolombia)
 * Documentación: https://docs.wompi.co/
 */
export const initWompiCheckout = async (data: PaymentInitData, publicKey: string) => {
  console.log("🚀 Iniciando Checkout Wompi...");
  
  // 1. Limpiar o crear contenedor
  let container = document.getElementById("wompi-widget-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "wompi-widget-container";
    document.body.appendChild(container);
  }
  container.innerHTML = "";

  // 2. Configurar el script de Wompi
  const script = document.createElement("script");
  script.src = "https://checkout.wompi.co/widget.js";
  script.setAttribute("data-public-key", publicKey);
  script.setAttribute("data-currency", data.currency);
  script.setAttribute("data-amount-in-cents", data.amountInCents.toString());
  script.setAttribute("data-reference", data.reference);
  script.setAttribute("data-redirect-url", data.redirectUrl);
  
  if (data.signature) {
    script.setAttribute("data-signature:integrity", data.signature);
  }

  const phone = data.customerPhone || "3000000000";
  const prefix = phone.startsWith("+") ? phone.slice(0, 3) : "+57";
  const number = phone.startsWith("+") ? phone.slice(3) : phone;
  const cleanNumber = number.replace(/\s/g, "") || "3000000000";

  script.setAttribute("data-customer-data:email", data.customerEmail);
  script.setAttribute("data-customer-data:full-name", data.customerFullName);
  script.setAttribute("data-customer-data:phone-number", cleanNumber);
  script.setAttribute("data-customer-data:phone-number-prefix", prefix);

  // 3. Renderizar como botón invisible y disparar click
  script.setAttribute("data-render", "button");
  container.appendChild(script);

  const checkButton = setInterval(() => {
    const btn = container?.querySelector('button');
    if (btn) {
      clearInterval(checkButton);
      btn.click();
      console.log("✅ Wompi disparado");
    }
  }, 100);

  // Timeout de seguridad por si Wompi falla
  setTimeout(() => clearInterval(checkButton), 5000);
};

// Ya no necesitamos loadWompiScript por separado porque el script se carga con el botón
export const loadWompiScript = async (publicKey: string) => true; 

