// lib/security.ts — small, dependency-free hardening helpers.
//
// These keep untrusted input (values typed into the spreadsheets, search
// queries) from turning into script URLs or oversized payloads. Nothing here
// changes what the site displays for normal, well-formed content.

/** Trims a value to a plain string and caps its length. */
export function clampText(value: unknown, maxLength: number): string {
  const text = typeof value === "string" ? value : "";
  return text.trim().slice(0, Math.max(0, maxLength));
}

/** Conservative single-address e-mail check (also rejects CR/LF injection). */
export function isValidEmail(value: unknown): boolean {
  const email = typeof value === "string" ? value.trim() : "";
  if (email.length === 0 || email.length > 254) return false;
  if (/[\s<>,;"'\\]/.test(email)) return false;
  return /^[^@]+@[^@.]+(\.[^@.]+)+$/.test(email);
}

const SAFE_LINK_PROTOCOLS = ["http:", "https:", "mailto:"];

/**
 * Returns the URL only when it uses a safe protocol, otherwise an empty
 * string. This blocks `javascript:`, `data:` and `vbscript:` links that could
 * otherwise be pasted into a spreadsheet cell and rendered as an anchor.
 * Bare hosts such as `example.org/page` are upgraded to https.
 */
export function safeExternalUrl(value: unknown): string {
  const raw = typeof value === "string" ? value.trim() : "";
  if (raw.length === 0) return "";
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw; // internal path
  const candidate = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(candidate);
    if (!SAFE_LINK_PROTOCOLS.includes(url.protocol.toLowerCase())) return "";
    return url.toString();
  } catch {
    return "";
  }
}

/** Builds a `mailto:` href, or an empty string when the address is unusable. */
export function safeMailto(value: unknown): string {
  return isValidEmail(value) ? `mailto:${String(value).trim()}` : "";
}

/**
 * Very small fixed-window rate limiter kept in module memory. Enough to stop
 * a single client from hammering a public endpoint; it resets when the server
 * restarts, which is fine for this purpose.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  if (buckets.size > 5000) buckets.clear();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Best-effort client address for rate limiting. */
export function clientKey(request: Request): string {
  const forwarded = request?.headers?.get?.("x-forwarded-for") ?? "";
  const first = forwarded.split(",")[0]?.trim() ?? "";
  return first || request?.headers?.get?.("x-real-ip") || "unknown";
}
