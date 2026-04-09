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
      errorMessage =
        "Correo o contraseña incorrectos. Por favor, verifica tus datos.";
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
      if (profile?.role?.toUpperCase() === "ADMIN") {
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
  if (!hasUpperCase)
    return "La contraseña debe tener al menos una letra mayúscula.";
  if (!hasLowerCase)
    return "La contraseña debe tener al menos una letra minúscula.";
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
      error:
        "Este correo electrónico ya está registrado. Intenta iniciar sesión.",
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
      error:
        "Este correo electrónico ya está registrado. Intenta iniciar sesión.",
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
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/admin/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Instrucciones de recuperación enviadas a tu correo." };
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
