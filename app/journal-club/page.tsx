// Rendered per request: the Google Sheet (lib/journal-club.ts) and the paper
// details (lib/paper-info.ts) are cached in memory, so this stays cheap.
export const dynamic = "force-dynamic";

import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { JournalClubCard } from "@/components/site/journal-club-card";
import { getJournalClubEntries, JournalClubEntry } from "@/lib/journal-club";
import { getPaperInfos, PaperInfo } from "@/lib/paper-info";
import { journalClubInfo } from "@/lib/data";
import { CalendarClock, History } from "lucide-react";

export const metadata = {
  title: "Journal Club",
  description: journalClubInfo?.description ?? "Journal club schedule.",
};

export default async function JournalClubPage() {
  const entries = (await getJournalClubEntries()) ?? [];

  const links = (entries ?? []).flatMap((entry: JournalClubEntry) => [
    entry?.mainPaper ?? "",
    entry?.shortPaper ?? "",
  ]);
  const papers = await getPaperInfos(links);
  const details = (entries ?? []).map((_entry: JournalClubEntry, idx: number) => ({
    main: papers?.[idx * 2] ?? null,
    short: papers?.[idx * 2 + 1] ?? null,
  })) as { main: PaperInfo | null; short: PaperInfo | null }[];

  // Split into upcoming and past
  const entriesWithDetails = (entries ?? []).map((entry: JournalClubEntry, idx: number) => ({
    entry,
    detail: details[idx] ?? { main: null, short: null },
  }));
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const parseEntryDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const upcomingPairs = entriesWithDetails.filter(({ entry }) => {
    const d = parseEntryDate(entry?.date ?? "");
    return d !== null && d >= todayStart;
  });
  const pastPairs = entriesWithDetails.filter(({ entry }) => {
    const d = parseEntryDate(entry?.date ?? "");
    return d === null || d < todayStart;
  });

  // Sort ascending to get the nearest upcoming date first, then take only that one
  upcomingPairs.sort((a, b) => (a.entry?.date ?? "").localeCompare(b.entry?.date ?? ""));
  const nearestUpcoming = upcomingPairs[0] ?? null;

  return (
    <>
      <main className="pb-20">
        <PageHero
          page="journal-club"
          alt="Journal club"
          title={journalClubInfo?.heading ?? "Journal Club"}
          subtitle={journalClubInfo?.description ?? ""}
        />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-14 sm:pt-16 space-y-16">

          {/* Upcoming Journal Club — only the nearest future session */}
          {nearestUpcoming !== null && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <CalendarClock size={20} className="text-[#00E5FF]" />
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#E3F2F7] tracking-tight">
                  Upcoming Journal Clubs
                </h2>
              </div>
              <JournalClubCard
                entry={nearestUpcoming.entry}
                index={0}
                mainPaper={nearestUpcoming.detail.main}
                shortPaper={nearestUpcoming.detail.short}
              />
            </section>
          )}

          {/* Previous Journal Clubs */}
          {(pastPairs?.length ?? 0) > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <History size={20} className="text-[#00E5FF]" />
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#E3F2F7] tracking-tight">
                  Previous Journal Clubs
                </h2>
              </div>
              <div className="space-y-4">
                {pastPairs.map(({ entry, detail }, idx) => (
                  <JournalClubCard
                    key={`${entry?.date ?? ""}-${entry?.id ?? idx}`}
                    entry={entry}
                    index={idx}
                    mainPaper={detail?.main ?? null}
                    shortPaper={detail?.short ?? null}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty state — shown only when both sections are empty */}
          {nearestUpcoming === null && (pastPairs?.length ?? 0) === 0 && (
            <p className="text-center text-[#E3F2F7]/60 py-12">
              No journal club entries yet.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
