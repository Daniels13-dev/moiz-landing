"use client";

import { Truck, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function QuickBadges() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm">
        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
          <Truck size={20} />
        </div>
        <div>
          <h4 className="font-bold text-zinc-900 text-sm">{siteConfig.ui.badges.express}</h4>
          <p className="text-xs text-zinc-500 font-medium">{siteConfig.ui.badges.expressDesc}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm">
        <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 className="font-bold text-zinc-900 text-sm">{siteConfig.ui.badges.guarantee}</h4>
          <p className="text-xs text-zinc-500 font-medium">{siteConfig.ui.badges.guaranteeDesc}</p>
        </div>
      </div>
    </div>
  );
}
