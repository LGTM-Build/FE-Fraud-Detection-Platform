import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES  = ["/", "/login", "/register"];
const PROTECTED_PREFIX = "/dashboard";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ambil token dari cookie (opsional — kalau pakai localStorage, middleware
  // tidak bisa baca langsung. Gunakan cookie sebagai sinyal login.)
  const token = req.cookies.get("fradara_access")?.value;

  const isProtected = pathname.startsWith(PROTECTED_PREFIX);
  const isPublic    = PUBLIC_ROUTES.includes(pathname);

  // Belum login, coba akses dashboard → redirect ke login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Sudah login, coba akses login/register → redirect ke dashboard
  if (isPublic && token && pathname !== "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)",
  ],
};