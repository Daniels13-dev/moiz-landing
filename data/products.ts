export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  desc: string;
  category: "Alimento" | "Higiene" | "Juguetes" | "Snacks" | "Accesorios";
  petType: "Gato" | "Perro" | "Ambos";
  rating: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export const productsData: Product[] = [
  // --- HIGIENE (ARENAS EXISTENTES) ---
  {
    id: "arena-2",
    name: "Arena Premium 2kg",
    image: "/products/arena2kg-transparent.png",
    price: 12000,
    desc: "La presentación ideal para gatos pequeños o de un solo mes de prueba.",
    category: "Higiene",
    petType: "Gato",
    rating: 4.5,
  },
  {
    id: "arena-4",
    name: "Arena Premium 4kg",
    image: "/products/arena4kg-transparent.png",
    price: 24000,
    desc: "Nuestra presentación estrella. Máximo equilibrio entre rendimiento y frescura constante.",
    category: "Higiene",
    petType: "Gato",
    rating: 4.8,
    isFeatured: true,
  },
  {
    id: "arena-10",
    name: "Arena Premium 10kg",
    image: "/products/arena10kg-transparent.png",
    price: 55000,
    oldPrice: 60000,
    desc: "Mejor relación precio/uso. Perfecta para quienes buscan ahorro sin perder aglomeración.",
    category: "Higiene",
    petType: "Gato",
    rating: 4.9,
  },
  {
    id: "arena-20",
    name: "Arena Pro 20kg",
    image: "/products/arena20kg-transparent.png",
    price: 108000,
    desc: "El formato de suministro constante. Diseñado para hogares con 2 a 3 encantadores felinos.",
    category: "Higiene",
    petType: "Gato",
    rating: 4.7,
  },
  {
    id: "arena-25",
    name: "Arena Pro 25kg",
    image: "/products/arena25kg-transparent.png",
    price: 125000,
    desc: "Rendimiento extendido y frescura sin compromisos. Ideal para hogares múltiples.",
    category: "Higiene",
    petType: "Gato",
    rating: 4.9,
  },
  {
    id: "arena-50",
    name: "Arena Titan 50kg",
    image: "/products/arena50kg-transparent.png",
    price: 237000,
    oldPrice: 250000,
    desc: "El titán del soporte. Uso profesional, fundaciones o familias multiespecie gigantes.",
    category: "Higiene",
    petType: "Gato",
    rating: 5.0,
  },

  // --- ALIMENTOS PERRO ---
  {
    id: "dog-food-premium",
    name: "Ultra Paws Adulto 20lb",
    image: "/products/dog-food-transparent.png",
    price: 185000,
    desc: "Fórmula de pollo real y arroz integral para perros de razas grandes.",
    category: "Alimento",
    petType: "Perro",
    rating: 4.9,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "dog-food-puppy",
    name: "Ultra Paws Cachorro 10lb",
    image: "/products/dog-food-transparent.png",
    price: 95000,
    desc: "Crecimiento saludable con DHA y proteínas de alta calidad.",
    category: "Alimento",
    petType: "Perro",
    rating: 4.8,
  },

  // --- ALIMENTOS GATO ---
  {
    id: "cat-food-gourmet",
    name: "Purrfection Gourmet 3kg",
    image: "/products/cat-food-transparent.png",
    price: 78000,
    desc: "Pollo, salmón y batata. Libre de granos para una digestión superior.",
    category: "Alimento",
    petType: "Gato",
    rating: 4.9,
    isNew: true,
  },

  // --- JUGUETES ---
  {
    id: "dog-toy-rope",
    name: "Cuerda PawFlex Dura-Rope",
    image: "/products/dog-toy-transparent.png",
    price: 32000,
    desc: "Juguete interactivo de larga duración, resistente para las mordidas más fuertes.",
    category: "Juguetes",
    petType: "Perro",
    rating: 4.6,
  },
  {
    id: "cat-toy-feather",
    name: "Varita Mágica con Plumas",
    image: "/products/dog-toy-transparent.png", // Usando el mismo por ahora como placeholder o podrías generar más
    price: 15000,
    desc: "Estimula el instinto cazador de tu gato con esta varita interactiva.",
    category: "Juguetes",
    petType: "Gato",
    rating: 4.5,
  },

  // --- SNACKS ---
  {
    id: "dog-snack-chicken",
    name: "Tiritas de Pollo Natural",
    image: "/products/dog-food-transparent.png",
    price: 22000,
    desc: "Snacks 100% naturales, sin conservantes. El premio perfecto.",
    category: "Snacks",
    petType: "Perro",
    rating: 4.9,
  },
  {
    id: "cat-snack-salmon",
    name: "Bocaditos de Salmón",
    image: "/products/cat-food-transparent.png",
    price: 18000,
    desc: "Ricos en Omega 3 para una piel sana y pelaje brillante.",
    category: "Snacks",
    petType: "Gato",
    rating: 4.8,
  },

  // --- ACCESORIOS ---
  {
    id: "leather-leash",
    name: "Correa de Cuero Premium",
    image: "/products/dog-toy-transparent.png",
    price: 65000,
    desc: "Elegancia y resistencia en cada paseo. Cuero genuino cosido a mano.",
    category: "Accesorios",
    petType: "Perro",
    rating: 5.0,
  },
];
