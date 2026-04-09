"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  CreditCard,
  Save,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { updateProfile, upsertAddress } from "@/app/actions/profile";
import { toast } from "sonner";

interface Address {
  id?: string;
  type: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
}

interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  phoneCountry: string | null;
  idNumber: string | null;
  idType: string | null;
  addresses: Address[];
}

interface ProfileViewProps {
  initialProfile: Profile;
}

import { countries, idTypes } from "@/config/constants";
import { SelectInputGrid } from "@/components/ui/FormInput";

export default function ProfileView({ initialProfile }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<
    "personal" | "shipping" | "billing"
  >("personal");
  const [loading, setLoading] = useState(false);

  // Form States
  const [personalInfo, setPersonalInfo] = useState({
    fullName: initialProfile.fullName || "",
    phone: initialProfile.phone || "",
    phoneCountry: initialProfile.phoneCountry || "+57",
    idNumber: initialProfile.idNumber || "",
    idType: initialProfile.idType || "CC",
  });

  const getAddressByType = (type: string) =>
    initialProfile.addresses.find((a) => a.type === type) || {
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      country: "Colombia",
    };

  const [shippingAddress, setShippingAddress] = useState(
    getAddressByType("SHIPPING"),
  );
  const [billingAddress, setBillingAddress] = useState(
    getAddressByType("BILLING"),
  );
  const [sameAsShipping, setSameAsShipping] = useState(false);

  const handleUpdateProfile = async () => {
    setLoading(true);
    const result = await updateProfile(personalInfo);
    if (result.success) {
      toast.success("Información personal actualizada");
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleUpdateAddress = async (type: "SHIPPING" | "BILLING") => {
    setLoading(true);
    const data =
      type === "SHIPPING"
        ? shippingAddress
        : sameAsShipping
          ? shippingAddress
          : billingAddress;
    const result = await upsertAddress({
      ...data,
      type,
    } as Address & { type: "SHIPPING" | "BILLING" });

    if (result.success) {
      toast.success(
        `Dirección de ${type === "SHIPPING" ? "envío" : "facturación"} guardada`,
      );
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: <User size={18} /> },
    { id: "shipping", label: "Envío", icon: <MapPin size={18} /> },
    { id: "billing", label: "Facturación", icon: <CreditCard size={18} /> },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`w-full flex items-center gap-4 px-6 py-5 rounded-3xl transition-all duration-300 font-bold border ${
              activeTab === tab.id
                ? "bg-white border-zinc-200 text-zinc-900 shadow-xl shadow-zinc-200/50 translate-x-2"
                : "bg-transparent border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                activeTab === tab.id
                  ? "bg-[var(--moiz-green)] text-white"
                  : "bg-zinc-100 text-zinc-400"
              }`}
            >
              {tab.icon}
            </div>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Canvas */}
      <div className="lg:col-span-8">
        <div className="bg-white rounded-[3rem] border border-zinc-100 p-8 md:p-12 shadow-sm min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === "personal" && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 mb-2">
                    Información Personal
                  </h2>
                  <p className="text-zinc-500">
                    Estos datos se usarán para tus pedidos y contacto.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
                      Email (Protegido)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={initialProfile.email}
                      className="w-full h-14 px-6 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 font-medium cursor-not-allowed outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={personalInfo.fullName}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          fullName: e.target.value,
                        })
                      }
                      placeholder="Ej: Daniel Sánchez"
                      className="w-full h-14 px-6 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-[var(--moiz-green)] outline-none transition-all font-bold text-zinc-900 placeholder:text-zinc-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
                      Documento de Identificación
                    </label>
                    <div className="grid grid-cols-12 gap-3">
                      <div className="relative col-span-3">
                        <select
                          value={personalInfo.idType}
                          onChange={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              idType: e.target.value,
                            })
                          }
                          className="w-full h-14 pl-5 pr-8 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-[var(--moiz-green)] outline-none transition-all font-bold text-zinc-900 cursor-pointer appearance-none"
                        >
                          <option value="CC">CC</option>
                          <option value="CE">CE</option>
                          <option value="NIT">NIT</option>
                          <option value="PAS">PAS</option>
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                        />
                      </div>
                      <input
                        type="text"
                        value={personalInfo.idNumber}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            idNumber: e.target.value,
                          })
                        }
                        placeholder="Número de documento"
                        className="col-span-9 h-14 px-6 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-[var(--moiz-green)] outline-none transition-all font-bold text-zinc-900 placeholder:text-zinc-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
                      Teléfono Móvil
                    </label>
                    <div className="grid grid-cols-12 gap-3">
                      <div className="relative col-span-3">
                        <select
                          value={personalInfo.phoneCountry}
                          onChange={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              phoneCountry: e.target.value,
                            })
                          }
                          className="w-full h-14 pl-4 pr-8 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-[var(--moiz-green)] outline-none transition-all font-bold text-zinc-900 cursor-pointer appearance-none"
                        >
                          {countries.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                        />
                      </div>
                      <input
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            phone: e.target.value,
                          })
                        }
                        placeholder="300 000 0000"
                        className="col-span-9 h-14 px-6 rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-[var(--moiz-green)] outline-none transition-all font-bold text-zinc-900 placeholder:text-zinc-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="btn-moiz bg-zinc-900 text-white w-full sm:w-auto px-12 disabled:opacity-50"
                  >
                    {loading ? "Guardando..." : "Actualizar mis datos"}
                    {!loading && <Save size={18} />}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "shipping" && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 mb-2">
                    Dirección de Envío
                  </h2>
                  <p className="text-zinc-500">
                    ¿A dónde enviamos tus productos Moiz?
                  </p>
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
            )}

            {activeTab === "billing" && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-zinc-900 mb-2">
                      Datos de Facturación
                    </h2>
                    <p className="text-zinc-500">
                      Para generar tus recibos y facturas legales.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 p-2 rounded-2xl">
                    <span className="text-xs font-bold text-zinc-500 ml-2">
                      ¿Igual que envío?
                    </span>
                    <button
                      onClick={() => setSameAsShipping(!sameAsShipping)}
                      className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                        sameAsShipping
                          ? "bg-[var(--moiz-green)]"
                          : "bg-zinc-300"
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
                    {/* ... other billing fields ... */}
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
                      <h4 className="font-bold text-green-900">
                        Sincronizado con Envío
                      </h4>
                      <p className="text-green-700/70 text-sm">
                        Se utilizará la misma información de tu dirección de
                        envío para la facturación.
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
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
