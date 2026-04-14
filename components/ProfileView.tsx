"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, CreditCard, Save, CheckCircle2, ChevronDown } from "lucide-react";
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

import { toggleFavorite, checkIfFavorite } from "@/app/actions/favorites";
import { siteConfig } from "@/config/site";

// Sub-components
import PersonalInfoTab from "./profile/PersonalInfoTab";
import ShippingAddressTab from "./profile/ShippingAddressTab";
import BillingAddressTab from "./profile/BillingAddressTab";

export default function ProfileView({ initialProfile }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"personal" | "shipping" | "billing">("personal");
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
            onClick={() => setActiveTab(tab.id as "personal" | "shipping" | "billing")}
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
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
