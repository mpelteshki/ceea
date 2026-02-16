import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const isPublicRoute = createRouteMatcher([
  "/",
  "/(en|it)",
  "/(en|it)/sign-in(.*)",
  "/(en|it)/sign-up(.*)",
  "/(en|it)/events(.*)",
  "/(en|it)/newsletter(.*)",
  "/(en|it)/team(.*)",
  "/(en|it)/projects(.*)",
  "/(en|it)/join-us(.*)",
  "/(en|it)/contacts(.*)",
  "/(en|it)/about(.*)",
  // Also match routes without locale prefix for redirection
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/events(.*)",
  "/newsletter(.*)",
  "/team(.*)",
  "/projects(.*)",
  "/join-us(.*)",
  "/contacts(.*)",
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
