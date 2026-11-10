// proxy.ts — security response headers for every page (Next.js 16 replaced
// middleware.ts with proxy.ts; it runs before each matched request).
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy. Next.js injects small inline scripts for hydration,
// so script-src needs 'unsafe-inline'; the dev server additionally needs
// 'unsafe-eval' for hot reloading. Embeds are limited to the YouTube (no-cookie)
// player used on the research page and the Google Maps iframe on the contact
// page. Add a host here if you embed something new.
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "frame-src https://www.youtube-nocookie.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": CSP,
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-DNS-Prefetch-Control": "off",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
};

export function proxy(request: NextRequest) {
  // The CSV files in public/data/ are read by the server only; don't serve
  // them as raw downloads.
  if (request.nextUrl.pathname.startsWith("/data/")) {
    return new NextResponse(null, { status: 404 });
  }

  const response = NextResponse.next();
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
