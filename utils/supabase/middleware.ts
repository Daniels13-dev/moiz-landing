import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run on static files or specific routes
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && !error.message.includes("Auth session missing!")) {
    console.warn("Middleware Auth Error:", error.message);
  }

  // --- PRIVATE ROUTES PROTECTION ---
  // If the user tries to access /admin and is not logged in, redirect to /login
  if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/login") {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // --- AUTH REDIRECTION ---
  // If logged in user tries to access login or register, intelligently redirect them via their destination logic (default to home here, the page component will redirect them if needed)
  if (
    user &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/registro"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/"; // Safety fallback. The actual role logic will run in their destination layout
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
