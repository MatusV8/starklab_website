// Re-read the data files (and re-render this page) at most every 5 minutes,
// so content edits appear without a rebuild.
export const revalidate = 300;

import { Footer } from "@/components/site/footer";
import { HeroSection } from "@/components/site/hero-section";
import { ResearchCard } from "@/components/site/research-card";
import { EventsStrip } from "@/components/site/events-strip";
import { researchAreas, ResearchArea, labInfo } from "@/lib/data";
import { getRecentEvents } from "@/lib/events";
import Link from "next/link";
import { BookOpen, Mail, Users, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/site/section-header";

export default function HomePage() {
  const recentEvents = getRecentEvents(3) ?? [];

  return (
    <>
      <main>
        <HeroSection />

        {/* About us — key research questions */}
        <section id="home-content" className="pt-20 pb-20 bg-[#050A14]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <SectionHeader title="About us" subtitle={labInfo?.aboutText ?? ""} />
            {/* Research panels — each links to its section on the Research page */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(researchAreas ?? [])?.map?.((area: ResearchArea, idx: number) =>
              <Link
                key={area?.id ?? idx}
                href={`/research#${area?.id ?? ""}`}
                className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] rounded-xl"
                aria-label={`Read more about ${area?.title ?? "this research area"}`}>

                  <ResearchCard area={area} index={idx} compact />
                </Link>
              ) ?? null}
            </div>
          </div>
        </section>

        {/* News */}
        {(recentEvents?.length ?? 0) > 0 &&
        <section className="py-20 bg-[#0B1524]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
              <SectionHeader
              title="News"
              subtitle="Events and recent publications." />

              <EventsStrip events={recentEvents} />
              <div className="mt-10 text-center">
                <Link
                href="/events"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00E5FF] hover:text-[#5CEFFF] transition-colors">

                  All events <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </section>
        }

        {/* CTA Section */}
        <section className="bg-[#050A14] py-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
            <SectionHeader
              title="Interested in our work?"
              subtitle="Explore our publications, discover open positions, or get in touch to discuss collaborations." />

            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/publications" className="btn-primary">
                <BookOpen size={16} /> Browse publications
              </Link>
              <Link href="/vacancies" className="btn-primary">
                <Users size={16} /> Join our team
              </Link>
              <Link href="/contact" className="btn-primary">
                <Mail size={16} /> Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>);

}
