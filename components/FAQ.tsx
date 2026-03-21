"use client";

import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { faqData } from "@/data/faq";

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-zinc-100 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group transition-all"
      >
        <span
          className={`text-lg font-bold group-hover:text-[var(--moiz-green)] transition-colors ${isOpen ? "text-[var(--moiz-green)]" : "text-zinc-900"}`}
        >
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-[var(--moiz-green)] text-white" : "bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100"}`}
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-zinc-500 font-medium leading-relaxed max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <motion.section 
      id="faq" 
      className="py-16 md:py-24 bg-white overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] font-black text-xs uppercase tracking-widest mb-4">
            <HelpCircle size={14} />
            Soporte Möiz
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Todo lo que necesitas saber
          </h2>
          <p className="mt-4 text-lg text-zinc-500">
            Resolvemos tus dudas para que tú y tu michi tengan la mejor
            experiencia posible.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-4 md:p-10 border border-zinc-50 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          {faqData.map((item, idx) => (
            <FAQItem
              key={idx}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === idx}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>

        <div className="mt-16 p-8 rounded-3xl bg-zinc-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-2xl font-black mb-2">¿Aún tienes dudas?</h4>
            <p className="text-zinc-400 font-medium">
              Estamos listos para ayudarte vía WhatsApp.
            </p>
          </div>
          <a
            href="#contacto"
            className="px-8 py-4 bg-[var(--moiz-green)] hover:bg-[var(--moiz-green)]/90 text-white rounded-full font-bold transition-all hover:scale-105"
          >
            Hablar con un experto
          </a>
        </div>
      </div>
    </motion.section>
  );
}
