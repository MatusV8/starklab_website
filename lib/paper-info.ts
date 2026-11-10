// lib/paper-info.ts — reads the details of a paper (title, authors, journal and
// publication date) for the links used in the journal club schedule.
//
// Journal club links point to PubMed or to a preprint server (bioRxiv /
// medRxiv), so the details are taken straight from their public APIs instead of
// scraping publisher pages:
//
//   PubMed   -> https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi
//   bioRxiv  -> https://api.biorxiv.org/details/biorxiv/<doi>
//   medRxiv  -> https://api.biorxiv.org/details/medrxiv/<doi>
//
// Both are free, need no key and never block us, so every entry gets its real
// title, author list, journal and date. A link that points somewhere else is
// simply shown as a plain link.

export interface PaperInfo {
  /** The link the details belong to. */
  url: string;
  title: string;
  /** Author list, already shortened for display. */
  authors: string;
  /** Journal name, or "bioRxiv (preprint)" for preprints. */
  journal: string;
  /** Publication date, e.g. "12 Dec 2023". */
  date: string;
}

const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const CACHE_TTL_MISS_MS = 10 * 60 * 1000; // retry unknown links sooner
const TIMEOUT_MS = 6000;
// A page render never waits longer than this for the lookups; whatever has not
// arrived is filled in on a later render, once the background result is cached.
const RENDER_BUDGET_MS = 3500;
const MAX_AUTHORS = 4;

const cache = new Map<string, { value: PaperInfo | null; expiresAt: number }>();

type PaperRef =
  | { kind: "pubmed"; id: string }
  | { kind: "preprint"; server: "biorxiv" | "medrxiv"; doi: string };

/**
 * Works out whether a link points at PubMed or at a preprint server, and pulls
 * the identifier out of it.
 */
export function parsePaperRef(rawUrl: string): PaperRef | null {
  const value = rawUrl?.trim?.() ?? "";
  if (value.length === 0) return null;

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const path = decodeURIComponent(parsed.pathname);

  // PubMed: pubmed.ncbi.nlm.nih.gov/12345678/ (also the older /pubmed/ path
  // and the ?term=12345678 form).
  if (host.endsWith("ncbi.nlm.nih.gov")) {
    const fromPath = path.match(/(?:^|\/)(\d{5,9})(?:\/|$)/)?.[1] ?? "";
    const fromQuery = parsed.searchParams.get("term")?.match(/^\d{5,9}$/)?.[0] ?? "";
    const id = fromPath || fromQuery;
    if (id) return { kind: "pubmed", id };
    return null;
  }

  // Preprints: the DOI sits in the path, with an optional version suffix.
  if (host.endsWith("biorxiv.org") || host.endsWith("medrxiv.org")) {
    const doi =
      path
        .match(/10\.\d{4,9}\/[^\s?#]+/)?.[0]
        ?.replace(/v\d+(\.full(-text)?|\.article-\w+)?$/i, "")
        ?.replace(/\.(full|abstract|supplementary)$/i, "")
        ?.replace(/[.,;)]+$/, "") ?? "";
    if (!doi) return null;
    const server = host.endsWith("medrxiv.org") ? "medrxiv" : "biorxiv";
    return { kind: "preprint", server, doi };
  }

  return null;
}

/** "2023 Dec 12" or "2025-12-29" shown as "12 Dec 2023". */
function formatDate(raw: string): string {
  const value = raw?.trim?.() ?? "";
  if (value.length === 0) return "";

  const iso = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (iso) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const month = months[Number(iso[2]) - 1] ?? "";
    return month ? `${Number(iso[3])} ${month} ${iso[1]}` : iso[1];
  }

  const full = value.match(/^(\d{4})\s+([A-Za-z]{3,})\s+(\d{1,2})/);
  if (full) return `${Number(full[3])} ${full[2].slice(0, 3)} ${full[1]}`;

  const monthOnly = value.match(/^(\d{4})\s+([A-Za-z]{3,})/);
  if (monthOnly) return `${monthOnly[2].slice(0, 3)} ${monthOnly[1]}`;

  const yearOnly = value.match(/^(\d{4})/);
  return yearOnly ? yearOnly[1] : value;
}

