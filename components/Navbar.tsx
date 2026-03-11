import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full bg-[var(--moiz-bg)] shadow-sm">

      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

        <Image
          src="/logo/logo.png"
          alt="MOIZ"
          width={45}
          height={40}
        />

        <div className="flex gap-6 font-medium">

          <a href="#producto">Producto</a>
          <a href="#beneficios">Beneficios</a>
          <a href="#contacto">Contacto</a>

        </div>

        <button className="bg-[var(--moiz-text)] text-white px-4 py-2 rounded-lg">
          Comprar
        </button>

      </div>

    </nav>
  );
}