import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { labInfo, bannerCredits } from "@/lib/data";

/** Same page keys as `pageImages` / `bannerCredits` in lib/data.ts. */
const pageLabels: Record<string, string> = {
  research: "Research",
  members: "Members",
  alumni: "Alumni",
  events: "Events",
  publications: "Publications",
  "journal-club": "Journal Club",
  vacancies: "Vacancies",
  contact: "Contact",
};

export default function ImprintPage() {
  const photoCredits = Object.entries(bannerCredits ?? {}).filter(
    ([, name]) => (name ?? "").length > 0
  );
  const labName = labInfo?.name ?? "Stark Lab";

  return (
    <>
      <main className="pb-20">
        <PageHero page="contact" alt="Imprint" title="Imprint" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-14 sm:pt-16 space-y-16">
          {/* Banner photography */}
          {photoCredits.length > 0 ? (
            <section>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#E3F2F7] tracking-[-0.02em] mb-3">
                Photography
              </h2>
              <p className="max-w-3xl text-[#E3F2F7]/65 leading-relaxed mb-6">
                We thank the photographers who kindly allowed us to feature
                their pictures on this website. All banner images © {labName}.
              </p>
              <ul className="surface p-7 max-w-3xl space-y-2">
                {photoCredits.map(([page, name]) => (
                  <li key={page} className="text-sm text-[#E3F2F7]/70">
                    <span className="text-[#E3F2F7]">
                      {pageLabels?.[page] ?? page}
                    </span>{" "}
                    — Photo by {name}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
