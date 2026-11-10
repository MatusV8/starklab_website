// lib/publications.ts — Reads the publication list from
// public/data/publications.csv (one row per paper). Returns an empty list
// when the file is missing or empty.
import { Publication, slugify } from "./data";
import { readSheet, pick, parseSheetDate, parseLinkColumn, SheetRow } from "./spreadsheet";

// CSV column name -> the default label used when that column's cell doesn't
// specify its own ("Label|URL"); keep in sync with lib/publication-link-icon.ts.
const LINK_COLUMNS: { column: string; label: string }[] = [
  { column: "github", label: "GitHub" },
  { column: "zenodo", label: "Zenodo" },
  { column: "geo", label: "GEO" },
  { column: "pride", label: "PRIDE" },
  { column: "pdb", label: "PDB" },
  { column: "addgene", label: "Addgene" },
  { column: "ucsc", label: "UCSC" },
  { column: "thread", label: "Thread" },
  { column: "other", label: "Link" },
];

const FILE_NAME = "publications.csv";

function rowToPublication(row: SheetRow, index: number): Publication {
  const title = pick(row, "title", "paper", "name");
  const dateRaw = pick(row, "date", "year", "published");
  const parsedDate = parseSheetDate(dateRaw);
  // A bare 4-digit year ("2024", with no day/month) isn't a full date but is
  // still a valid year to sort and display by.
  const bareYear = !parsedDate ? dateRaw?.match?.(/^\d{4}$/)?.[0] : null;

  return {
    slug: pick(row, "slug") || slugify(title) || `publication-${index + 1}`,
    title,
    authors: pick(row, "authors", "author"),
    venue: pick(row, "venue", "journal"),
    year: parsedDate?.year ?? (bareYear ? parseInt(bareYear, 10) : 0),
    date: parsedDate?.iso ?? "", // full date, when known, for sorting within a year
    url: pick(row, "url", "link", "doi"),
    image: pick(row, "image", "figure", "img"),
    summary: pick(row, "summary", "abstract", "description"),
    links: LINK_COLUMNS.flatMap(({ column, label }) =>
      parseLinkColumn(pick(row, column), label).map((link) => ({ ...link, column }))
    ),
  };
}

/** All publications, newest first. */
export function getPublications(): Publication[] {
  const rows = readSheet(FILE_NAME) ?? [];

  const list: Publication[] =
    (rows ?? [])
      ?.map?.(rowToPublication)
      ?.filter?.((p: Publication) => (p?.title?.length ?? 0) > 0) ?? [];

  // Make slugs unique even if two papers share a very similar title.
  const seen = new Map<string, number>();
  const unique = (list ?? [])?.map?.((p: Publication) => {
    const base = p?.slug ?? "";
    const count = seen?.get?.(base) ?? 0;
    seen?.set?.(base, count + 1);
    return count === 0 ? p : { ...p, slug: `${base}-${count + 1}` };
  }) ?? [];

  return (unique ?? [])
  ?.slice?.()
  ?.sort?.((a: Publication, b: Publication) => {
    // Primary sort: year descending
    const yearDiff = (b?.year ?? 0) - (a?.year ?? 0);
    if (yearDiff !== 0) return yearDiff;
    // Secondary sort: full date descending (newest first within the same year)
    const da = a?.date ?? "";
    const db = b?.date ?? "";
    if (db && da) return db.localeCompare(da);
    if (db) return 1;   // b has a date, a doesn't → b comes first
    if (da) return -1;  // a has a date, b doesn't → a comes first
    return 0;
  }) ?? [];
}

/** A single publication by slug, or undefined when not found. */
export function getPublicationBySlug(slug: string): Publication | undefined {
  return (getPublications() ?? [])?.find?.((p: Publication) => p?.slug === slug);
}
