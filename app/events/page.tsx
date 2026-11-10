// Re-read the data files (and re-render this page) at most every 5 minutes,
// so content edits appear without a rebuild.
export const revalidate = 300;

import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { LabEvent } from "@/lib/data";
import { getEvents } from "@/lib/events";
import { EventCard } from "@/components/site/event-card";

export default function EventsPage() {
  const sortedEvents = getEvents() ?? [];

  return (
    <>
      <main className="pb-20">
        <PageHero page="events" alt="Events and news"
            title="Events & News"
            subtitle="Highlights from the lab — retreats, publications, awards and milestones."
                  />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-14 sm:pt-16">
<div className="space-y-8 sm:space-y-10">
            {(sortedEvents ?? [])?.map?.((event: LabEvent, idx: number) => (
              <EventCard key={`${event?.date ?? ""}-${event?.id ?? idx}`} event={event} index={idx} />
            )) ?? null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