/** Shortens a list of names to the first few followed by "et al.". */
function formatAuthors(names: string[]): string {
  const clean = (names ?? [])
    .map((n) => (n ?? "").replace(/\s+/g, " ").trim())
    .filter((n) => n.length > 0);
  if (clean.length === 0) return "";
  if (clean.length <= MAX_AUTHORS) return clean.join(", ");
  return `${clean.slice(0, MAX_AUTHORS).join(", ")} et al.`;
}

/** "Nemcko, F." -> "Nemcko F" so both sources read the same way. */
function tidyPreprintAuthor(name: string): string {
  const parts = (name ?? "").split(",");
  if (parts.length < 2) return (name ?? "").trim();
  const family = parts[0].trim();
  const initials = parts.slice(1).join(" ").replace(/[.\s]/g, "");
  return initials ? `${family} ${initials}` : family;
}

async function fetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        Accept: "application/json",
        // Both services ask callers to identify themselves.
        "User-Agent": "LabSitePaperInfo/1.0 (https://www.imp.ac.at/)",
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * PubMed summaries for several IDs at once - one request covers a whole page.
 */
async function fetchPubmed(ids: string[]): Promise<Map<string, PaperInfo>> {
  const result = new Map<string, PaperInfo>();
  const unique = Array.from(new Set(ids ?? [])).filter((id) => id.length > 0);
  if (unique.length === 0) return result;

  const json = await fetchJson(
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi" +
      `?db=pubmed&retmode=json&id=${unique.join(",")}`
  );
  const records = json?.result;
  if (!records) return result;

  for (const id of unique) {
    const record = records?.[id];
    if (!record || record?.error) continue;

    const title = String(record?.title ?? "").replace(/\s+/g, " ").trim();
    const authors = formatAuthors(
      (record?.authors ?? [])
        .filter((a: any) => (a?.authtype ?? "Author") === "Author")
        .map((a: any) => String(a?.name ?? ""))
    );
    // PubMed's catalogue names can end in a place of publication, e.g.
    // "Science (New York, N.Y.)" — drop that trailing bracket.
    const journal = String(record?.fulljournalname ?? record?.source ?? "")
      .replace(/\s*\([^()]*\)\s*$/, "")
      .trim();
    const date = formatDate(String(record?.pubdate ?? record?.sortpubdate ?? ""));

    if (title.length === 0 && authors.length === 0) continue;
    result.set(id, { url: "", title, authors, journal, date });
  }
  return result;
}

/** Details of a single preprint. */
async function fetchPreprint(
  server: "biorxiv" | "medrxiv",
  doi: string
): Promise<PaperInfo | null> {
  const json = await fetchJson(
    `https://api.biorxiv.org/details/${server}/${encodeURI(doi)}`
  );
  const collection = json?.collection;
  if (!Array.isArray(collection) || collection.length === 0) return null;

  // The API lists every version; the last one is the most recent.
  const record = collection[collection.length - 1];
  const title = String(record?.title ?? "").replace(/\s+/g, " ").trim();
  if (title.length === 0) return null;

  const authors = formatAuthors(
    String(record?.authors ?? "")
      .split(";")
      .map(tidyPreprintAuthor)
  );
  const label = server === "medrxiv" ? "medRxiv" : "bioRxiv";
  return {
    url: "",
    title,
    authors,
    journal: `${label} (preprint)`,
    date: formatDate(String(record?.date ?? "")),
  };
}

/**
 * Crossref fallback for preprints. Covers DOIs that api.biorxiv.org does not
 * serve - notably the 10.64898 prefix bioRxiv adopted under openRxiv.
 */
