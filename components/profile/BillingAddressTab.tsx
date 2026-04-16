"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";

interface BillingAddressTabProps {
  billingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
  };
  setBillingAddress: (info: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
  }) => void;
  sameAsShipping: boolean;
  setSameAsShipping: (val: boolean) => void;
  loading: boolean;
  handleUpdateAddress: (type: "SHIPPING" | "BILLING") => void;
}

export default function BillingAddressTab({
  billingAddress,
  setBillingAddress,
  sameAsShipping,
  setSameAsShipping,
  loading,
  handleUpdateAddress,
}: BillingAddressTabProps) {
  return (
    <motion.div
      key="billing"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 mb-2">{siteConfig.ui.profile.billingData}</h2>
          <p className="text-zinc-500">{siteConfig.ui.profile.billingDataDesc}</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 p-2 rounded-2xl">
          <span className="text-xs font-bold text-zinc-500 ml-2">{siteConfig.ui.profile.sameAsShipping}</span>
          <button
            onClick={() => setSameAsShipping(!sameAsShipping)}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
              sameAsShipping ? "bg-[var(--moiz-green)]" : "bg-zinc-300"
            }`}
          >
            <motion.div
              animate={{ x: sameAsShipping ? 24 : 0 }}
              className="w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>
      </div>

      {!sameAsShipping ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
              Nombre o Razón Social
            </label>
            <input
              type="text"
              value={billingAddress.fullName}
              onChange={(e) =>
                setBillingAddress({
                  ...billingAddress,
                  fullName: e.target.value,
                })
              }
              className="w-full h-14 px-6 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-[var(--moiz-green)] outline-none transition-all font-bold text-zinc-900"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
              Dirección Fiscal
            </label>
            <input
              type="text"
              value={billingAddress.street}
              onChange={(e) =>
                setBillingAddress({
                  ...billingAddress,
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
              value={billingAddress.city}
              onChange={(e) =>
                setBillingAddress({
                  ...billingAddress,
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
              value={billingAddress.state}
              onChange={(e) =>
                setBillingAddress({
                  ...billingAddress,
                  state: e.target.value,
                })
              }
              className="w-full h-14 px-6 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-[var(--moiz-green)] outline-none transition-all font-bold text-zinc-900"
            />
          </div>
        </div>
      ) : (
        <div className="bg-green-50/50 border border-green-100 rounded-[2rem] p-8 flex items-center gap-6">
          <div className="w-14 h-14 bg-green-100 text-[var(--moiz-green)] rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-green-900">{siteConfig.ui.profile.synced}</h4>
            <p className="text-green-700/70 text-sm">
              Se utilizará la misma información de tu dirección de envío para la facturación.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => handleUpdateAddress("BILLING")}
        disabled={loading}
        className="btn-moiz bg-zinc-900 text-white w-full sm:w-auto px-10"
      >
        {loading ? "Guardando..." : "Guardar Facturación"}
      </button>
    </motion.div>
  );
}
