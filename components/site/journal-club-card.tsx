"use client";

import { motion } from "framer-motion";
import { CalendarDays, ExternalLink, Presentation, Star, Users } from "lucide-react";
import { JournalClubEntry } from "@/lib/journal-club";
import { PaperInfo } from "@/lib/paper-info";
import { safeExternalUrl } from "@/lib/security";

interface JournalClubCardProps {
  entry: JournalClubEntry;
  index: number;
  mainPaper?: PaperInfo | null;
  shortPaper?: PaperInfo | null;
}

/** Formats a stored "YYYY-MM-DD" entry date as "DD.MM.YYYY" for display. */
function formatDisplayDate(iso: string): string {
  const match = iso?.match?.(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}.${match[2]}.${match[1]}` : iso ?? "";
}

/** Readable stand-in for a title when the link is not a paper we can read. */
function prettyUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const path = decodeURIComponent(parsed.pathname).replace(/\/$/, "");
    const label = `${parsed.hostname.replace(/^www\./, "")}${path}`;
    return label.length > 90 ? `${label.slice(0, 90)}...` : label;
  } catch {
    return url;
  }
}

/** One paper: title, authors, journal and publication date. */
function Paper({
  href,
  info,
  label,
  presenter,
}: {
  href: string;
  info?: PaperInfo | null;
  label: string;
  presenter?: string;
}) {
  const safeHref = safeExternalUrl(href);

  if (safeHref.length === 0) {
    return (
      <div className="h-full rounded-lg border border-dashed border-[#E3F2F7]/15 bg-[#E3F2F7]/[0.04] p-4">
        <p className="text-xs uppercase tracking-wider font-semibold text-[#E3F2F7]/50 mb-1">
          {label}
        </p>
        <p className="text-sm text-[#E3F2F7]/40">No link added yet.</p>
      </div>
    );
  }

  const title = info?.title || prettyUrl(safeHref);
  const authors = info?.authors || "";
  const journal = info?.journal || "";
  const date = info?.date || "";

  return (
    <a
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      className="group/paper block h-full rounded-lg border border-[#E3F2F7]/12 bg-[#E3F2F7]/[0.04] p-4 hover:border-[#00E5FF]/50 hover:bg-[#E3F2F7]/[0.07] transition-colors"
    >
      <p className="text-xs uppercase tracking-wider font-semibold text-[#E3F2F7]/50 mb-2">
        {label}
      </p>

      <p className="type-card-title text-[#E3F2F7] break-words group-hover/paper:text-[#00E5FF] transition-colors">
        {title}
      </p>

      {(presenter?.length ?? 0) > 0 && (
        <p className="mt-2 flex items-center gap-1.5 type-card-body text-[#E3F2F7]/70">
          <Presentation size={14} className="shrink-0 text-[#00E5FF]/70" />
          <span>
            Presented by <span className="font-medium text-[#E3F2F7]/90">{presenter}</span>
          </span>
        </p>
      )}

      {authors.length > 0 && (
        <p className="mt-1.5 flex items-start gap-1.5 type-card-body text-[#E3F2F7]/65">
          <Users size={14} className="shrink-0 mt-1 text-[#E3F2F7]/40" />
          <span className="italic">{authors}</span>
        </p>
      )}

      {(journal.length > 0 || date.length > 0) && (
        <p className="mt-1.5 type-card-body font-medium text-[#E3F2F7]/80">
          {journal}
          {journal.length > 0 && date.length > 0 && (
            <span className="text-[#E3F2F7]/35"> · </span>
          )}
          <span className="font-normal text-[#E3F2F7]/60">{date}</span>
        </p>
      )}

      <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-[#00E5FF]">
        <ExternalLink size={11} className="shrink-0" />
        Read the paper
      </span>
    </a>
  );
}

export function JournalClubCard({
  entry,
  index,
  mainPaper,
  shortPaper,
}: JournalClubCardProps) {
  const highlighted = entry?.highlighted === true;

  // First author journal clubs cover a single paper; every other session has a
  // main paper and a shorter one.
  const hasMain = (entry?.mainPaper?.length ?? 0) > 0;
  const singleHref = hasMain ? entry?.mainPaper ?? "" : entry?.shortPaper ?? "";
  const singleInfo = hasMain ? mainPaper : shortPaper;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min((index ?? 0) * 0.04, 0.3) }}
      className={`surface p-6 sm:p-7 transition-colors ${
        highlighted ? "border-[#00E5FF]/35" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E3F2F7]">
          <CalendarDays size={15} className="text-[#00E5FF]" />
          <span suppressHydrationWarning>{formatDisplayDate(entry?.date ?? "")}</span>
        </span>

        {highlighted && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00E5FF]">
            <Star size={15} strokeWidth={2.5} />
            First Author Journal Club
          </span>
        )}

        {!highlighted && (entry?.tag?.length ?? 0) > 0 && (
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#E3F2F7]/60 bg-[#E3F2F7]/[0.07] px-2.5 py-1 rounded-full">
            {entry?.tag}
          </span>
        )}
      </div>

      {highlighted ? (
        <Paper
          href={singleHref}
          info={singleInfo}
          label="Paper"
          presenter={entry?.mainPresenter}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Paper
            href={entry?.mainPaper ?? ""}
            info={mainPaper}
            label="Main paper"
            presenter={entry?.mainPresenter}
          />
          <Paper
            href={entry?.shortPaper ?? ""}
            info={shortPaper}
            label="Short paper"
            presenter={entry?.shortPresenter}
          />
        </div>
      )}
    </motion.div>
  );
}
