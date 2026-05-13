"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { User, MapPin, CreditCard } from "lucide-react";
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

// Sub-components
import PersonalInfoTab from "./profile/PersonalInfoTab";
import ShippingAddressTab from "./profile/ShippingAddressTab";
import BillingAddressTab from "./profile/BillingAddressTab";
import SecurityTab from "./profile/SecurityTab";
import { deleteAccount } from "@/app/actions/profile";
import { useRouter } from "next/navigation";
import { Shield, AlertTriangle, Loader2 } from "lucide-react";

export default function ProfileView({ initialProfile }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"personal" | "shipping" | "billing" | "security">("personal");
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

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

  const [shippingAddress, setShippingAddress] = useState(getAddressByType("SHIPPING"));
  const [billingAddress, setBillingAddress] = useState(getAddressByType("BILLING"));
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
      type === "SHIPPING" ? shippingAddress : sameAsShipping ? shippingAddress : billingAddress;
    const result = await upsertAddress({
      ...data,
      type,
    } as Address & { type: "SHIPPING" | "BILLING" });

    if (result.success) {
      toast.success(`Dirección de ${type === "SHIPPING" ? "envío" : "facturación"} guardada`);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const result = await deleteAccount();
    if (result.success) {
      toast.success("Cuenta eliminada correctamente. Te extrañaremos.");
      router.push("/");
    } else {
      toast.error(result.error);
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: <User size={18} /> },
    { id: "shipping", label: "Envío", icon: <MapPin size={18} /> },
    { id: "billing", label: "Facturación", icon: <CreditCard size={18} /> },
    { id: "security", label: "Seguridad", icon: <Shield size={18} /> },
  ];

  return (
    <>
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
                <PersonalInfoTab
                  personalInfo={personalInfo}
                  setPersonalInfo={setPersonalInfo}
                  email={initialProfile.email}
                  loading={loading}
                  handleUpdateProfile={handleUpdateProfile}
                />
              )}

              {activeTab === "shipping" && (
                <ShippingAddressTab
                  shippingAddress={shippingAddress}
                  setShippingAddress={setShippingAddress}
                  loading={loading}
                  handleUpdateAddress={handleUpdateAddress}
                />
              )}

              {activeTab === "billing" && (
                <BillingAddressTab
                  billingAddress={billingAddress}
                  setBillingAddress={setBillingAddress}
                  sameAsShipping={sameAsShipping}
                  setSameAsShipping={setSameAsShipping}
                  loading={loading}
                  handleUpdateAddress={handleUpdateAddress}
                />
              )}

              {activeTab === "security" && (
                <SecurityTab onDeleteAccount={() => setIsDeleteModalOpen(true)} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mb-6">
                  <AlertTriangle size={40} />
                </div>
                
                <h3 className="text-2xl font-black text-zinc-900 tracking-tight mb-4">
                  ¿Estás completamente seguro?
                </h3>
                
                <div className="bg-red-50/50 p-6 rounded-3xl mb-8">
                  <p className="text-sm text-red-900 font-bold leading-relaxed">
                    Esta acción no se puede deshacer. Perderás el acceso a tus pedidos, suscripciones y datos de cliente permanentemente.
                  </p>
                </div>

                <div className="flex flex-col w-full gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                    Sí, eliminar mi cuenta
                  </button>
                  
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                    className="w-full py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
