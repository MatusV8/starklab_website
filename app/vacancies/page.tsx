import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { vacanciesInfo } from "@/lib/data";
import { VacancyCards } from "@/components/site/vacancy-cards";

export default function VacanciesPage() {
  return (
    <>
      <main className="pb-20">
        <PageHero page="vacancies" alt="Open positions"
            title={vacanciesInfo?.headline ?? "Join Us"}
            subtitle={vacanciesInfo?.intro ?? ""}
                  />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-14 sm:pt-16">
<VacancyCards />
          <div className="mt-12 text-center">
            <div className="surface p-8 max-w-2xl mx-auto">
              <p className="text-[#E3F2F7]/80 leading-relaxed">
                {vacanciesInfo?.closingNote ?? ""}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
