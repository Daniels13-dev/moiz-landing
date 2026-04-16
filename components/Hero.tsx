"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { buttonVariants, cn } from "@/components/ui/button";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen lg:h-[calc(100vh-45px)] flex flex-col items-center justify-center overflow-hidden bg-white py-0 px-4"
    >
      {/* Background Ambience: Massive gradient blurry orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[var(--moiz-green)]/15 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[var(--moiz-yellow)]/15 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />

      {/* Top Floating Badge */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 mb-6 md:mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--moiz-green)]/20 bg-white/60 backdrop-blur-md shadow-sm"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--moiz-green)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--moiz-green)]"></span>
        </span>
        <span className="text-[var(--moiz-green)] text-xs md:text-sm font-bold tracking-widest uppercase">
          {siteConfig.ui.badges.heroBadge}
        </span>
      </motion.div>

      {/* Massive Overlapping Typography */}
      <div className="relative z-10 w-full text-center px-4">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-[2.5rem] sm:text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-extrabold leading-[0.85] tracking-tighter text-zinc-900 drop-shadow-sm"
        >
          {siteConfig.content.heroTitle} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--moiz-green)] via-[#86A93C] to-[#E6B800]">
            {siteConfig.content.heroSubtitle}
          </span>
        </motion.h1>
      </div>

      {/* Hero Product Image: Breaking the grid and overlapping the text */}
      <motion.div
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2, type: "spring", bounce: 0.4 }}
        className="relative z-20 mt-[-1rem] sm:mt-[-2rem] md:mt-[-3rem] lg:mt-[-4rem] pointer-events-none flex justify-center w-full max-w-lg md:max-w-xl"
      >
        <Image
          src="https://res.cloudinary.com/dvyqtn7gy/image/upload/v1776223133/moiz/logo/moiz.png"
          alt="Empaque de arena ecológica Möiz hecha de maíz natural para gatos"
          width={900}
          height={900}
          priority
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          className="w-[65vw] max-w-[280px] sm:max-w-[350px] lg:max-w-[400px] h-auto object-contain filter drop-shadow-[0_30px_50px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform duration-700"
        />
      </motion.div>

      {/* Bottom Action Area */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-30 mt-[-2rem] md:mt-[-5rem] flex flex-col items-center gap-6 px-6 text-center shadow-none"
      >
        <p className="text-xs md:text-sm font-medium text-zinc-500 max-w-lg leading-relaxed">
          <span className="text-zinc-900 font-bold block mb-1">
            {siteConfig.content.heroTagline}
          </span>
          {siteConfig.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <Link
            href="/productos"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "group relative overflow-hidden shadow-[0_10px_40px_rgba(106,142,42,0.4)] hover:shadow-[0_15px_50px_rgba(106,142,42,0.6)] hover:-translate-y-1",
            )}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            {siteConfig.ui.badges.heroCta}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Top Floating Badges (Parallax Effect) */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="hidden xl:flex absolute top-[25%] left-[8%] z-30 bg-white/70 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] items-center gap-4 border border-white/50"
      >
        <div className="w-12 h-12 bg-green-50 text-[var(--moiz-green)] rounded-2xl flex items-center justify-center text-2xl">
          🌱
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-zinc-900 text-base">{siteConfig.ui.badges.organic}</span>
          <span className="text-sm text-zinc-500 font-medium">{siteConfig.ui.badges.organicDesc}</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          repeat: Infinity,
          duration: 7,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="hidden xl:flex absolute top-[28%] right-[10%] z-30 bg-white/70 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] items-center gap-4 border border-white/50"
      >
        <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center text-2xl">
          🍖
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-zinc-900 text-base">{siteConfig.ui.badges.nutrition}</span>
          <span className="text-sm text-zinc-500 font-medium">{siteConfig.ui.badges.nutritionDesc}</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{
          repeat: Infinity,
          duration: 5.5,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="hidden xl:flex absolute bottom-[28%] left-[10%] z-30 bg-white/70 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] items-center gap-4 border border-white/50"
      >
        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl">
          🧴
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-zinc-900 text-base">{siteConfig.ui.badges.hygiene}</span>
          <span className="text-sm text-zinc-500 font-medium">{siteConfig.ui.badges.hygieneDesc}</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
          delay: 1,
        }}
        className="hidden xl:flex absolute bottom-[25%] right-[8%] z-30 bg-white/70 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] items-center gap-4 border border-white/50"
      >
        <div className="flex -space-x-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-yellow-50 border-2 border-white shadow-sm flex items-center justify-center"
            >
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-zinc-900 text-base">
            {siteConfig.stats.rating} {siteConfig.ui.badges.ratingSuffix}
          </span>
          <span className="text-sm text-zinc-500 font-medium">
            {siteConfig.stats.happyPets} {siteConfig.ui.badges.happyPetsSuffix}
          </span>
        </div>
      </motion.div>
    </section>
  );
}
