// Re-read the data files (and re-render this page) at most every 5 minutes,
// so content edits appear without a rebuild.
export const revalidate = 300;

import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { MemberCard } from "@/components/site/member-card";
import { getAlumni } from "@/lib/members";
import { TeamMember } from "@/lib/data";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AlumniPage() {
  const alumni = getAlumni() ?? [];

  return (
    <>
      <main className="pb-20">
        <PageHero page="alumni" alt="Lab alumni"
            title="Lab Alumni"
            subtitle="Former members who have moved on to exciting positions around the world."
                  />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-14 sm:pt-16">
          <div className="mb-6">
            <Link
              href="/members"
              className="inline-flex items-center gap-2 text-sm text-[#00E5FF] hover:text-[#5CEFFF] transition-colors font-medium"
            >
              <ArrowLeft size={16} /> Back to Members
            </Link>
          </div>

{(alumni?.length ?? 0) > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
              {(alumni ?? [])?.map?.((member: TeamMember, idx: number) => (
                <MemberCard key={member?.name ?? idx} member={member} index={idx} />
              )) ?? null}
            </div>
          ) : (
            <p className="text-center text-[#E3F2F7]/60 py-12">
              No alumni listed yet.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
