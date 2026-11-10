// lib/spreadsheet.ts — Server-side helper for reading the CSV files that hold
// editable site content (members, publications, events, journal club).
//
// Each file lives in public/data/ as UTF-8 CSV with a header row on top.
// Column names are matched case-insensitively and tolerate spaces, underscores
// and hyphens, so "Main Paper", "main_paper" and "main-paper" all resolve to
// the same column. Blank lines and lines starting with "#" are ignored, so you
// can keep comments in the file.
import fs from "fs";
import path from "path";

export type SheetRow = Record<string, string>;

function normalizeKey(raw: unknown): string {
  return (
    String(raw ?? "")
      ?.trim?.()
      ?.toLowerCase?.()
      ?.replace?.(/[\s_-]+/g, "_") ?? ""
  );
}

function cellToString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return (
    String(value)
      // A cell cannot contain a real line break, so "\n" written literally in
      // the file becomes one. Useful for multi-paragraph bios.
      ?.replace?.(/\\n/g, "\n")
      ?.trim?.() ?? ""
  );
}

/**
 * Parses CSV text into rows of fields. Handles quoted fields, commas and line
 * breaks inside quotes, and escaped quotes ("").
 */
export function parseCsv(input: string): string[][] {
  // Text pasted from web pages or exported from some spreadsheet apps uses
  // non-breaking spaces (U+00A0, U+202F) between words. Browsers can't wrap
  // there, so long titles were split mid-word. Treat them as normal spaces.
  const text = input.replace(/[  ]/g, " ");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function dataFilePath(fileName: string): string {
  return path.join(process.cwd(), "public", "data", fileName);
}

/**
 * Reads a comma-separated file in public/data/ and returns one object per row,
 * keyed by the normalized column name.
 * Returns an empty array when the file is missing or unreadable.
 */
export function readSheet(fileName: string): SheetRow[] {
  try {
    const filePath = dataFilePath(fileName);
    if (!fs.existsSync(filePath)) return [];

    const text = fs
      .readFileSync(filePath, "utf-8")
      .replace(/^\uFEFF/, "") // drop a leading byte-order mark
      .split(/\r?\n/)
      .filter((line) => !line.trim().startsWith("#")) // comment lines
      .join("\n");

    const rows = parseCsv(text).filter((cols) =>
      cols.some((c) => c.trim().length > 0)
    );
    if (rows.length < 2) return [];

    const header = rows[0].map(normalizeKey);

    return rows
      .slice(1)
      .map((cols) => {
        const row: SheetRow = {};
        header.forEach((key, i) => {
          if (key) row[key] = cellToString(cols[i]);
        });
        return row;
      })
      .filter((row) => Object.values(row).some((v) => v.length > 0));
  } catch (err) {
    console.error("[spreadsheet] Failed to read " + fileName + ":", err);
    return [];
  }
}

/** Picks the first non-empty value among several possible column names. */
export function pick(row: SheetRow, ...keys: string[]): string {
  for (const key of keys ?? []) {
    const value = row?.[normalizeKey(key)] ?? "";
    if ((value?.length ?? 0) > 0) return value;
  }
  return "";
}

/**
 * Parses one "source" column (e.g. the CSV's "github" column) that may hold
 * one or several links: a bare URL, "Label|URL", or several of either
 * separated by ";" / newlines. A bare entry falls back to defaultLabel, with
 * a number appended ("GitHub 1", "GitHub 2", ...) when there is more than
 * one unlabelled entry in the same cell. Only http(s) URLs are kept.
 */
export function parseLinkColumn(
  value: string,
  defaultLabel: string
): { label: string; url: string }[] {
  const entries =
    (value ?? "")
      ?.split?.(/[;\n]+/)
      ?.map?.((entry: string) => entry?.trim?.() ?? "")
      ?.filter?.((entry: string) => entry.length > 0) ?? [];

  const parsed = entries.map((entry: string) => {
    const sep = entry.indexOf("|");
    const label = (sep >= 0 ? entry.slice(0, sep) : "")?.trim?.() ?? "";
    const url = (sep >= 0 ? entry.slice(sep + 1) : entry)?.trim?.() ?? "";
    return { label, url };
  });

  const unlabelledCount = parsed.filter((e) => !e.label).length;
  let unlabelledSeen = 0;

  return parsed
    .map((e) => {
      if (e.label) return e;
      unlabelledSeen += 1;
      const label = unlabelledCount > 1 ? `${defaultLabel} ${unlabelledSeen}` : defaultLabel;
      return { label, url: e.url };
    })
    .filter((e) => /^https?:\/\//i.test(e?.url ?? ""));
}

export interface ParsedDate {
  /** Canonical "YYYY-MM-DD", used for sorting and as the stored value. */
  iso: string;
  year: number;
  /** UTC milliseconds, for sorting by recency. */
  timestamp: number;
}

function buildParsedDate(
  year: number,
  month: number,
  day: number
): ParsedDate | null {
  if (!year || !month || !day) return null;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const timestamp = Date.UTC(year, month - 1, day);
  if (Number.isNaN(timestamp)) return null;
  const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return { iso, year, timestamp };
}

/**
 * Reads a date cell from a CSV/sheet. The expected format across
 * public/data/*.csv is DD.MM.YYYY (e.g. "26.01.2011"); "-" and "/" are
 * accepted as separators too (e.g. "26-01-2011", "26/01/2011").
 *
 * ISO "YYYY-MM-DD" and the legacy two-digit-year "DD.MM.YY" are still
 * accepted for backward compatibility with older exports, and free text
 * ("15 Sep 2025") falls back to the JS Date parser.
 *
 * Returns null when the value cannot be read as a date.
 */
export function parseSheetDate(raw: string): ParsedDate | null {
  const value = raw?.trim?.() ?? "";
  if (!value) return null;

  // DD.MM.YYYY (primary, documented format) / DD-MM-YYYY / DD/MM/YYYY.
  const dmy = value.match(/^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})$/);
  if (dmy) {
    return buildParsedDate(+dmy[3], +dmy[2], +dmy[1]);
  }

  // ISO YYYY-MM-DD (and YYYY/MM/DD, YYYY.MM.DD) — kept for backward
  // compatibility with older sheets/exports.
  const iso = value.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})$/);
  if (iso) {
    return buildParsedDate(+iso[1], +iso[2], +iso[3]);
  }

  // DD.MM.YY (two-digit year) — legacy publications.csv exports. Years 00-68
  // are read as 2000-2068, 69-99 as 1969-1999 (same rule Excel uses).
  const dmyShort = value.match(/^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2})$/);
  if (dmyShort) {
    const twoDigitYear = +dmyShort[3];
    const year = twoDigitYear + (twoDigitYear <= 68 ? 2000 : 1900);
    return buildParsedDate(year, +dmyShort[2], +dmyShort[1]);
  }

  // Free text such as "15 Sep 2025" or "September 2025".
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return {
      iso: parsed.toISOString().slice(0, 10),
      year: parsed.getUTCFullYear(),
      timestamp: parsed.getTime(),
    };
  }

  return null;
}