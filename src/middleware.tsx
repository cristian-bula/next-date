import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Evitar que el middleware actúe sobre las APIs
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const userCookie = request.cookies.get("token");
  if (!userCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Proteger todas las rutas excepto:
     * - /login
     * - /_next/*
     * - /favicon.ico
     * - /api/*
     */
    "/((?!login|_next|favicon.ico|api|manifest|robots).*)"
  ],
};
