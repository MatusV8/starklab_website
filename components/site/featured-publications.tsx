"use client";

import { Publication } from "@/lib/data";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FeaturedPublicationsProps {
  publications: Publication[];
}

/** Highlight cards for the most recent papers, shown on the home page. */
export function FeaturedPublications({ publications }: FeaturedPublicationsProps) {
  const list = publications ?? [];
  if ((list?.length ?? 0) === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {(list ?? [])?.map?.((pub: Publication, idx: number) => {
        const hasImage = (pub?.image?.length ?? 0) > 0;
        return (
          <motion.div
            key={pub?.slug ?? idx}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.35, delay: (idx ?? 0) * 0.05 }}
            className="h-full"
          >
            <Link
              href={`/publications/${pub?.slug ?? ""}`}
              className="group flex flex-col h-full surface surface-hover overflow-hidden hover:shadow-[var(--shadow-md)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
            >
              {hasImage && (
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={pub?.image ?? ""}
                    alt={`Figure from ${pub?.title ?? "the publication"}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              <div
                className={`flex flex-col flex-1 p-5 ${
                  hasImage ? "border-t border-[#1C2B3E]" : ""
                }`}
              >
                <p className="text-xs font-mono uppercase tracking-wider text-[#00E5FF] mb-2">
                  {pub?.venue ?? ""}
                  {(pub?.year ?? 0) > 0 ? ` · ${pub?.year}` : ""}
                </p>
                <h3 className="type-card-title-sm text-[#E3F2F7] mb-2 group-hover:text-[#00E5FF] transition-colors line-clamp-3">
                  {pub?.title ?? ""}
                </h3>
                <p className="type-card-body text-[#E3F2F7]/60 line-clamp-2 mb-4">
                  {pub?.authors ?? ""}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-[#00E5FF]">
                  Read more <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          </motion.div>
        );
      }) ?? null}
    </div>
  );
}