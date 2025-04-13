import { NextRequest, NextResponse } from "next/server";

const ADMIN_ROLE = 5320;

// Public paths that don't require authentication
const publicPaths = ["/login", "/register"];

// Admin-only paths
const adminPaths = ["/admin-panel"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to public paths for everyone
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const userRolesStr = request.cookies.get("userRoles")?.value;

  // If no token, allow access to all pages except admin
  if (!accessToken || !userRolesStr) {
    // Redirect to login if trying to access admin routes
    if (adminPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Allow access to all other routes
    return NextResponse.next();
  }

  try {
    const userRoles = JSON.parse(userRolesStr);
    const isAdmin = Array.isArray(userRoles) && userRoles.includes(ADMIN_ROLE);

    if (isAdmin) {
      // Redirect admin to admin panel if trying to access any other routes
      if (
        !adminPaths.some((path) => pathname.startsWith(path)) &&
        pathname !== "/login" &&
        pathname !== "/register"
      ) {
        return NextResponse.redirect(new URL("/admin-panel", request.url));
      }

      // Allow admin to access admin routes
      return NextResponse.next();
    } else {
      // Redirect regular users to home if trying to access admin routes
      if (adminPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Allow regular users to access all other routes
      return NextResponse.next();
    }
  } catch (error) {
    console.error("Error in middleware:", error);
    if (adminPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|api|public).*)",
  ],
};
