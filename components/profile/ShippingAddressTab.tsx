"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

interface ShippingAddressTabProps {
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
  };
  setShippingAddress: (info: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
  }) => void;
  loading: boolean;
  handleUpdateAddress: (type: "SHIPPING" | "BILLING") => void;
}

export default function ShippingAddressTab({
  shippingAddress,
  setShippingAddress,
  loading,
  handleUpdateAddress,
}: ShippingAddressTabProps) {
  return (
    <motion.div
      key="shipping"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-black text-zinc-900 mb-2">{siteConfig.ui.profile.shippingAddress}</h2>
        <p className="text-zinc-500">{siteConfig.ui.profile.shippingAddressDesc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
            Nombre que recibe
          </label>
          <input
            type="text"
            value={shippingAddress.fullName}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                fullName: e.target.value,
              })
            }
            className="w-full h-14 px-6 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-[var(--moiz-green)] outline-none transition-all font-bold text-zinc-900"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
            Dirección Completa
          </label>
          <input
            type="text"
            placeholder="Calle, Apto, Barrio..."
            value={shippingAddress.street}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                street: e.target.value,
              })
            }
            className="w-full h-14 px-6 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-[var(--moiz-green)] outline-none transition-all font-bold text-zinc-900"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
            Ciudad
          </label>
          <input
            type="text"
            value={shippingAddress.city}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                city: e.target.value,
              })
            }
            className="w-full h-14 px-6 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-[var(--moiz-green)] outline-none transition-all font-bold text-zinc-900"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
            Departamento
          </label>
          <input
            type="text"
            value={shippingAddress.state}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                state: e.target.value,
              })
            }
            className="w-full h-14 px-6 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-[var(--moiz-green)] outline-none transition-all font-bold text-zinc-900"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
            Teléfono de contacto
          </label>
          <input
            type="tel"
            value={shippingAddress.phone}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                phone: e.target.value,
              })
            }
            className="w-full h-14 px-6 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-[var(--moiz-green)] outline-none transition-all font-bold text-zinc-900"
          />
        </div>
      </div>

      <button
        onClick={() => handleUpdateAddress("SHIPPING")}
        disabled={loading}
        className="btn-moiz bg-zinc-900 text-white w-full sm:w-auto px-10"
      >
        {loading ? "Guardando..." : "Guardar Dirección"}
      </button>
    </motion.div>
  );
}
