import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ Define Public Routes (Webhook should be public)
const isPublicRoute = createRouteMatcher(["/api/webhook/clerk"]);

// ✅ Define Protected Routes (Require Authentication)
const isProtectedRoute = createRouteMatcher(["/", "/dashboard", "/profile(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  console.log("🔍 Incoming request:", req.method, req.nextUrl.pathname);

  const { userId, redirectToSignIn } = await auth();

  // ✅ Allow Webhook Requests Without Authentication
  if (isPublicRoute(req)) {
    console.log("✅ Webhook request allowed:", req.nextUrl.pathname);
    return NextResponse.next();
  }

  // ✅ If user is NOT logged in AND NOT accessing `/sign-in`, redirect to sign-in
  if (!userId && req.nextUrl.pathname !== "/sign-in") {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // ✅ If user tries to access a protected route while logged out, redirect to sign-in
  if (isProtectedRoute(req) && !userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  return NextResponse.next();
});

// ✅ Ensure the Webhook Route is Allowed in Middleware Matching
export const config = {
  matcher: [
    "/api/webhook/clerk", // ✅ Ensure webhook is publicly accessible
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
