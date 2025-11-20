import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const pathname = requestUrl.pathname

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Obtener usuario actual
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rutas que requieren autenticación
  // Nota: "/" coincide con todo, así que excluimos explícitamente /login abajo
  const protectedRoutes = ["/", "/products", "/settings"]
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // CASO A: Usuario logueado intenta acceder a /login
  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/", requestUrl.origin))
  }

  // CASO B: Usuario anónimo intenta acceder a ruta protegida
  // Excluimos /login para evitar bucle infinito
  if (!user && isProtectedRoute && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", requestUrl.origin))
  }

  // CASO C: Si llegó aquí y no hay usuario, pero está en /login, dejar pasar
  if (!user && pathname === "/login") {
    return supabaseResponse
  }

  // Verificar rol de staff (solo si es una ruta protegida y hay usuario)
  if (user && isProtectedRoute) {
    try {
      const { data: staffRecord, error } = await supabase
        .from("staff")
        .select("id, role_id")
        .eq("id", user.id)
        .single()

      if (error || !staffRecord) {
        console.warn(`⛔ Acceso denegado: El usuario ${user.email} no está en la tabla 'staff'.`)
        // Usuario logueado pero NO es staff - redirigir a login y desloguear
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL("/login", requestUrl.origin))
      }

      // Usuario es staff válido, permitir acceso
      return supabaseResponse
    } catch (error) {
      console.error("Error verificando rol de staff:", error)
      return NextResponse.redirect(new URL("/login", requestUrl.origin))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
