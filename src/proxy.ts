import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const clerkOptions = {
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
};

const isPublicRoute = createRouteMatcher([
  "/",
  "/robots.txt",
  "/sitemap.xml",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/events(.*)",
  "/newsletter(.*)",
  "/team(.*)",
  "/fintech(.*)",
  "/partners(.*)",
  "/join-us(.*)",
  "/contacts(.*)",
  "/about(.*)",
  "/divisions(.*)",
]);

const skipAuth =
  process.env.NODE_ENV === "development" &&
  process.env.SKIP_AUTH === "1";

export default clerkMiddleware(async (auth, req) => {
  if (skipAuth) return NextResponse.next();
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  return NextResponse.next();
}, clerkOptions);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
