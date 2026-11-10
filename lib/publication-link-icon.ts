// lib/publication-link-icon.ts — Picks an icon for a publication's extra
// link based on which CSV column it came from (e.g. the "github" column),
// so a custom label never changes the icon. Add a new column -> icon pair
// here (and to LINK_COLUMNS in lib/publications.ts) to support a new source.
import { Database, Dna, File, Folder, Monitor, Newspaper } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const COLUMN_ICONS: Record<string, LucideIcon> = {
  github: Monitor,
  zenodo: Folder,
  geo: Database,
  pride: Database,
  pdb: Database,
  addgene: Dna,
  ucsc: Monitor,
  thread: Newspaper,
};

/** Resolves the icon to show for a link, based on its source column. */
export function iconForColumn(column: string): LucideIcon {
  return COLUMN_ICONS[(column ?? "").trim().toLowerCase()] ?? File;
}
