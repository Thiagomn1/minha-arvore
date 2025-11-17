import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const url = req.nextUrl;

  // Protege rotas de admin
  if (url.pathname.startsWith("/admin")) {
    if (!token || token.role !== "Admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protege APIs de admin
  if (url.pathname.startsWith("/api/admin")) {
    if (!token || token.role !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
