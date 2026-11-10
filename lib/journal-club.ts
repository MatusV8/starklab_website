// lib/journal-club.ts — Journal club schedule, read from the Google Sheet set
// in `journalClubInfo.sheetUrl` (lib/data.ts).
//
// Only the date, the paper links, the presenters and an optional tag column are
// read. Rows carrying the highlight tag are marked; those sessions show a
// single paper, every other session shows a main paper and a short paper.
//
// The sheet is fetched at most once every few minutes and kept in memory, so
// page views and search requests do not each trigger a request to Google. If a
// refresh fails, the last good copy keeps being served.
import { journalClubInfo } from "./data";
import { parseCsv, parseSheetDate } from "./spreadsheet";

const CACHE_TTL_MS = 5 * 60 * 1000; // re-read the sheet at most every 5 minutes
const MAX_SHEET_BYTES = 2_000_000;

export interface JournalClubEntry {
  id: string;
  date: string;
  tag: string;
  mainPaper: string;
  shortPaper: string;
  mainPresenter: string;
  shortPresenter: string;
  highlighted: boolean;
}

/**
 * Turns any Google Sheets URL into a CSV export URL. Accepts normal sharing
 * links as well as already-published CSV links (returned unchanged).
 */
function toCsvUrl(url: string): string {
  const value = url.trim();
  if (!value) return "";
  if (value.includes("output=csv") || value.includes("out:csv")) return value;

  const id = value.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1] ?? "";
  if (!id) return value;

  const gid = value.match(/[#&?]gid=([0-9]+)/)?.[1] ?? "";
  const base = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv`;
  return gid ? `${base}&gid=${gid}` : base;
}

function firstUrl(value: string): string {
  const match = value.match(/https?:\/\/[^\s,;]+/);
  if (match) return match[0];
  // Bare DOIs are turned into resolvable links.
  const doi = value.match(/10\.\d{4,9}\/[^\s,;]+/);
  return doi ? `https://doi.org/${doi[0]}` : "";
}

/**
 * Presenter cells for First Author Journal Club rows read like
 * "First Author JC Yusuke (9:30)" — keep the name (and any special time),
 * drop the prefix; plain names pass through unchanged.
 */
function cleanPresenter(value: string): string {
  return value
    .trim()
    .replace(/^first\s+author\s+(?:jc\s+)?/i, "")
    .replace(/&/g, " & ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Lowercases and collapses spaces/underscores/hyphens so "First author
 * Journal Club", "first_author_JC" and "first-author-jc" all compare equal. */
function normalizeTag(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, " ");
}

/** Only https Google Sheets hosts are fetched, so a mistyped sheetUrl cannot
 * turn the server into a proxy for arbitrary (or internal) addresses. */
function isAllowedSheetUrl(url: URL): boolean {
  const host = url.hostname.toLowerCase();
  return (
    url.protocol === "https:" &&
    (host === "docs.google.com" ||
      host === "sheets.googleapis.com" ||
      host.endsWith(".googleusercontent.com"))
  );
}

async function fetchSheet(sheetUrl: string): Promise<JournalClubEntry[]> {
  let url: URL;
  try {
    url = new URL(toCsvUrl(sheetUrl));
  } catch {
    return [];
  }
  if (!isAllowedSheetUrl(url)) {
    console.error(`[journal-club] Ignoring sheetUrl with unsupported host: ${url.hostname}`);
    return [];
  }

  const res = await fetch(url.toString(), {
    cache: "no-store",
    redirect: "follow",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`Google Sheet request failed with status ${res.status}`);
  }
  const rows = parseCsv((await res.text()).slice(0, MAX_SHEET_BYTES));
  if (rows.length < 2) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const indexOf = (...names: string[]) => {
    for (const name of names) {
      const i = header.indexOf(name);
      if (i >= 0) return i;
    }
    return -1;
  };
  const orDefault = (i: number, fallback: number) => (i >= 0 ? i : fallback);

  // Named columns when present, otherwise the documented positions:
  // column 1 = Date, column 4 = Main paper, column 5 = Short paper.
  const dateIdx = orDefault(indexOf("date", "when"), 0);
  const mainIdx = orDefault(indexOf("main link", "main_link", "main paper", "main_paper", "main"), 3);
  const shortIdx = orDefault(indexOf("short link", "short_link", "short paper", "short_paper", "short"), 4);
  const tagIdx = indexOf("tag", "type", "category");
  const mainPresenterIdx = indexOf("main_presenter", "main presenter", "presented_by", "presenter");
  const shortPresenterIdx = indexOf("short_presenter", "short presenter");

  const cell = (cols: string[], i: number) => (i >= 0 ? cols[i] ?? "" : "");
  const highlightTag = normalizeTag(journalClubInfo.highlightTag ?? "");

  return rows
    .slice(1)
    .map((cols, i): JournalClubEntry => {
      const date = cell(cols, dateIdx);
      const tag = cell(cols, tagIdx).trim();
      return {
        id: `jc-${i + 1}`,
        date: parseSheetDate(date)?.iso ?? date.trim(),
        tag,
        mainPaper: firstUrl(cell(cols, mainIdx)),
        shortPaper: firstUrl(cell(cols, shortIdx)),
        mainPresenter: cleanPresenter(cell(cols, mainPresenterIdx)),
        shortPresenter: cleanPresenter(cell(cols, shortPresenterIdx)),
        highlighted:
          highlightTag.length > 0 &&
          normalizeTag(`${tag} ${cols.join(" ")}`).includes(highlightTag),
      };
    })
    .filter((e) => e.mainPaper.length > 0 || e.shortPaper.length > 0);
}

let cached: { entries: JournalClubEntry[]; fetchedAt: number } | null = null;
let inFlight: Promise<JournalClubEntry[]> | null = null;

/** The sheet's entries, re-fetched at most every CACHE_TTL_MS. Concurrent
 * callers share one request; on failure the last good copy is returned. */
async function loadEntries(): Promise<JournalClubEntry[]> {
  const sheetUrl = journalClubInfo.sheetUrl ?? "";
  if (!sheetUrl) return [];
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return cached.entries;

  inFlight ??= fetchSheet(sheetUrl)
    .then((entries) => {
      cached = { entries, fetchedAt: Date.now() };
      return entries;
    })
    .catch((err) => {
      console.error("[journal-club] Could not read the Google Sheet:", err);
      // Keep serving the last good copy, and wait a full TTL before retrying.
      if (cached) cached.fetchedAt = Date.now();
      return cached?.entries ?? [];
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

/**
 * Sessions older than one year are not shown - the page keeps the past twelve
 * months plus anything already scheduled ahead.
 */
function withinLastYear(entry: JournalClubEntry): boolean {
  const parsed = new Date(entry.date);
  if (Number.isNaN(parsed.getTime())) return true; // keep rows we cannot date

  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 1);
  return parsed.getTime() >= cutoff.getTime();
}

/** Journal club sessions of the past year, most recent first. */
export async function getJournalClubEntries(): Promise<JournalClubEntry[]> {
  return (await loadEntries())
    .filter(withinLastYear)
    .sort((a, b) => b.date.localeCompare(a.date));
}
