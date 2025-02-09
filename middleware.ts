import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes (EXCLUDING `/sign-in`)
const isProtectedRoute = createRouteMatcher(["/", "/dashboard", "/profile(.*)"]);

// Define public routes (Webhooks should be public)
const isPublicRoute = createRouteMatcher(["/api/webhook/clerk"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  console.log("🔍 Incoming request:", req);
  console.log("🔍 User ID:", userId);

  // ✅ Allow webhook requests to pass through without authentication
  if (isPublicRoute(req)) {
    console.log("✅ Webhook request allowed:", req.nextUrl.pathname);
    return NextResponse.next();
  }

  const url = new URL(req.url);

  // ✅ If user is logged out AND NOT accessing `/sign-in`, redirect to sign-in
  if (!userId && url.pathname !== "/sign-in") {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // ✅ If user tries to access a protected route while logged out, redirect to sign-in
  if (isProtectedRoute(req) && !userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
