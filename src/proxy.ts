/**
 * Proxy (Middleware) de autenticação e autorização do Next.js 16
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Rotas que requerem autenticação
const protectedRoutes = ["/perfil", "/pedidos", "/carrinho"];

// Rotas que requerem role Admin
const adminRoutes = ["/admin"];

// Rotas de autenticação (redirecionar se já autenticado)
const authRoutes = ["/login", "/registro"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Obter token de autenticação
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Verificar se é rota de admin (páginas)
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute) {
    if (!token) {
      // Não autenticado - redirecionar para login
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (token.role !== "Admin") {
      // Autenticado mas não é admin - redirecionar para home
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Proteger APIs de admin
  if (pathname.startsWith("/api/admin")) {
    if (!token || token.role !== "Admin") {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores." },
        { status: 403 }
      );
    }
  }

  // Verificar se é rota protegida (requer autenticação)
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isProtectedRoute && !token) {
    // Não autenticado - redirecionar para login
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Redirecionar usuários autenticados que tentam acessar login/registro
  const isAuthRoute = authRoutes.some((route) => pathname === route);
  if (isAuthRoute && token) {
    // Já autenticado - redirecionar para home ou callbackUrl
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    return NextResponse.redirect(new URL(callbackUrl || "/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/perfil/:path*",
    "/pedidos/:path*",
    "/carrinho",
    "/login",
    "/registro",
  ],
};
