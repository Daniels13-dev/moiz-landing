import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // si "next" esta en search params, usarlo como redireccion URL
  let next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && session?.user) {
      try {
        const profile = await prisma.profile.findUnique({
          where: { id: session.user.id },
          select: { role: true },
        });
        if (profile?.role?.toUpperCase() === "ADMIN" && next === "/") {
          next = "/admin";
        }
      } catch (e) {
        console.error("Failed to check user role in callback:", e);
      }

      const forwardedHost = request.headers.get("x-forwarded-host"); // placeholder for top-level direct deployment
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no proxy in between in local env
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
