// Re-read the data files (and re-render this page) at most every 5 minutes,
// so content edits appear without a rebuild.
export const revalidate = 300;

import { Footer } from "@/components/site/footer";
import { getPublicationBySlug } from "@/lib/publications";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Users, BookOpen, Calendar } from "lucide-react";
import { safeExternalUrl } from "@/lib/security";
import { renderRichText, noBreakHyphens } from "@/lib/rich-text";
import { iconForColumn } from "@/lib/publication-link-icon";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const pub = getPublicationBySlug(slug ?? "");
  return { title: pub?.title ?? "Publication" };
}

export default async function PublicationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pub = getPublicationBySlug(slug ?? "");
  if (!pub) notFound();

  const hasImage = (pub?.image?.length ?? 0) > 0;
  const hasUrl = (pub?.url?.length ?? 0) > 0;
  const hasSummary = (pub?.summary?.length ?? 0) > 0;

  return (
    <>
      <main className="pt-24 pb-20">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <Link
              href="/publications"
              className="inline-flex items-center gap-2 text-sm text-[#00E5FF] hover:text-[#5CEFFF] transition-colors font-medium"
            >
              <ArrowLeft size={16} /> Back to Publications
            </Link>
          </div>

          <article className="surface p-7 sm:p-10 lg:p-12 overflow-hidden break-words">
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#E3F2F7] leading-snug tracking-tight mb-6 break-words">
              {/* Non-breaking hyphens keep words like "co-activator" whole
                  instead of wrapping after the "-". */}
              {noBreakHyphens(pub?.title ?? "")}
            </h1>

            <div className="space-y-3 mb-8">
              {(pub?.authors?.length ?? 0) > 0 && (
                <div className="flex items-start gap-2.5 text-sm sm:text-base text-[#E3F2F7]/60">
                  <Users size={17} className="mt-0.5 shrink-0 text-[#00E5FF]" />
                  <span className="min-w-0 leading-relaxed break-words">{pub?.authors ?? ""}</span>
                </div>
              )}
              {(pub?.venue?.length ?? 0) > 0 && (
                <div className="flex items-center gap-2.5 text-sm sm:text-base text-[#E3F2F7]/60">
                  <BookOpen size={17} className="shrink-0 text-[#00E5FF]" />
                  <span className="min-w-0 font-medium break-words">{pub?.venue ?? ""}</span>
                </div>
              )}
              {(pub?.year ?? 0) > 0 && (
                <div className="flex items-center gap-2.5 text-sm sm:text-base text-[#E3F2F7]/60">
                  <Calendar size={17} className="shrink-0 text-[#00E5FF]" />
                  <span className="font-mono">{pub?.year ?? ""}</span>
                </div>
              )}
              {(pub?.links?.length ?? 0) > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {(pub?.links ?? []).map((link, i) => {
                    const Icon = iconForColumn(link?.column ?? "");
                    return (
                      <a
                        key={`${link?.url ?? ""}-${i}`}
                        href={safeExternalUrl(link?.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#00E5FF] border border-[#1A3A4A] rounded-full px-3 py-1.5 hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/5 transition-colors"
                      >
                        <Icon size={14} className="shrink-0" />
                        {link?.label ?? ""}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Figure beside the description */}
            <div className="border-t border-[#E3F2F7]/12 pt-8">
              <div className="flex flex-col md:flex-row gap-7 md:gap-9">
              {hasImage && (
  <div className="w-full md:w-[300px] shrink-0">
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#102132] border border-[#1A3A4A]">
      <Image
        src={pub?.image ?? ""}
        alt={`Figure from ${pub?.title ?? "the publication"}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 300px"
      />
    </div>
  </div>
)}

                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-lg sm:text-xl font-semibold text-[#E3F2F7] mb-3">
                    Summary
                  </h2>
                  {hasSummary ? (
                    <p className="text-sm sm:text-base text-[#E3F2F7]/60 leading-relaxed break-words">
                    {renderRichText(pub?.summary ?? "")}
                  </p>
                  ) : (
                    <p className="text-sm text-[#E3F2F7]/50 leading-relaxed">
                      No summary has been added for this publication yet.
                    </p>
                  )}

                  {hasUrl ? (
                    <a
                      href={safeExternalUrl(pub?.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-accent mt-7 !text-black"
                    >
                      <ExternalLink size={16} /> Read the paper
                    </a>
                  ) : (
                    <p className="mt-7 text-sm text-[#E3F2F7]/50">
                      No external link has been added for this publication yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
