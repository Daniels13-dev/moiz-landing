export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: "Sostenibilidad" | "Cuidado Felino" | "Salud" | "Curiosidades";
  date: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "por-que-cambiar-arena-biodegradable",
    title: "Por qué cambiar a arena biodegradable salvará la salud de tu gato",
    excerpt: "La arena de maíz no solo es mejor para el planeta, sino que previene enfermedades respiratorias en tu michi.",
    category: "Sostenibilidad",
    date: "2024-04-09",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
    content: `# El cambio que tu gato y el planeta necesitan

La mayoría de las arenas convencionales utilizan bentonita de sodio, un mineral que, aunque efectivo para aglomerar, genera un polvo fino. Este polvo, al ser inhalado diariamente, puede provocar asma felina y alergias tanto en gatos como en sus dueños.

> "La salud de tu mascota comienza por su entorno. Elegir materiales libres de químicos es el primer paso para una vida larga y saludable." - Equipo de Bienestar Möiz

## Beneficios de la Arena de Maíz

1. **Cero Polvo:** Al ser una fibra vegetal tratada, no genera nubes de polvo tóxicas al ser excavada. Protege los pulmones de tu michi.
2. **Biodegradable y Compostable:** A diferencia de la arcilla, el maíz regresa a la tierra. Puedes desecharla por el inodoro o usarla para tu jardín.
3. **Control de Olor Orgánico:** Las partículas de maíz atrapan el amoníaco de forma natural, sin fragancias artificiales que irritan el olfato del gato.

### ¿Cómo hacer el cambio correctamente?

El olfato de un gato es 14 veces más sensible que el humano. No lo hagas de golpe para evitar rechazos:

*   **Semana 1:** 75% arena vieja, 25% Möiz.
*   **Semana 2:** 50% arena vieja, 50% Möiz.
*   **Semana 3:** 100% Möiz.

¡Tu gato te lo agradecerá con ronroneos y tú con un hogar más limpio!`,
  },
  {
    slug: "comparativa-bentonita-vs-maiz",
    title: "Bentonita vs Sílice vs Maíz: La verdad sobre lo que pisa tu gato",
    excerpt: "Analizamos los 3 materiales más comunes del mercado. Spoiler: El maíz gana en casi todo.",
    category: "Cuidado Felino",
    date: "2024-04-05",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=800",
    content: `# La batalla de las arenas: ¿Qué es lo mejor para tu michi?

Elegir la arena adecuada parece una tarea simple hasta que te enfrentas a las góndolas llenas de opciones químicas y minerales. La mayoría de nosotros crecimos usando bentonita o sílice, asumiendo que eran las únicas opciones. Sin embargo, la ciencia del bienestar animal ha avanzado hacia soluciones más humanas y sostenibles.

## El problema invisible de la Bentonita y el Sílice

La bentonita es un mineral extraído de minas que, aunque aglomera bien, libera un polvo de silicio que se pega a las patas y, lo que es peor, a los pulmones. El sílice, por otro lado, es un material sintético que no se biodegrada y puede ser áspero para las almohadillas sensibles de los gatos.

> "No deberías tener que elegir entre un hogar limpio y la salud de tu gato. La innovación en fibras vegetales como el maíz nos permite tener ambos sin compromisos."

A continuación, presentamos un **desglose técnico detallado** de por qué la transición hacia materiales orgánicos está redefiniendo los estándares de higiene en los hogares modernos:`,
  },
];