async function fetchCrossref(
  server: "biorxiv" | "medrxiv",
  doi: string
): Promise<PaperInfo | null> {
  const json = await fetchJson(
    `https://api.crossref.org/works/${encodeURI(doi)}`
  );
  const record = json?.message;
  if (!record) return null;

  const title = String(record?.title?.[0] ?? "").replace(/\s+/g, " ").trim();
  if (title.length === 0) return null;

  const authors = formatAuthors(
    (record?.author ?? []).map((a: any) => {
      const family = String(a?.family ?? "").trim();
      const given = String(a?.given ?? "").trim();
      if (!family) return String(a?.name ?? "").trim();
      // "Filip" -> "F", to match the PubMed style used elsewhere.
      const initials = given
        .split(/[\s-]+/)
        .map((part: string) => part.charAt(0))
        .join("");
      return initials ? `${family} ${initials}` : family;
    })
  );

  // Preprints carry "posted"; published works carry "issued".
  const parts =
    record?.posted?.["date-parts"]?.[0] ??
    record?.issued?.["date-parts"]?.[0] ??
    [];
  const date =
    parts.length >= 3
      ? formatDate(`${parts[0]}-${parts[1]}-${parts[2]}`)
      : parts.length >= 1
      ? String(parts[0])
      : "";

  const label = server === "medrxiv" ? "medRxiv" : "bioRxiv";
  return { url: "", title, authors, journal: `${label} (preprint)`, date };
}

function cached(url: string): PaperInfo | null | undefined {
  const hit = cache.get(url);
  if (hit && hit.expiresAt > Date.now()) return hit.value;
  return undefined;
}

function remember(url: string, value: PaperInfo | null): void {
  const ttl = value ? CACHE_TTL_MS : CACHE_TTL_MISS_MS;
  cache.set(url, { value, expiresAt: Date.now() + ttl });
}

/**
 * Details for a list of links. PubMed links are looked up together in a single
 * request, preprints in parallel; results are cached so a page render normally
 * costs no network calls at all.
 */
export async function getPaperInfos(
  urls: string[]
): Promise<(PaperInfo | null)[]> {
  const list = (urls ?? []).map((u) => u?.trim?.() ?? "");
  const output: (PaperInfo | null)[] = list.map(() => null);

  const pubmedWanted: string[] = [];
  const refs: (PaperRef | null)[] = list.map((url, i) => {
    if (url.length === 0) return null;
    const hit = cached(url);
    if (hit !== undefined) {
      output[i] = hit;
      return null;
    }
    const ref = parsePaperRef(url);
    if (ref?.kind === "pubmed") pubmedWanted.push(ref.id);
    return ref;
  });

  if (refs.every((ref) => ref === null)) return output;

  type Resolved = { pubmed: Map<string, PaperInfo>; preprints: (PaperInfo | null)[] };

  // The lookups always run to completion and always write their results into the
  // cache, even when this render has already given up waiting for them.
  const lookups: Promise<Resolved> = Promise.all([
    fetchPubmed(pubmedWanted).catch(() => new Map<string, PaperInfo>()),
    Promise.all(
      refs.map((ref) =>
        ref?.kind === "preprint"
        ? fetchPreprint(ref.server, ref.doi)
        .catch(() => null)
        .then((info) =>
          info ?? fetchCrossref(ref.server, ref.doi).catch(() => null)
        )
          : Promise.resolve(null)
      )
    ),
  ]).then(([pubmed, preprints]) => {
    refs.forEach((ref, i) => {
      if (!ref) return;
      const found =
        ref.kind === "pubmed" ? pubmed.get(ref.id) ?? null : preprints[i];
      remember(list[i], found ? { ...found, url: list[i] } : null);
    });
    return { pubmed, preprints };
  });

  let resolved: Resolved | null = null;
  try {
    resolved = await Promise.race([
      lookups,
      new Promise<null>((done) => {
        const timer = setTimeout(() => done(null), RENDER_BUDGET_MS);
        timer?.unref?.();
      }),
    ]);
  } catch {
    resolved = null;
  }
  if (!resolved) return output;

  refs.forEach((ref, i) => {
    if (!ref) return;
    const found =
      ref.kind === "pubmed"
        ? resolved!.pubmed.get(ref.id) ?? null
        : resolved!.preprints[i];
    output[i] = found ? { ...found, url: list[i] } : null;
  });

  return output;
}

/** Details for one link. */
export async function getPaperInfo(url: string): Promise<PaperInfo | null> {
  const [info] = await getPaperInfos([url]);
  return info ?? null;
}
