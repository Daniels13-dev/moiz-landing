"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Este componente se encarga de detectar si el usuario llega con un token de recuperación
 * en la URL (hash) y redirigirlo a la página de actualización de contraseña.
 */
export function AuthRedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    // Escuchar cambios en la hash de la URL
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.includes("type=recovery")) {
        // Si es una recuperación de contraseña, redirigir a la página correspondiente
        // Supabase ya habrá procesado el token en el cliente
        router.push("/auth/update-password");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [router]);

  return null;
}
