import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const isPublicRoute = createRouteMatcher([
  "/",
  "/(en|it|bg)",
  "/(en|it|bg)/sign-in(.*)",
  "/(en|it|bg)/sign-up(.*)",
  "/(en|it|bg)/events(.*)",
  "/(en|it|bg)/newsletter(.*)",
  "/(en|it|bg)/team(.*)",
  "/(en|it|bg)/gallery(.*)",
  "/(en|it|bg)/projects(.*)",
  "/(en|it|bg)/join-us(.*)",
  "/(en|it|bg)/contacts(.*)",
  "/(en|it|bg)/about(.*)",
  // Also match routes without locale prefix for redirection
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/events(.*)",
  "/newsletter(.*)",
  "/team(.*)",
  "/gallery(.*)",
  "/projects(.*)",
  "/join-us(.*)",
  "/contact(.*)",
  "/about(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return intlMiddleware(req);
  } else {
    // For protected routes, we enforce auth first, then internationalization
    await auth.protect();
    return intlMiddleware(req);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
