"use client";

import { LabEvent } from "@/lib/data";
import { motion } from "framer-motion";
import { Calendar, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { renderRichText } from "@/lib/rich-text";

/** Formats a stored ISO "YYYY-MM-DD" event date as "DD.MM.YYYY". */
function formatEventDate(iso: string): string {
  const match = iso?.match?.(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}.${match[2]}.${match[1]}` : iso ?? "";
}

interface EventsStripProps {
  events: LabEvent[];
}

/** Grid of the most recent events; each card links to /events. */
export function EventsStrip({ events }: EventsStripProps) {
  const list = events ?? [];
  if ((list?.length ?? 0) === 0) return null;

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(list ?? [])?.map?.((event: LabEvent, idx: number) => {
          const hasImage = (event?.image?.length ?? 0) > 0;
          return (
            <motion.div
              key={event?.id ?? idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.35, delay: (idx ?? 0) * 0.05 }}
              className="h-full"
            >
              <Link
                href="/events"
                className="group flex flex-col h-full surface surface-hover overflow-hidden hover:shadow-[var(--shadow-md)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                aria-label={`See all events, including ${event?.title ?? "this event"}`}
              >
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  {hasImage ? (
                    <Image
                      src={event?.image ?? ""}
                      alt={event?.title ?? "Event"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    // Placeholder for items without an image, so every card
                    // in the row has the same layout.
                    <div
                      aria-hidden
                      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#0E2236] via-[#0A1828] to-[#06101C] group-hover:scale-105 transition-transform duration-500"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(0,229,255,0.14),transparent_60%)]" />
                      <Newspaper size={30} strokeWidth={1.5} className="relative text-[#00E5FF]/70" />
                      <span className="relative font-display text-sm font-semibold tracking-tight text-[#E3F2F7]/70">
                        Stark Lab News
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-5 border-t border-[#1C2B3E]">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF] mb-2">
                    <Calendar size={13} />
                    <span suppressHydrationWarning>{formatEventDate(event?.date ?? "")}</span>
                  </div>
                  <h3 className="type-card-title-sm text-[#E3F2F7] mb-2 group-hover:text-[#00E5FF] transition-colors line-clamp-2">
                    {event?.title ?? ""}
                  </h3>
                  <p className="type-card-body text-[#E3F2F7]/60 line-clamp-3">
                    {/* The card is itself a link, so links in the text show
                        as their label only. */}
                    {renderRichText(event?.description ?? "", { linksAsText: true })}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        }) ?? null}
      </div>
    </div>
  );
}