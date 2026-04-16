"use client";

import { motion } from "framer-motion";
import { Save, ChevronDown } from "lucide-react";
import { countries } from "@/config/constants";
import { siteConfig } from "@/config/site";

interface PersonalInfoTabProps {
  personalInfo: {
    fullName: string;
    phone: string;
    phoneCountry: string;
    idNumber: string;
    idType: string;
  };
  setPersonalInfo: (info: {
    fullName: string;
    phone: string;
    phoneCountry: string;
    idNumber: string;
    idType: string;
  }) => void;
  email: string;
  loading: boolean;
  handleUpdateProfile: () => void;
}

export default function PersonalInfoTab({
  personalInfo,
  setPersonalInfo,
  email,
  loading,
  handleUpdateProfile,
}: PersonalInfoTabProps) {
  return (
    <motion.div
      key="personal"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-black text-zinc-900 mb-2">{siteConfig.ui.profile.personalInfo}</h2>
        <p className="text-zinc-500">{siteConfig.ui.profile.personalInfoDesc}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
            Email (Protegido)
          </label>
          <input
            type="email"
            disabled
            value={email}
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
  );
}
