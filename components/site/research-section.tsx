"use client";

import { useState } from "react";
import { ResearchArea } from "@/lib/data";
import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import { ImageLightbox } from "@/components/site/image-lightbox";
import { renderRichText } from "@/lib/rich-text";

interface ResearchSectionProps {
  area: ResearchArea;
  index: number;
}

// Inline image syntax within a description, on its own paragraph:
// ![Caption text](/images/research/example.jpg)
const IMAGE_RE = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const YOUTUBE_RE = /^\{\{youtube:([A-Za-z0-9_-]{11})(?::(\d+))?\}\}$/;

// Caption emphasis markers (**bold**, *italic*) are only rendered in the
// caption itself; strip them where the caption is used as plain text
// (alt text, aria-label). The lightbox renders them itself.
const stripEmphasis = (text: string): string =>
  (text ?? "").replace(/\*\*|\*/g, "");

/**
 * Full-width research section used on the Research page. Sections are not
 * boxed: they are separated from one another by an alternating background
 * shade that spans the whole width of the page.
 */
export function ResearchSection({ area, index }: ResearchSectionProps) {
  // Alternating bands, matching the homepage: the first section (and every
  // even index) sits on the darker page colour, odd sections get the lighter band.
  const shaded = (index ?? 0) % 2 === 1;
  const paragraphs = (area?.description ?? area?.summary ?? "").split(
    /\n\s*\n/
  );
  const [zoomed, setZoomed] = useState<{ src: string; caption: string } | null>(
    null
  );

  return (
    <section
      id={area?.id ?? undefined}
      className={`scroll-mt-24 py-16 sm:py-20 ${shaded ? "bg-[#0B1524]" : "bg-[#050A14]"}`}
    >
      <div className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#E3F2F7] tracking-tight text-left">
            {area?.title ?? ""}
          </h2>
          <span className="block mt-5 h-[4px] w-12 rounded-full bg-[#00E5FF]" />
          <div className="mt-7 text-[#E3F2F7]/70 leading-[1.85] text-base sm:text-lg space-y-5">
            {paragraphs.map((para: string, i: number) => {
              const youtubeMatch = para.trim().match(YOUTUBE_RE);
              if (youtubeMatch) {
                const [, videoId, start] = youtubeMatch;
                const startParam = start ? `?start=${start}` : "";
                return (
                  <figure key={i} className="!mt-8 !mb-8 flex justify-center">
                    <div className="w-full max-w-5xl overflow-hidden rounded-xl aspect-video bg-[#0C1727]">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${videoId}${startParam}`}
                        title={`${area?.title ?? "Research"} video`}
                        className="h-full w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </figure>
                );
              }
              const imageMatch = para.trim().match(IMAGE_RE);
              if (imageMatch) {
                const [, caption, src] = imageMatch;
                const trimmedSrc = src.trim();
                return (
                  <figure key={i} className="!mt-8 !mb-8 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() =>
                        setZoomed({ src: trimmedSrc, caption: caption || area?.title || "" })
                      }
                      aria-label={`Enlarge photo: ${stripEmphasis(caption) || area?.title || ""}`}
                      className="group relative block w-full max-w-5xl rounded-xl overflow-hidden bg-[#0C1727] cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={trimmedSrc}
                        alt={stripEmphasis(caption) || area?.title || ""}
                        className="block max-w-full w-auto h-auto max-h-[720px] mx-auto object-contain"
                      />
                      <span className="pointer-events-none absolute bottom-3 right-3 grid place-items-center w-9 h-9 rounded-full bg-[#14161B]/55 text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                        <Expand size={16} strokeWidth={1.75} />
                      </span>
                    </button>
                    {caption && (
                      <figcaption className="mt-3 text-sm text-[#E3F2F7]/50 text-center w-3/4">
                        {renderRichText(caption)}
                      </figcaption>
                    )}
                  </figure>
                );
              }
              return <p key={i}>{renderRichText(para)}</p>;
            })}
          </div>
        </motion.div>
      </div>

      <ImageLightbox
        src={zoomed?.src ?? null}
        caption={zoomed?.caption ?? ""}
        onClose={() => setZoomed(null)}
      />
    </section>
  );
}
