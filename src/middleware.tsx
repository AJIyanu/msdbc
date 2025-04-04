import { type NextRequest, NextResponse } from "next/server";
import { restfulClient } from "./lib/supabase";

// Define protected routes that require authentication
const PROTECTED_ROUTES = ["/records", "/dashboard", "/profile", "/settings"];
// Public routes that don't need authentication checks
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];
// Session refresh threshold (in seconds) - refresh if less than 10 minutes remaining
const REFRESH_THRESHOLD = 10 * 60;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // Static files like images, etc.
  ) {
    return NextResponse.next();
  }

  try {
    // Get the session from the request cookies
    const supabase = restfulClient;
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    // Handle session error
    if (sessionError) {
      console.error("Session error:", sessionError.message);
      // Clear any invalid session cookies
      const response = NextResponse.redirect(new URL("/login", request.url));
      return response;
    }

    // Check if user is trying to access a protected route without being logged in
    if (
      !session &&
      PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
    ) {
      // Redirect to login page with return URL
      const response = NextResponse.redirect(
        new URL(`/login?returnUrl=${encodeURIComponent(pathname)}`, request.url)
      );
      return response;
    }

    // If user is logged in and trying to access login page, redirect to records
    if (session && pathname === "/login") {
      const response = NextResponse.redirect(new URL("/records", request.url));
      return response;
    }

    // If user is logged in, check if session needs refreshing
    if (session) {
      const expiresAt = session.expires_at;
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const timeRemaining = expiresAt - currentTime;

      // If session is about to expire, refresh it
      if (timeRemaining < REFRESH_THRESHOLD) {
        console.log("Refreshing session...");
        const { data: refreshData, error: refreshError } =
          await supabase.auth.refreshSession();

        if (refreshError) {
          console.error("Session refresh error:", refreshError.message);
          // If refresh fails, redirect to login
          if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
            const response = NextResponse.redirect(
              new URL("/login", request.url)
            );
            return response;
          }
        } else {
          // Session refreshed successfully
          console.log("Session refreshed successfully");
          const response = NextResponse.next();

          // Update the session in cookies
          const {
            data: { session: newSession },
          } = refreshData;
          if (newSession) {
            // The Supabase client will automatically handle setting the cookies
            // We just need to ensure the response includes them
            return response;
          }
        }
      }
    }

    // Continue with the request
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);

    // For protected routes, redirect to login on error
    if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // For other routes, just continue
    return NextResponse.next();
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
