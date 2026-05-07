export interface LegalSection {
  subtitle: string;
  content?: string[];
  list?: string[];
  orderedList?: string[];
}

export interface LegalData {
  intro?: string;
  sections: LegalSection[];
  footerNote?: string;
}

export const terminosData: LegalData = {
  intro:
    "Bienvenido a Möiz. Al acceder y usar nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones. Por favor, léelos cuidadosamente antes de realizar cualquier compra.",
  sections: [
    {
      subtitle: "1. Uso del Sitio",
      content: [
        "El contenido de las páginas de este sitio web es para tu información y uso general. Está sujeto a cambios sin previo aviso. Todo uso de cualquier información o materiales en este sitio web es enteramente bajo tu propio riesgo.",
      ],
    },
    {
      subtitle: "2. Productos y Servicios",
      content: [
        "Nos reservamos el derecho de modificar o descontinuar el Servicio (o cualquier parte o contenido del mismo) en cualquier momento sin previo aviso. Todos los precios de nuestros productos están sujeto a cambios sin previo aviso.",
      ],
    },
    {
      subtitle: "3. Enlaces de Terceros",
      content: [
        "Ciertos contenidos, productos y servicios disponibles vía nuestro Servicio pueden incluir materiales de terceros (por ejemplo, pasarelas de pago o links a WhatsApp). No somos responsables de examinar o evaluar el contenido o precisión de los mismos.",
      ],
    },
  ],
  footerNote:
    "* Para dudas sobre estos términos, contáctanos a través de nuestras redes sociales o nuestros canales de atención al cliente.",
};

export const privacidadData: LegalData = {
  intro:
    "En Möiz, valoramos tu privacidad y nos comprometemos a proteger tus datos personales. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos la información cuando visitas nuestro sitio web.",
  sections: [
    {
      subtitle: "1. Información que Recopilamos",
      content: [
        "Cuando visitas el Sitio de Möiz o realizas una compra (a través de la web o nuestra integración de WhatsApp), podemos recopilar la siguiente información:",
      ],
      list: [
        "Datos de contacto: Nombre, número de teléfono (WhatsApp), dirección de envío y correo electrónico.",
        "Información del pedido: Detalles de los productos que deseas adquirir.",
        "Información de navegación: Datos analíticos genéricos como tu dirección IP, tipo de navegador y páginas visitadas (mediante cookies).",
      ],
    },
    {
      subtitle: "2. Uso de la Información",
      content: ["Utilizamos la información recopilada principalmente para:"],
      list: [
        "Procesar y administrar tus pedidos realizados en nuestra plataforma.",
        "Comunicarnos contigo por WhatsApp para confirmar tu pedido y coordinar los envíos.",
        "Mejorar nuestro sitio web y la experiencia de usuario.",
        "Enviar promociones o información relevante (solo si has aceptado recibirlos).",
      ],
    },
    {
      subtitle: "3. Protección de tus Datos",
      content: [
        "No vendemos, comercializamos ni transferimos de otro modo a terceros tu Información de Identificación Personal, excepto a socios de confianza que nos asisten en la operación de nuestro sitio web o en la realización de nuestro negocio (como servicios de mensajería), siempre que dichas partes acepten mantener esta información confidencial.",
      ],
    },
    {
      subtitle: "4. Cookies",
      content: [
        "Usamos cookies para mejorar la funcionalidad del sitio y entender cómo los usuarios navegan en él. Puedes desactivar el uso de cookies en los ajustes de tu navegador web.",
      ],
    },
  ],
};

export const politicasData: LegalData = {
  intro: "",
  sections: [
    {
      subtitle: "Políticas de Envío",
      content: [
        "Una vez confirmado tu pedido a través de nuestro canal oficial (WhatsApp) y realizado el pago, procesaremos tu orden lo más rápido posible.",
      ],
      list: [
        "Los tiempos de entrega pueden variar según la zona y la mensajería asignada.",
        "Te notificaremos el estado de tu pedido y te proporcionaremos un número de guía o información de rastreo en cuanto esté disponible.",
        "Asegúrate de proporcionar una dirección exacta; Möiz no se hace responsable por paquetes perdidos debido a direcciones incorrectas proporcionadas por el cliente.",
      ],
    },
    {
      subtitle: "Políticas de Reembolso y Cambios",
      content: [
        "En Möiz buscamos la máxima calidad en todos nuestros productos. Sin embargo, si al recibir tu pedido notas algún defecto de fabricación o error en el envío, sigue estos pasos:",
      ],
      orderedList: [
        "Rastreo y Reporte: Tienes un máximo de 5 días hábiles desde la recepción de tu producto para reclamar cualquier daño o producto erróneo a través de nuestro WhatsApp oficial.",
        "Evidencias: Deberás anexar fotografías claras y/o videos del estado del producto al momento de abrir el paquete.",
        "Condición del Producto: Para ser elegible a un cambio o reembolso (según corresponda), el artículo no debe haber sido usado, modificado o alterado, a menos que el daño sea por defecto de fábrica comprobable.",
        'Reembolsos: No hacemos reembolsos en efectivo por "cambio de opinión" en productos de uso personal; solo aplicarán cuando haya existido un error interno de Möiz o un desperfecto mayor imposible de reemplazar.',
      ],
    },
  ],
  footerNote: "Nota: Los costos de envío original no son reembolsables.",
};
