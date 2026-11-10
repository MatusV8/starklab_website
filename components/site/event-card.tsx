"use client";

import { useState, useRef, useEffect } from "react";
import { LabEvent } from "@/lib/data";
import { Calendar, Expand } from "lucide-react";
import Image from "next/image";
import { ImageLightbox } from "@/components/site/image-lightbox";
import { renderRichText } from "@/lib/rich-text";

interface EventCardProps {
  event: LabEvent;
  index: number;
}


/** Formats a stored ISO "YYYY-MM-DD" event date as "DD.MM.YYYY". */
function formatEventDate(iso: string): string {
  const match = iso?.match?.(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}.${match[2]}.${match[1]}` : iso ?? "";
}

export function EventCard({ event, index }: EventCardProps) {
  const [zoomed, setZoomed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const pRef = useRef<HTMLParagraphElement>(null);
  // Height of the photo panel while the text is collapsed. When "Show more"
  // makes the card taller, the panel keeps this height instead of stretching
  // (which made the photo look zoomed in).
  const imgPanelRef = useRef<HTMLDivElement>(null);
  const [lockedImgHeight, setLockedImgHeight] = useState<number | null>(null);
  const toggleExpanded = () => {
    if (!expanded) setLockedImgHeight(imgPanelRef.current?.offsetHeight ?? null);
    else setLockedImgHeight(null);
    setExpanded((v) => !v);
  };
  const [imgBroken, setImgBroken] = useState(false);
  const hasImage = !!(event?.image && !imgBroken && (event?.image?.length ?? 0) > 0);
  const isEven = (index ?? 0) % 2 === 0;

  useEffect(() => {
    const el = pRef.current;
    if (!el) return;
    const check = () => {
      // compare full height vs clamped height (only meaningful when collapsed)
      setOverflowing(el.scrollHeight > el.clientHeight + 1);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [event?.description, expanded]);

  // Format date deterministically as DD.MM.YYYY
  const formattedDate = formatEventDate(event?.date ?? "");

  return (
    <>
    <div className="surface surface-hover overflow-hidden">
      <div
        className={`flex flex-col ${
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        {/* Image panel — only when a photo exists */}
        {hasImage && (
          <div
            ref={imgPanelRef}
            className={`relative w-full md:w-2/5 shrink-0 min-h-[220px] md:min-h-[300px] bg-[#F4F4F5] ${
              expanded && lockedImgHeight ? "md:self-start" : ""
            }`}
            style={expanded && lockedImgHeight ? { height: lockedImgHeight } : undefined}
          >
            <button
              type="button"
              onClick={() => setZoomed(true)}
              aria-label={`Enlarge photo: ${event?.title ?? "event"}`}
              className="group absolute inset-0 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E07A5F]"
            >
              <Image
                src={event?.image ?? ""}
                alt={event?.title ?? "Event"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                onError={() => setImgBroken(true)}
              />
              <span className="pointer-events-none absolute bottom-3 right-3 grid place-items-center w-9 h-9 rounded-full bg-[#14161B]/55 text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                <Expand size={16} strokeWidth={1.75} />
              </span>
            </button>
          </div>
        )}

        {/* Text panel */}
        <div className="p-7 sm:p-9 flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF] mb-3">
            <Calendar size={14} />
            <span suppressHydrationWarning>{formattedDate}</span>
          </div>
          <h3 className="type-card-title text-[#E3F2F7] mb-3 break-words min-w-0">
            {event?.title ?? ""}
          </h3>
          <p
  ref={pRef}
  className="type-card-body text-[#E3F2F7]/60 whitespace-pre-line"
  style={{
    hyphens: "auto",
    WebkitHyphens: "auto",
    overflowWrap: "break-word",
    ...(expanded
      ? {}
      : {
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 4,
          overflow: "hidden",
        }),
  }}
>
  {renderRichText(event?.description ?? "")}
</p>
{(overflowing || expanded) && (
  <button
    type="button"
    onClick={toggleExpanded}
    className="mt-2 self-start text-xs font-mono uppercase tracking-widest text-[#00E5FF] hover:underline focus:outline-none"
  >
    {expanded ? "Show less" : "Show more"}
  </button>
)}
        </div>
      </div>
      </div>

      <ImageLightbox
        src={zoomed ? event?.image ?? null : null}
        caption={event?.title ?? ""}
        onClose={() => setZoomed(false)}
      />
    </>
  );
}
