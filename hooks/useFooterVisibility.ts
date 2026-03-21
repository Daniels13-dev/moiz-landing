"use client";

import { useState, useEffect } from "react";

export function useFooterVisibility() {
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    // Try to find the footer element by its unique ID
    const footerElement = document.getElementById("footer-marker");
    
    if (!footerElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0, // Trigger as soon as the footer enters the screen
      }
    );

    observer.observe(footerElement);

    return () => {
      observer.unobserve(footerElement);
      observer.disconnect();
    };
  }, []); 

  return isFooterVisible;
}
