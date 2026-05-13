"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

// --- LOGIN ---
export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let errorMessage = error.message;

    if (errorMessage === "Invalid login credentials") {
      errorMessage = "Correo o contraseña incorrectos. Por favor, verifica tus datos.";
    } else if (errorMessage === "Email not confirmed") {
      errorMessage = "Tu Correo electrónico no ha sido confirmado.";
    }

    return { error: errorMessage };
  }

  let destination = "/";
  if (data?.user) {
    try {
      // Upsert to guarantee the profile exists in DB in case they were created manually from the Supabase Dashboard
      const profile = await prisma.profile.upsert({
        where: { id: data.user.id },
        update: {},
        create: {
          id: data.user.id,
          email: data.user.email!,
          role: "USER",
        },
      });

      // Case-insensitive role check
      const role = profile?.role?.toUpperCase();
      if (role === "ADMIN" || role === "SUPERADMIN") {
        destination = "/admin";
      }
    } catch (e) {
      console.error("Failed to fetch or sync user profile on login:", e);
    }
  }

  revalidatePath("/", "layout");
  redirect(destination);
}

// Password validation logic
function validatePassword(password: string) {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isLongEnough = password.length >= 8;

  if (!isLongEnough) return "La contraseña debe tener al menos 8 caracteres.";
  if (!hasUpperCase) return "La contraseña debe tener al menos una letra mayúscula.";
  if (!hasLowerCase) return "La contraseña debe tener al menos una letra minúscula.";
  if (!hasNumber) return "La contraseña debe tener al menos un número.";

  return null;
}

// --- SIGNUP ---
export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Validate password
  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError };
  }

  // Check if User already exists in Profile to provide better feedback
  const existingProfile = await prisma.profile.findUnique({
    where: { email },
  });

  if (existingProfile) {
    return {
      error: "Este correo electrónico ya está registrado. Intenta iniciar sesión.",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        phone: phone,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Security Note: If data.user exists but identities is empty, it means the user was already in Supabase
  // but not in our Profile table (uncommon) or we just didn't catch it.
  if (data?.user && data.user.identities?.length === 0) {
    return {
      error: "Este correo electrónico ya está registrado. Intenta iniciar sesión.",
    };
  }

  // If user is successfully created in Supabase Auth, create Profile record in Prisma
  if (data?.user) {
    try {
      await prisma.profile.upsert({
        where: { id: data.user.id },
        update: {
          email: data.user.email!,
          fullName: fullName,
          phone: phone,
        },
        create: {
          id: data.user.id,
          email: data.user.email!,
          fullName: fullName,
          phone: phone,
        },
      });
    } catch (dbError) {
      console.error("Error creating profile record:", dbError);
      // Profile might already exist if they are retrying registration after error but auth succeeded
    }
  }

  // If email confirmation is enabled, data.session will be null.
  // If it's disabled, data.session will contain the session and we can redirect.
  if (data?.session) {
    revalidatePath("/", "layout");
    redirect("/productos");
  }

  return { success: "Revisa tu correo." };
}

// --- LOGOUT ---
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

// --- RESET PASSWORD ---
export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;
  
  // Detectar el origen dinámicamente para que funcione en local (3001) y producción
  const isLocal = process.env.NODE_ENV === "development";
  const origin = isLocal 
    ? "http://localhost:3001" 
    : (process.env.NEXT_PUBLIC_SITE_URL || "https://moizpets.com");

  try {
    // 1. Generar el enlace de recuperación manualmente usando el cliente admin
    const { createAdminClient } = await import("@/utils/supabase/admin");
    const adminSupabase = createAdminClient();
    
    const { data, error: linkError } = await adminSupabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${origin}/auth/callback?next=/auth/update-password`,
      }
    });

    if (linkError) {
      console.error("Error generating reset link:", linkError.message);
      return { error: "No pudimos generar el enlace. Verifica que el correo sea correcto." };
    }

    const resetLink = data.properties?.action_link;

    if (!resetLink) {
      return { error: "Error interno al generar el enlace de recuperación." };
    }

    // 2. Enviar el correo personalizado a través de Resend
    const { sendEmail } = await import("@/lib/email");
    
    const htmlContent = `
      <div style="font-family: 'Geist', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border-radius: 24px; border: 1px solid #f0f0f0;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #6a8e2a; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: -1px;">Möiz</h1>
          <p style="color: #888; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px;">Bienestar Animal</p>
        </div>
        
        <div style="margin-bottom: 32px;">
          <h2 style="color: #111; font-size: 24px; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.5px;">Recupera tu acceso</h2>
          <p style="color: #444; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Hola, hemos recibido una solicitud para restablecer tu contraseña en <strong>Möiz</strong>. Si no fuiste tú, puedes ignorar este correo.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetLink}" style="background-color: #6a8e2a; color: #ffffff; padding: 16px 32px; border-radius: 100px; text-decoration: none; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 10px 20px rgba(106, 142, 42, 0.2);">
              Restablecer Contraseña
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px; line-height: 1.6;">
            Este enlace expirará en 24 horas por motivos de seguridad.
          </p>
        </div>
        
        <div style="border-top: 1px solid #f0f0f0; padding-top: 24px; text-align: center;">
          <p style="color: #aaa; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Möiz Bienestar Animal SAS. Todos los derechos reservados.
          </p>
        </div>
      </div>
    `;

    const emailResult = await sendEmail({
      to: email,
      subject: "Recupera tu contraseña en Möiz",
      html: htmlContent,
    });

    if (!emailResult.success) {
      return { error: "Error al enviar el correo. Por favor intenta más tarde." };
    }

    return { success: "Hemos enviado un correo personalizado con las instrucciones a tu cuenta." };

  } catch (error) {
    console.error("Error in resetPassword action:", error);
    return { error: "Ocurrió un error inesperado al procesar tu solicitud." };
  }
}

// --- LOGIN WITH GOOGLE ---
export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
  } else if (data.url) {
    redirect(data.url);
  }
}

// --- GET CURRENT USER ROLE SAFELY ---
export async function getUserRole() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    return profile?.role || null;
  } catch (error) {
    console.error("Error fetching user role via Server Action", error);
    return null;
  }
}
