"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function GlobalFlyToCart() {
  const { lastAddedItem, setLastAddedItem } = useCart();
  const [cartPos, setCartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Update cart icon position on mount and resize
    const updatePos = () => {
      const el = document.getElementById("cart-icon-desktop");
      if (el) {
        const rect = el.getBoundingClientRect();
        setCartPos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    };

    updatePos();
    window.addEventListener("resize", updatePos);
    return () => window.removeEventListener("resize", updatePos);
  }, []);

  return (
    <AnimatePresence>
      {lastAddedItem && (
        <motion.div
          key={`${lastAddedItem.id}-${lastAddedItem.x}-${lastAddedItem.y}`}
          initial={{
            position: "fixed",
            left: lastAddedItem.x,
            top: lastAddedItem.y,
            width: 80,
            height: 80,
            opacity: 1,
            scale: 1,
            zIndex: 9999,
          }}
          animate={{
            left: cartPos.x - 20, // Adjust to center of cart icon
            top: cartPos.y - 20,
            width: 20,
            height: 20,
            opacity: 0.5,
            scale: 0.2,
          }}
          exit={{
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: 0.8,
            ease: [0.45, 0, 0.55, 1], // Custom cubic bezier for a "swoosh" effect
          }}
          onAnimationComplete={() => {
            // Provide a small delay before clearing to ensure smooth transition
            setTimeout(() => setLastAddedItem(null), 100);
          }}
          className="pointer-events-none"
        >
          <div className="relative w-full h-full bg-white rounded-full shadow-2xl p-2 flex items-center justify-center border-2 border-[var(--moiz-green)]">
            <div className="relative w-full h-full">
                <Image
                src={lastAddedItem.image}
                alt="Fly"
                fill
                className="object-contain"
                />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
