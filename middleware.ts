import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/api/webhook/clerk",
  "/sign-in",
  "/sign-up",
]);

const isProtectedRoute = createRouteMatcher([
  "/",
  "/dashboard",
  "/profile(.*)",
]);

export default clerkMiddleware(async (auth, req) => {

  const { userId, redirectToSignIn } = await auth();

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/api/webhook/clerk",
    "/sign-in",
    "/sign-up",
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
