// lib/events.ts — Reads the event list from public/data/events.csv (one row
// per event). Returns an empty list when the file is missing or empty.
import { LabEvent, slugify } from "./data";
import { readSheet, pick, parseSheetDate, SheetRow } from "./spreadsheet";

const FILE_NAME = "events.csv";

function rowToEvent(row: SheetRow, index: number): LabEvent {
  const title = pick(row, "title", "event", "name");
  // Normalize the raw cell (DD.MM.YYYY / DD.MM.YY / ISO / free text) to ISO
  // "YYYY-MM-DD" so client components can format it without this module.
  const rawDate = pick(row, "date", "when");
  return {
    id: pick(row, "id") || slugify(title) || `event-${index + 1}`,
    title,
    date: parseSheetDate(rawDate)?.iso ?? rawDate?.trim?.() ?? "",
    description: pick(row, "description", "summary", "details"),
    image: pick(row, "image", "figure", "photo", "img"),
  };
}

/** Parses DD.MM.YYYY (the documented format), ISO, and free text into a timestamp. */
function eventTime(value: string): number {
  const parsed = parseSheetDate(value);
  return parsed?.timestamp ?? -Infinity; // undated/unreadable events sink to the bottom
}

/** All events, most recent date first. */
export function getEvents(): LabEvent[] {
  const rows = readSheet(FILE_NAME) ?? [];

  const list: LabEvent[] =
    (rows ?? [])
      ?.map?.(rowToEvent)
      ?.filter?.((e: LabEvent) => (e?.title?.length ?? 0) > 0) ?? [];

      return (list ?? [])
      ?.slice?.()
      ?.sort?.((a: LabEvent, b: LabEvent) =>
        eventTime(b?.date ?? "") - eventTime(a?.date ?? "")
      ) ?? [];
}

/** The most recent events, for the home page summary strip. */
export function getRecentEvents(limit: number = 6): LabEvent[] {
  return (getEvents() ?? [])?.slice?.(0, limit) ?? [];
}
