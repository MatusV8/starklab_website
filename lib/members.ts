// lib/members.ts — Server-side reader for the team member list.
//
// The list is edited in public/data/members.csv, the same way as the
// publications and events files.
import { TeamMember, MemberCategory } from "./data";
import { readSheet, pick, SheetRow } from "./spreadsheet";

const FILE_NAME = "members.csv";

const VALID_CATEGORIES: MemberCategory[] = [
  "group-leader",
  "phd",
  "postdoc",
  "research-technician",
  "master-student",
  "intern",
  "alumni",
];

// Accepted spellings that map onto a canonical category, so the spreadsheet can
// be filled in naturally ("Group Leader", "PhD student", "master", ...).
const CATEGORY_ALIASES: Record<string, MemberCategory> = {
  "group-leader": "group-leader",
  "groupleader": "group-leader",
  "pi": "group-leader",
  "principal-investigator": "group-leader",
  "phd": "phd",
  "phd-student": "phd",
  "doctoral-student": "phd",
  "postdoc": "postdoc",
  "post-doc": "postdoc",
  "postdoctoral": "postdoc",
  "postdoctoral-fellow": "postdoc",
  "research-technician": "research-technician",
  "technician": "research-technician",
  "lab-technician": "research-technician",
  "master-student": "master-student",
  "master": "master-student",
  "masters": "master-student",
  "masters-student": "master-student",
  "msc": "master-student",
  "msc-student": "master-student",
  "alumni": "alumni",
  "alumnus": "alumni",
  "alumna": "alumni",
};

function normalizeCategory(raw: string): MemberCategory {
  // Lowercase and turn spaces / underscores into hyphens so "Master Student",
  // "master_student" and "master-student" all resolve to the same category.
  const key =
    raw?.trim?.()?.toLowerCase?.()?.replace?.(/[\s_]+/g, "-") ?? "";
  if (!key) return "phd";
  if (VALID_CATEGORIES.includes(key as MemberCategory)) return key as MemberCategory;
  return CATEGORY_ALIASES?.[key] ?? "phd";
}

/** The team list from public/data/members.csv (empty when the file is missing). */
export function loadMembers(): TeamMember[] {
  return readSheet(FILE_NAME)
    .map((row: SheetRow) => {
      const name = pick(row, "name", "full name");
      if (name.length === 0) return null;
      return {
        name,
        role: pick(row, "role", "position", "title"),
        category: normalizeCategory(pick(row, "category", "group") || "phd"),
        nationality: pick(row, "nationality", "country"),
        bio: pick(row, "bio", "description"),
        email: pick(row, "email", "e-mail"),
        scholar: pick(row, "scholar", "google scholar"),
        twitter: pick(row, "twitter", "x"),
        image: pick(row, "image", "photo", "picture"),
      } as TeamMember;
    })
    .filter((m): m is TeamMember => m !== null);
}

export function getActiveMembers(): TeamMember[] {
  return loadMembers().filter((m) => m.category !== "alumni");
}

export function getAlumni(): TeamMember[] {
  return loadMembers().filter((m) => m.category === "alumni");
}
