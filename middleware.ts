import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET || "default-rauhan-portfolio-secret-change-in-production-32chars"
);

const COOKIE_NAME = "admin_session";

async function hasValidAdminSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return Boolean(payload?.userId);
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthed = await hasValidAdminSession(req);

  // Set current pathname in request headers for server components
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-admin-pathname", pathname);

  // 1. Handle Admin Web UI Routes (/admin/*)
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    // If visiting login page while already authenticated, redirect to /admin dashboard
    if (isLoginPage) {
      if (isAuthed) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // If accessing any protected admin route without a valid session, redirect to /admin/login
    if (!isAuthed) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Handle Admin API Routes (/api/admin/*)
  if (pathname.startsWith("/api/admin")) {
    if (!isAuthed) {
      return NextResponse.json(
        { error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
