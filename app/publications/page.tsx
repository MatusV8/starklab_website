// Re-read the data files (and re-render this page) at most every 5 minutes,
// so content edits appear without a rebuild.
export const revalidate = 300;

import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { PublicationCard } from "@/components/site/publication-card";
import { Publication, labInfo } from "@/lib/data";
import { getPublications } from "@/lib/publications";
import { BookOpen } from "lucide-react";
import { ScholarLink } from "@/components/site/scholar-link";

export default function PublicationsPage() {
  const publications = getPublications() ?? [];
  // Group by year descending
  const years = [...new Set((publications ?? [])?.map?.((p: Publication) => p?.year ?? 0) ?? [])]?.sort?.(
    (a: number, b: number) => (b ?? 0) - (a ?? 0)
  ) ?? [];

  return (
    <>
      <main className="pb-20">
        <PageHero page="publications" alt="Publications"
            title="Publications"
                  />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-14 sm:pt-16">
{(years ?? [])?.map?.((year: number) => {
            const pubs = (publications ?? [])?.filter?.((p: Publication) => p?.year === year) ?? [];
            return (
              <div key={year} className="mb-12">
                <h3 className="font-display text-2xl font-semibold text-[#E3F2F7] mb-5 flex items-center gap-2">
                  <BookOpen size={22} className="text-[#00E5FF]" />
                  {year}
                </h3>
                <div className="space-y-3">
                  {(pubs ?? [])?.map?.((pub: Publication, idx: number) => (
                    <PublicationCard key={`${pub?.title ?? ""}-${idx}`} pub={pub} />
                  )) ?? null}
                </div>
              </div>
            );
          }) ?? null}

          <div className="mt-4 text-center border-t border-[#E3F2F7]/12 pt-10">
            <p className="type-card-body text-[#E3F2F7]/60 mb-4">
              This list is a selection. A complete and continuously updated record of our
              publications is available on Google Scholar.
            </p>
            <ScholarLink
              url={labInfo?.scholarUrl ?? ""}
              label="More publications on Google Scholar"
              variant="solid"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
