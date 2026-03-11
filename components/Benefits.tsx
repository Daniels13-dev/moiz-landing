import { Leaf, ShieldCheck, Droplets, Recycle } from "lucide-react";

export default function Benefits() {

  const benefits = [
    { icon: <Leaf size={32} />, text: "100% Natural" },
    { icon: <Recycle size={32} />, text: "Biodegradable" },
    { icon: <ShieldCheck size={32} />, text: "Seguro para gatos" },
    { icon: <Droplets size={32} />, text: "Control de olores" },
  ];

  return (
    <section
      id="beneficios"
      className="py-20 bg-[var(--moiz-bg)]"
    >

      <h2 className="text-4xl text-center font-bold text-[var(--moiz-green)] mb-12">
        Beneficios
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">

        {benefits.map((b, i) => (

          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow text-center"
          >

            <div className="flex justify-center text-[var(--moiz-green)] mb-4">
              {b.icon}
            </div>

            <p className="font-semibold">
              {b.text}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}