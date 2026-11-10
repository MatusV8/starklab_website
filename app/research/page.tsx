import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ResearchSection } from "@/components/site/research-section";
import { researchAreas, ResearchArea } from "@/lib/data";

export default function ResearchPage() {
  return (
    <>
      <main>
        <PageHero
          page="research"
          alt="Research"
          title="Our Research"
          subtitle="We combine computational and experimental approaches across three interconnected research areas."
        />
        <section className="bg-[#050A14] px-5 py-10 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-xl aspect-video bg-[#0C1727]">
            <iframe
              src="https://www.youtube-nocookie.com/embed/M7MM9CcUU6s"
              title="Stark Lab research video"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>
        {(researchAreas ?? [])?.map?.((area: ResearchArea, idx: number) => (
          <ResearchSection key={area?.id ?? idx} area={area} index={idx} />
        )) ?? null}
      </main>
      <Footer />
    </>
  );
}
