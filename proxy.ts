import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export default async function proxy(request: NextRequest) {
  const host = request.headers.get("host");

  // Redirección de www a sin-www
  if (host?.startsWith("www.")) {
    const newHost = host.replace("www.", "");
    const url = request.nextUrl.clone();
    url.host = newHost;
    return NextResponse.redirect(url, 301);
  }

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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Verificamos el usuario de manera segura en el servidor de Edge (sin tocar la base de datos completa)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // /pedidos/[id] es público (invitados y redirecciones de Wompi necesitan ver su pedido)
  // /pedidos (solo la lista) sí requiere login
  const isOrderDetail = pathname.startsWith('/pedidos/') && pathname.length > '/pedidos/'.length;

  const isProtectedPath = 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/perfil') ||
    (pathname.startsWith('/pedidos') && !isOrderDetail); // Solo la lista requiere auth

  // 1. Bloqueo para NO Autenticados
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2. Bloqueo estricto para Admin
  if (request.nextUrl.pathname.startsWith('/admin') && user) {
    try {
      // Usamos la Service Role Key para bypasear el RLS y evitar recursión infinita en las políticas
      const adminClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: profile, error } = await adminClient
        .from('Profile')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('[proxy] Error fetching profile with service role:', error.message);
      } else {
        const role = profile?.role?.toUpperCase();
        const isAdminRole = role === 'ADMIN' || role === 'SUPERADMIN';

        if (!isAdminRole) {
          const url = request.nextUrl.clone();
          url.pathname = '/perfil';
          return NextResponse.redirect(url);
        }
      }
    } catch (err) {
      console.error('[proxy] Critical error in admin validation:', err);
      // En caso de error crítico en el proxy, permitimos continuar 
      // y dejamos que el AdminLayout (servidor) valide la seguridad.
      // Esto evita el 404 generalizado.
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Intercepta TODAS las rutas excepto archivos estáticos, imágenes, favicon, sitemap, robots y rutas /api
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
