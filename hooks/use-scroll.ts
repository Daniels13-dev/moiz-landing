"use client";

import { useState, useEffect } from "react";

export function useScroll(threshold: number = 20) {
  const [isScrolled, setIsScrolled] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.scrollY > threshold : false,
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Inicialización inmediata

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}
