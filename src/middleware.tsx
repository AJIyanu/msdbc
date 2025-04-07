import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const PROTECTED_ROUTES = ["/records", "/dashboard", "/profile", "/settings"];
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Skip middleware for static and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname === "/logout") {
    // Sign out the user
    await supabase.auth.signOut();

    // Redirect to home or login page
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Try to get user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // If there's an error fetching user or user is null
  if (userError || !user) {
    // Refresh session in case it's just expired
    const { data: refreshData, error: refreshError } =
      await supabase.auth.refreshSession();

    if (refreshError || !refreshData.session) {
      // Still no valid session, redirect to login if on protected route
      if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
        const redirectUrl = new URL(
          `/login?returnUrl=${encodeURIComponent(pathname)}`,
          origin
        );
        return NextResponse.redirect(redirectUrl);
      }

      return res;
    }
  }

  // If user is authenticated and trying to access login/register/forgot pages, redirect to default page
  if (user && PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/records", origin));
  }

  return res;
}

// Middleware config
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
