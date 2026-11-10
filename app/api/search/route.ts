import { NextRequest, NextResponse } from "next/server";
import { researchAreas, navLinks } from "@/lib/data";
import { loadMembers } from "@/lib/members";
import { getPublications } from "@/lib/publications";
import { getEvents } from "@/lib/events";
import { getJournalClubEntries } from "@/lib/journal-club";
import { clampText, clientKey, rateLimit } from "@/lib/security";

export const dynamic = "force-dynamic";

// Queries longer than this are truncated so a huge string cannot be used to
// force expensive matching work on every record.
const MAX_QUERY_LENGTH = 120;
// Search runs as the visitor types (debounced), so allow a generous burst.
const RATE_LIMIT = 60; // requests
const RATE_WINDOW_MS = 60_000; // per minute, per client
const MAX_RESULTS = 30;

interface SearchHit {
  type: string;
  title: string;
  subtitle: string;
  href: string;
}

/** True when every word of the query appears somewhere in the fields. */
function matches(query: string, ...fields: (string | number | undefined)[]) {
  const haystack = fields.map((f) => String(f ?? "").toLowerCase()).join(" ");
  return query
    .split(/\s+/)
    .filter((t) => t.length > 0)
    .every((token) => haystack.includes(token));
}

export async function GET(req: NextRequest) {
  const limit = rateLimit(clientKey(req), RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { results: [], error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const query = clampText(req.nextUrl.searchParams.get("q"), MAX_QUERY_LENGTH).toLowerCase();
    if (query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const hits: SearchHit[] = [];

    for (const m of loadMembers()) {
      if (matches(query, m.name, m.role, m.nationality, m.bio)) {
        hits.push({
          type: "Member",
          title: m.name,
          subtitle: m.role ?? "",
          href: m.category === "alumni" ? "/alumni" : "/members",
        });
      }
    }

    for (const p of getPublications()) {
      if (matches(query, p.title, p.authors, p.venue, p.year, p.summary)) {
        hits.push({
          type: "Publication",
          title: p.title,
          subtitle: `${p.venue ?? ""}${p.year > 0 ? ` · ${p.year}` : ""}`,
          href: `/publications/${p.slug}`,
        });
      }
    }

    for (const e of getEvents()) {
      if (matches(query, e.title, e.description, e.date)) {
        hits.push({ type: "Event", title: e.title, subtitle: e.date ?? "", href: "/events" });
      }
    }

    for (const entry of await getJournalClubEntries()) {
      if (matches(query, entry.date, entry.tag, entry.mainPaper)) {
        hits.push({
          type: "Journal Club",
          title: `Session on ${entry.date}`,
          subtitle: entry.tag,
          href: "/journal-club",
        });
      }
    }

    for (const area of researchAreas) {
      if (matches(query, area.title, area.summary, area.description)) {
        hits.push({
          type: "Research",
          title: area.title,
          subtitle: area.summary ?? "",
          href: `/research#${area.id}`,
        });
      }
    }

    for (const link of navLinks) {
      if (matches(query, link.label)) {
        hits.push({ type: "Page", title: link.label, subtitle: "Go to page", href: link.href });
      }
    }

    return NextResponse.json({ results: hits.slice(0, MAX_RESULTS) });
  } catch (err) {
    console.error("[api/search] Search failed:", err);
    return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 });
  }
}
