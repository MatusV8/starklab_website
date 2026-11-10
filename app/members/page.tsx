// Re-read the data files (and re-render this page) at most every 5 minutes,
// so content edits appear without a rebuild.
export const revalidate = 300;

import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { MemberCard } from "@/components/site/member-card";
import { getActiveMembers } from "@/lib/members";
import { TeamMember } from "@/lib/data";
import Link from "next/link";

export default function MembersPage() {
  const members = getActiveMembers() ?? [];

  return (
    <>
      <main className="pb-20">
        <PageHero page="members" alt="Our team"
            title="Our Team"
            subtitle="Meet the researchers driving our work in gene regulation, computational biology, and host–pathogen interactions."
                  />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-14 sm:pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {(members ?? [])?.map?.((member: TeamMember, idx: number) => (
              <MemberCard key={member?.name ?? idx} member={member} index={idx} />
            )) ?? null}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/alumni"
              className="btn-primary"
            >
              View Lab Alumni
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}